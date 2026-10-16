import Dexie, { type Table } from 'dexie';
import { LocalError } from '../domain/errors';
import type { Envelope } from '../security/crypto';
export interface VaultRecord {
  id: 'primary';
  envelope: Envelope;
  storageRevision: number;
}
export interface Preference {
  key: 'theme' | 'textSize' | 'reducedMotionOverride' | 'installHelpDismissed';
  value: string;
}
/** Evita colisiones accidentales; una subruta NO crea aislamiento de seguridad por origen. */
export function deploymentStorageName() {
  const base = import.meta.env.BASE_URL;
  return base === '/' ? 'refugio' : `refugio:${base}`;
}
export function deploymentChannelName() {
  return `${deploymentStorageName()}-vault`;
}
export class RefugioDB extends Dexie {
  vault!: Table<VaultRecord, string>;
  preferences!: Table<Preference, string>;
  constructor(name = deploymentStorageName()) {
    super(name);
    this.version(1).stores({ vault: 'id', preferences: 'key' });
  }
}
export interface Repository {
  read(): Promise<VaultRecord | undefined>;
  commit(envelope: Envelope, expected: number | null, guard: () => void): Promise<number>;
  clear(): Promise<void>;
}
function storageError(error: unknown): never {
  if (error instanceof LocalError) throw error;
  throw new LocalError(
    error instanceof Error && error.name === 'QuotaExceededError'
      ? 'QUOTA_EXCEEDED'
      : 'STORAGE_UNAVAILABLE',
  );
}
export class VaultRepository implements Repository {
  constructor(public db = new RefugioDB()) {}
  async read() {
    try {
      return await this.db.vault.get('primary');
    } catch (e) {
      return storageError(e);
    }
  }
  async commit(envelope: Envelope, expected: number | null, guard: () => void): Promise<number> {
    try {
      return await this.db.transaction('rw', this.db.vault, async () => {
        const previous = await this.db.vault.get('primary');
        guard();
        if ((previous?.storageRevision ?? null) !== expected) throw new LocalError('CONFLICT');
        const revision = expected === null ? 0 : expected + 1;
        await this.db.vault.put({ id: 'primary', envelope, storageRevision: revision });
        return revision;
      });
    } catch (e) {
      return storageError(e);
    }
  }
  async clear() {
    try {
      await this.db.transaction('rw', [this.db.vault, this.db.preferences], async () => {
        await this.db.vault.clear();
        await this.db.preferences.clear();
      });
    } catch (e) {
      storageError(e);
    }
  }
}
