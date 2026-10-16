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
  it('ordena AAD de forma recursiva y determinista', () => {
    expect(canonical({ z: 2, a: { c: 1, b: 0 } })).toBe('{"a":{"b":0,"c":1},"z":2}');
  });
});
