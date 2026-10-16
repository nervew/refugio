# Comandos reales de verificación

Requiere Node24+ y `npm ci`.

- `npm run typecheck`: TypeScript estricto.
- `npm test`: Vitest, WebCrypto real de Node y transacciones IndexedDB simuladas con fake-indexeddb.
- `npm run build`: tipos, Vite/Workbox y presupuestos de peso del build.
- `npm run test:e2e`: Playwright sobre build de producción con CSP; Chromium del sistema o navegador instalado por Playwright.
- `npm run format:check`: Prettier para aplicación, tests, configuración y scripts.
- `npm audit --audit-level=high`: vulnerabilidades conocidas de dependencias al momento de consulta.
- `npm run check`: tipos, unitarios/integración y build.
- `npm run release:check`: exige evidencia de gates externos; su error actual es deliberado y no debe sortearse con aprobaciones ficticias.

Los E2E requieren `dist/` actualizado (`npm run build`). El workflow `.github/workflows/verify.yml` ejecuta las verificaciones; no afirmar ejecución de CI remota sin evidencia. Los reportes locales se describen en `docs/verification.md`.
