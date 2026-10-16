import { z } from 'zod';
import { LocalError } from '../domain/errors';
import { MAX_FILE, MAX_PAYLOAD, validatePayload, type VaultPayload } from '../domain/model';
const MIN_ITERATIONS = 600_000;
const MAX_ITERATIONS = 2_000_000;
const utf8 = new TextEncoder();
const b64 = z.string().regex(/^[A-Za-z0-9_-]+$/);
const envelopeSchema = z.strictObject({
  format: z.literal('refugio-vault'),
  formatVersion: z.literal(1),
  kdf: z.strictObject({
    name: z.literal('PBKDF2'),
    hash: z.literal('SHA-256'),
    iterations: z.number().int().min(MIN_ITERATIONS).max(MAX_ITERATIONS),
    salt: b64,
  }),
  cipher: z.strictObject({
    name: z.literal('AES-GCM'),
    keyBits: z.literal(256),
    iv: b64,
    tagBits: z.literal(128),
  }),
  ciphertext: b64,
});
export type Envelope = z.infer<typeof envelopeSchema>;
export type Material = { key: CryptoKey; kdf: Envelope['kdf'] };
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object')
    return `{${Object.entries(value)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`)
      .join(',')}}`;
  return JSON.stringify(value);
}
export function encode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 32768)
    binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function decode(value: string): Uint8Array<ArrayBuffer> {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error();
    const bytes = Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (c) =>
      c.charCodeAt(0),
    );
    if (encode(bytes) !== value) throw new Error();
    return bytes;
  } catch {
    throw new LocalError('INVALID_FILE');
  }
}
export function safeParse(raw: string, max = MAX_FILE): unknown {
  if (utf8.encode(raw).length > max) throw new LocalError('FILE_TOO_LARGE');
  let depth = 0,
    quoted = false,
    escaped = false;
  for (const c of raw) {
    if (quoted) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === '{' || c === '[') {
      if (++depth > 12) throw new LocalError('INVALID_FILE');
    } else if (c === '}' || c === ']') depth--;
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new LocalError('INVALID_FILE');
  }
}
export function parseEnvelope(input: unknown): Envelope {
  if (input && typeof input === 'object' && 'formatVersion' in input && input.formatVersion !== 1)
    throw new LocalError('UNSUPPORTED_VERSION');
  const result = envelopeSchema.safeParse(input);
  if (!result.success) throw new LocalError('INVALID_FILE');
  const e = result.data;
  if (
    decode(e.kdf.salt).length !== 16 ||
    decode(e.cipher.iv).length !== 12 ||
    decode(e.ciphertext).length < 16 ||
    e.ciphertext.length > MAX_FILE
  )
    throw new LocalError('INVALID_FILE');
  return e;
}
export function normalizedSecret(value: string, creating = false): string {
  const secret = value.normalize('NFC');
  if ([...secret].length < (creating ? 16 : 1) || [...secret].length > 4096)
    throw new LocalError('INVALID_INPUT');
  return secret;
}
function subtle(): SubtleCrypto {
  if (!globalThis.crypto?.subtle) throw new LocalError('CRYPTO_UNAVAILABLE');
  return crypto.subtle;
}
export async function derive(secret: string, kdf: Envelope['kdf']): Promise<CryptoKey> {
  const raw = utf8.encode(normalizedSecret(secret));
  try {
    const base = await subtle().importKey('raw', raw, 'PBKDF2', false, ['deriveKey']);
    return await subtle().deriveKey(
      { name: 'PBKDF2', hash: 'SHA-256', salt: decode(kdf.salt), iterations: kdf.iterations },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  } finally {
    raw.fill(0);
  }
}
export async function newMaterial(secret: string): Promise<Material> {
  subtle();
  normalizedSecret(secret, true);
  const kdf: Envelope['kdf'] = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: encode(crypto.getRandomValues(new Uint8Array(16))),
    iterations: MIN_ITERATIONS,
  };
  const start = performance.now();
  let key = await derive(secret, kdf);
  const elapsed = Math.max(1, performance.now() - start);
  const calibrated = Math.max(
    MIN_ITERATIONS,
    Math.min(MAX_ITERATIONS, Math.round((MIN_ITERATIONS * 750) / elapsed)),
  );
  if (calibrated > MIN_ITERATIONS) {
    kdf.iterations = calibrated;
    key = await derive(secret, kdf);
  }
  return { key, kdf };
}
function aad(e: Omit<Envelope, 'ciphertext'>): Uint8Array<ArrayBuffer> {
  return utf8.encode(canonical(e));
}
export async function seal(payload: VaultPayload, material: Material): Promise<Envelope> {
  const header: Omit<Envelope, 'ciphertext'> = {
    format: 'refugio-vault',
    formatVersion: 1,
    kdf: { ...material.kdf },
    cipher: {
      name: 'AES-GCM',
      keyBits: 256,
      tagBits: 128,
      iv: encode(crypto.getRandomValues(new Uint8Array(12))),
    },
  };
  const raw = utf8.encode(canonical(validatePayload(payload)));
  try {
    const ciphertext = await subtle().encrypt(
      {
        name: 'AES-GCM',
        iv: decode(header.cipher.iv),
        additionalData: aad(header),
        tagLength: 128,
      },
      material.key,
      raw,
    );
    return { ...header, ciphertext: encode(new Uint8Array(ciphertext)) };
  } finally {
    raw.fill(0);
  }
}
export async function open(envelope: Envelope, key: CryptoKey): Promise<VaultPayload> {
  const { ciphertext, ...header } = parseEnvelope(envelope);
  let raw: Uint8Array<ArrayBuffer>;
  try {
    raw = new Uint8Array(
      await subtle().decrypt(
        {
          name: 'AES-GCM',
          iv: decode(header.cipher.iv),
          additionalData: aad(header),
          tagLength: 128,
        },
        key,
        decode(ciphertext),
      ),
    );
  } catch {
    throw new LocalError('UNLOCK_FAILED');
  }
  try {
    if (raw.length > MAX_PAYLOAD) throw new LocalError('LIMIT_REACHED');
    return validatePayload(
      safeParse(new TextDecoder('utf-8', { fatal: true }).decode(raw), MAX_PAYLOAD),
    );
  } finally {
    raw.fill(0);
  }
}
