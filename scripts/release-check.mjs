import { readFile } from 'node:fs/promises';
const readiness = JSON.parse(await readFile('release-readiness.json', 'utf8'));
const pending = Object.entries(readiness.gates).filter(
  ([, gate]) => !gate.approved || !gate.evidence.trim(),
);
if (pending.length) {
  console.error(
    'Publicación bloqueada; falta evidencia real para: ' + pending.map(([name]) => name).join(', '),
  );
  process.exitCode = 1;
} else
  console.log(
    'Gates documentados. Revisar evidencias y aceptación de producto antes de distribuir.',
  );
