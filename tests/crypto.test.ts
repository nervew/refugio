import { describe, it, expect, beforeAll } from 'vitest';
import {
  canonical,
  derive,
  encode,
  decode,
  newMaterial,
  open,
  parseEnvelope,
  safeParse,
  seal,
  normalizedSecret,
  type Material,
  type Envelope,
} from '../src/security/crypto';
import { newVault, MAX_FILE } from '../src/domain/model';
const phrase = 'luna bosque faro montaña libre';
let material: Material;
let envelope: Envelope;
beforeAll(async () => {
  material = await newMaterial(phrase);
  envelope = await seal(newVault(), material);
});

async function legacyEnvelope(raw: string): Promise<Envelope> {
  const { ciphertext: _ciphertext, ...header } = envelope;
  header.cipher = { ...header.cipher, iv: encode(crypto.getRandomValues(new Uint8Array(12))) };
  const bytes = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: decode(header.cipher.iv),
      additionalData: new TextEncoder().encode(canonical(header)),
      tagLength: 128,
    },
    material.key,
    new TextEncoder().encode(raw),
  );
  return { ...header, ciphertext: encode(new Uint8Array(bytes)) };
}
describe('T-008/009/015: cifrado real WebCrypto', () => {
  it('deriva una clave no extraíble, parámetros acotados y envelope autenticado', async () => {
    expect(material.key.extractable).toBe(false);
    expect(material.kdf.iterations).toBeGreaterThanOrEqual(600000);
    expect(material.kdf.iterations).toBeLessThanOrEqual(2000000);
    expect(decode(material.kdf.salt)).toHaveLength(16);
    expect(decode(envelope.cipher.iv)).toHaveLength(12);
    expect((await open(envelope, material.key)).schemaVersion).toBe(1);
    await expect(crypto.subtle.exportKey('raw', material.key)).rejects.toThrow();
  });
  it('un nuevo cifrado de la misma instantánea usa otro IV y ciphertext', async () => {
    const data = await open(envelope, material.key);
    const next = await seal(data, material);
    expect(next.cipher.iv).not.toBe(envelope.cipher.iv);
    expect(next.ciphertext).not.toBe(envelope.ciphertext);
    expect(await open(next, material.key)).toEqual(data);
  });
  it('rechaza frase errónea y modificación del ciphertext sin devolver texto', async () => {
    await expect(
      open(envelope, await derive('frase incorrecta', material.kdf)),
    ).rejects.toMatchObject({ code: 'UNLOCK_FAILED' });
    const bytes = decode(envelope.ciphertext);
    bytes[20] ^= 1;
    await expect(
      open({ ...envelope, ciphertext: encode(bytes) }, material.key),
    ).rejects.toMatchObject({ code: 'UNLOCK_FAILED' });
  });
  it('autentica la cabecera, no solo el contenido', async () => {
    const changed = {
      ...envelope,
      kdf: {
        ...envelope.kdf,
        iterations: envelope.kdf.iterations === 2000000 ? 1999999 : envelope.kdf.iterations + 1,
      },
    };
    await expect(open(changed, material.key)).rejects.toMatchObject({ code: 'UNLOCK_FAILED' });
  });
  it('normaliza NFC sin recortar espacios y cuenta puntos de código', () => {
    expect(normalizedSecret('  cafe\u0301 de bosque y luna  ', true)).toBe(
      '  café de bosque y luna  ',
    );
    expect(() => normalizedSecret('🔑'.repeat(8), true)).toThrow();
    expect(() => normalizedSecret('🔑'.repeat(16), true)).not.toThrow();
  });
  it.each([0, 599999, 2000001, 1e12, 600000.5])(
    'rechaza un coste KDF hostil %s antes de derivar',
    (iterations) => {
      expect(() => parseEnvelope({ ...envelope, kdf: { ...envelope.kdf, iterations } })).toThrow();
    },
  );
  it('rechaza esquema/algoritmos desconocidos y representaciones base64 alternativas', () => {
    expect(() => parseEnvelope({ ...envelope, formatVersion: 2 })).toThrow('UNSUPPORTED_VERSION');
    expect(() => parseEnvelope({ ...envelope, unexpected: true })).toThrow();
    expect(() =>
      parseEnvelope({ ...envelope, cipher: { ...envelope.cipher, name: 'AES-CBC' } }),
    ).toThrow();
    expect(() => decode('ab==')).toThrow();
  });
  it('limita tamaño y profundidad antes de interpretar un archivo', () => {
    expect(() => safeParse(' '.repeat(MAX_FILE + 1))).toThrow('FILE_TOO_LARGE');
    expect(() => safeParse('['.repeat(13) + '0' + ']'.repeat(13))).toThrow('INVALID_FILE');
    expect(safeParse('{"text":"[contenido no estructural]"}')).toEqual({
      text: '[contenido no estructural]',
    });
  });
  it('vuelve a abrir un plan después de vaciar un campo opcional', async () => {
    const data = newVault();
    data.profile.regionCode = undefined;
    const saved = await seal(data, material);
    expect((await open(saved, material.key)).profile.regionCode).toBeUndefined();
  });
  it('recupera una bóveda histórica autenticada sin alterar texto del usuario', async () => {
    const data = newVault();
    data.profile.regionCode = 'CO-DC';
    data.reflections.push({
      id: crypto.randomUUID(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      situation: 'Texto literal: undefined, \"campo\":undefined, barras \\\\ y comillas \"',
      vulnerabilities: [],
      emotions: [],
      thoughts: [],
      bodySensations: [],
      impulses: [],
      skillIds: [],
    });
    const raw = JSON.stringify(data).replace('"regionCode":"CO-DC"', '"regionCode":undefined');
    const old = await legacyEnvelope(raw);
    const recovered = await open(old, material.key);
    expect(recovered.profile.regionCode).toBeUndefined();
    expect(recovered.reflections).toEqual(data.reflections);
    expect(await open(await seal(recovered, material), material.key)).toEqual(recovered);
    await expect(open(old, await derive('frase incorrecta', old.kdf))).rejects.toMatchObject({
      code: 'UNLOCK_FAILED',
    });
  });
  it('la compatibilidad no ejecuta código ni acepta arrays rotos u otros datos inválidos', async () => {
    const raw = JSON.stringify(newVault());
    for (const broken of [
      raw.replace('"reflections":[]', '"reflections":[undefined]'),
      raw.replace('"reflections":[]', '"reflections":undefined()'),
      raw.replace('"reflections":[]', '"reflections":undefinedevil'),
    ])
      await expect(open(await legacyEnvelope(broken), material.key)).rejects.toThrow(
        'INVALID_FILE',
      );
    const invalid = raw.replace('"reflections":[]', '"reflections":undefined');
    await expect(open(await legacyEnvelope(invalid), material.key)).rejects.toThrow(
      'INVALID_INPUT',
    );
    expect(() => safeParse('{"regionCode":undefined}')).toThrow('INVALID_FILE');
  });
  it('ordena AAD de forma recursiva y determinista', () => {
    expect(canonical({ z: 2, a: { c: 1, b: 0 } })).toBe('{"a":{"b":0,"c":1},"z":2}');
  });
});
