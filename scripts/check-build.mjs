import { readdir, readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { normalizeBasePath } from '../src/domain/base-path.ts';
const assets = await readdir('dist/assets');
const js = assets.filter((f) => f.endsWith('.js'));
const jsGzip = (
  await Promise.all(js.map(async (f) => gzipSync(await readFile(join('dist/assets', f))).length))
).reduce((a, b) => a + b, 0);
async function size(dir) {
  let sum = 0;
  for (const entry of await readdir(dir, { withFileTypes: true }))
    sum += entry.isDirectory()
      ? await size(join(dir, entry.name))
      : (await stat(join(dir, entry.name))).size;
  return sum;
}
const total = await size('dist');
const manifest = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'));
if (jsGzip > 250 * 1024 || total > 2 * 1024 * 1024) throw new Error('Presupuesto NFR014 excedido');
const expectedBase = normalizeBasePath(process.env.BASE_PATH ?? '/');
if (
  manifest.start_url !== expectedBase ||
  manifest.scope !== expectedBase ||
  !manifest.icons.some((i) => i.sizes === '512x512')
)
  throw new Error('Manifiesto incompleto');
const html = await readFile('dist/index.html', 'utf8');
if (
  /<script[^>]+src=["']https?:/i.test(html) ||
  /sourceMappingURL/.test(await readFile('dist/sw.js', 'utf8'))
)
  throw new Error('Recurso externo o sourcemap público inesperado');
console.log(
  JSON.stringify(
    {
      jsGzipKiB: +(jsGzip / 1024).toFixed(2),
      totalBuildKiB: +(total / 1024).toFixed(2),
      budgetsPassed: true,
    },
    null,
    2,
  ),
);
