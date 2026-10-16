import { LocalError } from '../domain/errors';
import { MAX_FILE, newVault, validatePayload, type VaultPayload } from '../domain/model';
import { derive, newMaterial, open, parseEnvelope, safeParse, seal, type Material } from './crypto';
import { VaultRepository, deploymentChannelName, type Repository } from '../storage/repository';
export const SESSION_MS = 5 * 60_000;
export type Snapshot = {
  status: 'loading' | 'absent' | 'locked' | 'unlocked' | 'unavailable';
  data: VaultPayload | null;
  hidden: boolean;
  warning: boolean;
  busy: boolean;
  conflicted: boolean;
};
export class VaultService {
  private snapshot: Snapshot = {
    status: 'loading',
    data: null,
    hidden: false,
    warning: false,
    busy: false,
    conflicted: false,
  };
  private listeners = new Set<() => void>();
  private material: Material | null = null;
  private revision: number | null = null;
  private epoch = 0;
  private lastActivity = Date.now();
  private hiddenSince: number | null = null;
  private pending = new Map<string, { data: VaultPayload; expires: number }>();
  private channel: BroadcastChannel | null = null;
  constructor(private repository: Repository = new VaultRepository()) {}
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  private publish(patch: Partial<Snapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((l) => l());
  }
  connect() {
    if (typeof BroadcastChannel !== 'undefined' && !this.channel) {
      this.channel = new BroadcastChannel(deploymentChannelName());
      this.channel.onmessage = (event) => {
        if (event.data === 'changed') {
          if (this.material) this.publish({ conflicted: true });
          else void this.init();
        } else if (['lock', 'deleted'].includes(event.data)) {
          this.lock(false);
          void this.init();
        }
      };
    }
    return () => {
      this.channel?.close();
      this.channel = null;
    };
  }
  async init() {
    const epoch = this.epoch;
    try {
      const record = await this.repository.read();
      if (epoch === this.epoch && !this.material)
        this.publish({ status: record ? 'locked' : 'absent', data: null });
    } catch {
      if (epoch === this.epoch) this.publish({ status: 'unavailable', data: null });
    }
  }
  lock(broadcast = true) {
    this.epoch++;
    this.material = null;
    this.pending.clear();
    this.revision = null;
    this.publish({
      data: null,
      status: this.snapshot.status === 'absent' ? 'absent' : 'locked',
      warning: false,
      busy: false,
    });
    if (broadcast) this.channel?.postMessage('lock');
  }
  private guard(epoch: number) {
    if (epoch !== this.epoch) throw new LocalError('SESSION_EXPIRED');
  }
  private requireSession() {
    this.tick();
    if (!this.material || !this.snapshot.data) throw new LocalError('LOCKED');
    return {
      material: this.material,
      data: this.snapshot.data,
      revision: this.revision,
      epoch: this.epoch,
    };
  }
  private async exclusive<T>(fn: () => Promise<T>): Promise<T> {
    if (this.snapshot.busy) throw new LocalError('CONFLICT');
    this.publish({ busy: true });
    try {
      return await fn();
    } finally {
      this.publish({ busy: false });
    }
  }
  private accept(data: VaultPayload, material: Material, revision: number) {
    this.material = material;
    this.revision = revision;
    this.lastActivity = Date.now();
    this.publish({ data, status: 'unlocked', warning: false, conflicted: false });
  }
  private requireCoordination() {
    if (typeof window !== 'undefined' && typeof BroadcastChannel === 'undefined')
      throw new LocalError('STORAGE_UNAVAILABLE');
  }
  async create(secret: string, confirmed: boolean) {
    return this.exclusive(async () => {
      this.requireCoordination();
      if (!confirmed) throw new LocalError('INVALID_INPUT');
      const epoch = this.epoch;
      if (await this.repository.read()) throw new LocalError('ALREADY_EXISTS');
      const material = await newMaterial(secret);
      const data = newVault();
      const envelope = await seal(data, material);
      const revision = await this.repository.commit(envelope, null, () => this.guard(epoch));
      this.guard(epoch);
      this.accept(data, material, revision);
      this.channel?.postMessage('changed');
    });
  }
  async unlock(secret: string) {
    this.requireCoordination();
    return this.exclusive(async () => {
      const epoch = this.epoch;
      const record = await this.repository.read();
      if (!record) {
        this.publish({ status: 'absent' });
        throw new LocalError('UNLOCK_FAILED');
      }
      const envelope = parseEnvelope(record.envelope);
      const key = await derive(secret, envelope.kdf);
      const data = await open(envelope, key);
      this.guard(epoch);
      this.accept(data, { key, kdf: envelope.kdf }, record.storageRevision);
    });
  }
  async change(update: (draft: VaultPayload) => void) {
    return this.exclusive(async () => {
      const session = this.requireSession();
      const draft = structuredClone(session.data);
      update(draft);
      draft.revision = (session.revision ?? 0) + 1;
      draft.updatedAt = new Date().toISOString();
      const data = validatePayload(draft);
      const envelope = await seal(data, session.material);
      const revision = await this.repository.commit(envelope, session.revision, () =>
        this.guard(session.epoch),
      );
      this.guard(session.epoch);
      this.accept(data, session.material, revision);
      this.channel?.postMessage('changed');
    });
  }
  async exportEncrypted(): Promise<Blob> {
    const { epoch, revision } = this.requireSession();
    const record = await this.repository.read();
    this.guard(epoch);
    if (!record || record.storageRevision !== revision) throw new LocalError('CONFLICT');
    return new Blob([JSON.stringify(record.envelope)], { type: 'application/octet-stream' });
  }
  async inspect(file: File, secret: string) {
    return this.exclusive(async () => {
      const epoch = this.epoch;
      if (file.size > MAX_FILE) throw new LocalError('FILE_TOO_LARGE');
      const envelope = parseEnvelope(safeParse(await file.text()));
      const data = await open(envelope, await derive(secret, envelope.kdf));
      this.guard(epoch);
      const token = crypto.randomUUID();
      this.pending.set(token, { data, expires: Date.now() + SESSION_MS });
      return {
        token,
        contacts: data.contacts.length,
        reflections: data.reflections.length,
        sections: Object.values(data.plan).filter((v) => Array.isArray(v) && v.length > 0).length,
      };
    });
  }
  cancelInspection() {
    this.pending.clear();
  }
  async replace(token: string, destinationSecret: string, confirmed: boolean) {
    this.requireCoordination();
    return this.exclusive(async () => {
      const epoch = this.epoch;
      const pending = this.pending.get(token);
      if (!confirmed || !pending || Date.now() >= pending.expires)
        throw new LocalError('CANCELLED');
      const current = await this.repository.read();
      if (current) {
        this.requireSession();
        if (current.storageRevision !== this.revision) throw new LocalError('CONFLICT');
        await open(
          current.envelope,
          await derive(destinationSecret, parseEnvelope(current.envelope).kdf),
        );
      }
      const material = await newMaterial(destinationSecret);
      const data = structuredClone(pending.data);
      data.revision = (current?.storageRevision ?? -1) + 1;
      data.updatedAt = new Date().toISOString();
      const envelope = await seal(data, material);
      const revision = await this.repository.commit(
        envelope,
        current?.storageRevision ?? null,
        () => {
          this.guard(epoch);
          if (Date.now() >= pending.expires) throw new LocalError('CANCELLED');
        },
      );
      this.guard(epoch);
      this.pending.clear();
      this.accept(data, material, revision);
      this.channel?.postMessage('changed');
    });
  }
  async changeSecret(oldSecret: string, newSecret: string) {
    return this.exclusive(async () => {
      const session = this.requireSession();
      const record = await this.repository.read();
      if (!record || record.storageRevision !== session.revision) throw new LocalError('CONFLICT');
      await open(record.envelope, await derive(oldSecret, parseEnvelope(record.envelope).kdf));
      const material = await newMaterial(newSecret);
      const data = structuredClone(session.data);
      data.revision++;
      data.updatedAt = new Date().toISOString();
      const envelope = await seal(data, material);
      const revision = await this.repository.commit(envelope, session.revision, () =>
        this.guard(session.epoch),
      );
      this.guard(session.epoch);
      this.accept(data, material, revision);
      this.channel?.postMessage('changed');
    });
  }
  async deleteAll(confirmed: boolean) {
    if (!confirmed) throw new LocalError('CANCELLED');
    this.lock();
    await this.repository.clear();
    this.publish({ status: 'absent', data: null });
    this.channel?.postMessage('deleted');
  }
  activity(now = Date.now()) {
    this.tick(now);
    if (this.material) {
      this.lastActivity = now;
      this.publish({ warning: false });
    }
  }
  visibility(hidden: boolean, now = Date.now()) {
    if (hidden) {
      this.hiddenSince = now;
      this.publish({ hidden: true });
    } else {
      this.tick(now);
      this.hiddenSince = null;
      this.publish({ hidden: false });
    }
  }
  tick(now = Date.now()) {
    if (!this.material) return;
    const idle = now - this.lastActivity;
    if (
      idle < 0 ||
      idle >= SESSION_MS ||
      (this.hiddenSince !== null &&
        (now - this.hiddenSince < 0 || now - this.hiddenSince >= SESSION_MS))
    )
      this.lock();
    else if (idle >= SESSION_MS - 30_000 && !this.snapshot.hidden) {
      if (!this.snapshot.warning) this.publish({ warning: true });
    }
  }
  async checkFocus() {
    this.tick();
    if (!this.material) return;
    const epoch = this.epoch;
    const record = await this.repository.read();
    if (epoch === this.epoch && record?.storageRevision !== this.revision) {
      this.publish({ conflicted: true });
    }
  }
}
export const vault = new VaultService();
