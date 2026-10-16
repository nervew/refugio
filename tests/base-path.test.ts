import { expect, it } from 'vitest';
import { normalizeBasePath } from '../src/domain/base-path';
it('normaliza raíz y subrutas sin permitir URLs externas o segmentos especiales', () => {
  expect(normalizeBasePath('/')).toBe('/');
  expect(normalizeBasePath('/refugio')).toBe('/refugio/');
  for (const value of [
    'https://example.test/',
    '//example.test/',
    '/../',
    '/refugio/?x',
    '/refugio/#x',
  ])
    expect(() => normalizeBasePath(value)).toThrow();
});
