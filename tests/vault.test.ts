import { describe, it, expect, afterEach, vi } from 'vitest';
import { VaultService, SESSION_MS } from '../src/security/vault';
import {
  VaultRepository,
  RefugioDB,
  type VaultRecord,
  type Repository,
} from '../src/storage/repository';
import { LocalError } from '../src/domain/errors';
import type { Envelope } from '../src/security/crypto';
import { listItems } from '../src/domain/model';
class MemoryRepository implements Repository {
  record: VaultRecord | undefined;
  fail = false;
  async read() {
    return structuredClone(this.record);
  }
  async commit(envelope: Envelope, expected: number | null, guard: () => void) {
    guard();
    if (this.fail) throw new LocalError('QUOTA_EXCEEDED');
    if ((this.record?.storageRevision ?? null) !== expected) throw new LocalError('CONFLICT');
    const revision = expected === null ? 0 : expected + 1;
    this.record = { id: 'primary', envelope, storageRevision: revision };
    return revision;
  }
  async clear() {
    this.record = undefined;
  }
}
const phrase = 'bosque luna refugio de palabras';
afterEach(() => vi.restoreAllMocks());
describe('T-007/008/009/012/017: bóveda y recuperación', () => {
  it('crea, persiste cifrado, bloquea, falla frase errónea y vuelve a abrir', async () => {
    const repo = new MemoryRepository();
    const service = new VaultService(repo);
    await service.init();
    expect(service.getSnapshot().status).toBe('absent');
    await service.create(phrase, true);
    await service.change((d) => {
      d.plan.earlySignals = listItems('CANARIO PRIVADO');
    });
    expect(JSON.stringify(repo.record)).not.toContain('CANARIO PRIVADO');
    service.lock();
    expect(service.getSnapshot().data).toBeNull();
    await expect(service.unlock('incorrecta')).rejects.toMatchObject({ code: 'UNLOCK_FAILED' });
    expect(repo.record).toBeDefined();
    await service.unlock(phrase);
    expect(service.getSnapshot().data!.plan.earlySignals[0].text).toBe('CANARIO PRIVADO');
  });
  it('cuota y conflicto no modifican el documento confirmado ni anuncian otro estado', async () => {
    const repo = new MemoryRepository();
    const a = new VaultService(repo);
    await a.create(phrase, true);
    const previous = structuredClone(repo.record);
    repo.fail = true;
    await expect(
      a.change((d) => {
        d.plan.earlySignals = listItems('borrador');
      }),
    ).rejects.toMatchObject({ code: 'QUOTA_EXCEEDED' });
    expect(repo.record).toEqual(previous);
    expect(a.getSnapshot().data!.plan.earlySignals).toEqual([]);
    repo.fail = false;
    const b = new VaultService(repo);
    await b.unlock(phrase);
    await a.change((d) => {
      d.plan.earlySignals = listItems('ganador');
    });
    await expect(
      b.change((d) => {
        d.plan.earlySignals = listItems('obsoleto');
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
    const c = new VaultService(repo);
    await c.unlock(phrase);
    expect(c.getSnapshot().data!.plan.earlySignals[0].text).toBe('ganador');
  });
  it('avisa, bloquea a cinco minutos y comprueba suspensión antes de publicar privados', async () => {
    const service = new VaultService(new MemoryRepository());
    await service.create(phrase, true);
    const start = Date.now();
    service.activity(start);
    service.tick(start + SESSION_MS - 29000);
    expect(service.getSnapshot().warning).toBe(true);
    service.visibility(true, start + 1000);
    service.visibility(false, start + SESSION_MS + 1001);
    expect(service.getSnapshot().data).toBeNull();
    expect(service.getSnapshot().status).toBe('locked');
  });
  it('una llamada breve conserva sesión; la actividad no mantiene una sesión ya vencida', async () => {
    const service = new VaultService(new MemoryRepository());
    await service.create(phrase, true);
    const start = Date.now();
    service.activity(start);
    service.visibility(true, start + 1000);
    service.visibility(false, start + 120000);
    expect(service.getSnapshot().status).toBe('unlocked');
    service.activity(start + SESSION_MS + 1);
    expect(service.getSnapshot().status).toBe('locked');
  });
  it('restaura copia cifrada en instalación nueva y rechaza alteración sin tocar destino', async () => {
    const service = new VaultService(new MemoryRepository());
    await service.create(phrase, true);
    await service.change((d) => {
      d.plan.thoughts = listItems('Texto ficticio de copia');
    });
    const blob = await service.exportEncrypted();
    const file = new File([await blob.text()], 'test.refugio');
    const repo = new MemoryRepository();
    const destination = new VaultService(repo);
    await destination.init();
    const inspected = await destination.inspect(file, phrase);
    expect(repo.record).toBeUndefined();
    const destinationPhrase = 'otra frase del destino de prueba';
    await destination.replace(inspected.token, destinationPhrase, true);
    destination.lock();
    await expect(destination.unlock(phrase)).rejects.toMatchObject({ code: 'UNLOCK_FAILED' });
    await destination.unlock(destinationPhrase);
    expect(destination.getSnapshot().data!.plan.thoughts[0].text).toBe('Texto ficticio de copia');
    const previous = structuredClone(repo.record);
    const object = JSON.parse(await blob.text());
    object.ciphertext =
      (object.ciphertext.startsWith('A') ? 'B' : 'A') + object.ciphertext.slice(1);
    await expect(
      destination.inspect(new File([JSON.stringify(object)], 'corrupt.refugio'), phrase),
    ).rejects.toThrow();
    expect(repo.record).toEqual(previous);
  });
  it('la rotación cambia frase/sal sin cambiar copias antiguas y borrar no elimina copias externas', async () => {
    const repo = new MemoryRepository();
    const service = new VaultService(repo);
    await service.create(phrase, true);
    const copy = await service.exportEncrypted();
    const previousSalt = repo.record!.envelope.kdf.salt;
    const next = 'una nueva frase de varias palabras';
    await service.changeSecret(phrase, next);
    expect(repo.record!.envelope.kdf.salt).not.toBe(previousSalt);
    service.lock();
    await expect(service.unlock(phrase)).rejects.toThrow();
    await service.unlock(next);
    await expect(
      service.inspect(new File([await copy.text()], 'old.refugio'), phrase),
    ).resolves.toHaveProperty('token');
    await expect(service.deleteAll(false)).rejects.toMatchObject({ code: 'CANCELLED' });
    expect(repo.record).toBeDefined();
    await service.deleteAll(true);
    expect(repo.record).toBeUndefined();
    expect(service.getSnapshot().status).toBe('absent');
    expect(copy.size).toBeGreaterThan(0);
  });
  it('rechaza tokens de restauración caducados o invalidados por bloqueo', async () => {
    const service = new VaultService(new MemoryRepository());
    await service.create(phrase, true);
    const blob = await service.exportEncrypted();
    const { token } = await service.inspect(new File([await blob.text()], 'test.refugio'), phrase);
    service.lock();
    await expect(service.replace(token, phrase, true)).rejects.toMatchObject({ code: 'CANCELLED' });
  });
  it('bloquear durante un cifrado pendiente cancela la escritura sin cambiar el registro', async () => {
    const repo = new MemoryRepository();
    const service = new VaultService(repo);
    await service.create(phrase, true);
    const previous = structuredClone(repo.record);
    const saving = service.change((d) => {
      d.plan.thoughts = listItems('No debe confirmarse');
    });
    service.lock();
    await expect(saving).rejects.toMatchObject({ code: 'SESSION_EXPIRED' });
    expect(repo.record).toEqual(previous);
  });
  it('la inspección caduca a cinco minutos y no permite reemplazar el destino', async () => {
    const repo = new MemoryRepository();
    const service = new VaultService(repo);
    await service.create(phrase, true);
    const copy = await service.exportEncrypted();
    const inspected = await service.inspect(new File([await copy.text()], 'copy.refugio'), phrase);
    const previous = structuredClone(repo.record);
    const clock = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(clock + SESSION_MS + 1);
    await expect(service.replace(inspected.token, phrase, true)).rejects.toMatchObject({
      code: 'CANCELLED',
    });
    expect(repo.record).toEqual(previous);
  });
  it('dos transacciones IndexedDB con la misma revisión tienen solo un ganador', async () => {
    const db = new RefugioDB('test-' + crypto.randomUUID());
    const repo = new VaultRepository(db);
    const service = new VaultService(repo);
    await service.create(phrase, true);
    const record = (await repo.read())!;
    const outputs = await Promise.allSettled([
      repo.commit(record.envelope, 0, () => {}),
      repo.commit(record.envelope, 0, () => {}),
    ]);
    expect(outputs.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(outputs.filter((r) => r.status === 'rejected')).toHaveLength(1);
    await db.delete();
  });
});
