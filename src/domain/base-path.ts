export function normalizeBasePath(value = '/'): string {
  const base = value.endsWith('/') ? value : `${value}/`;
  if (!/^\/(?:[A-Za-z0-9_-][A-Za-z0-9._-]*\/)*$/.test(base)) {
    throw new Error('BASE_PATH debe ser una ruta absoluta, como / o /refugio/.');
  }
  return base;
}
