# Mapa del repositorio

- `specs/`:18 documentos fuente y2 ADRs, preservados como diseño histórico.
- `NORTH/`:contexto, decisiones, backlog, viabilidad y12 unidades trazables.
- `src/domain/`:esquemas estrictos y acciones puras, sin dependencias de React/IndexedDB.
- `src/security/`:WebCrypto y servicio de sesión/bóveda; nunca persistir claves o frases.
- `src/storage/`:envelope cifrado, preferencias públicas permitidas y CAS transaccional Dexie.
- `src/content/`:seis guías pendientes de revisión clínica y catálogo de emergencias sin candidatos accionables.
- `src/app/`:navegación, accesibilidad, bloqueo de salida con borrador y coordinación de actualizaciones.
- `src/features/`:pantallas del plan, crisis, guías, contactos, reflexión, ajustes, recuperación y bienvenida.
- `src/platform/`:preferencias, archivos, capacidades y PWA.
- `src/sw.ts`:precache y actualizaciones por unanimidad; no claves, bóveda ni datos personales.
- `tests/`:reglas de dominio, cifrado, persistencia y E2E reales en Chromium.
- `scripts/`:servidor estático local, presupuestos del build y gates de publicación.
- `public/`:iconos propios y cabeceras de referencia; `dist/` es generado e ignorado.
- `docs/verification.md`:evidencia y límites. `release-readiness.json`:gates externos todavía no aprobados.
