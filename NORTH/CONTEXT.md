# Context

## Now

- **Sprint:** `Implementación y depuración del MVP Refugio`.
- **Objective:** `Implementar la aplicación según los18 SPECS y2 ADRs`.
- **P1:** `Funcionalidad MVP y depuración local` — implementada;31 pruebas Vitest,12 E2E raíz y2 E2E de subruta aprobados.
- **P2:** `Aceptación para piloto público` — pendiente de gates externos; no confundir con build técnico.

## State

- React/TypeScript/Vite, Dexie, Workbox y WebCrypto implementados; build generado y preview local en4173.
- Plan, seis habilidades, crisis, contactos, reflexión, emergencias regionales, copias/importación/impresión/borrado y ajustes operativos.
- Cifrado AES-GCM, PBKDF2 acotado, clave RAM, CAS y bloqueo; sin cuentas, backend de negocio, IA o telemetría.
- Temas, responsive, axe, precache offline y coordinación segura de actualizaciones verificados en Chromium Linux.
- Fuentes/clínica, privacidad legal, auditoría independiente, lectores/usabilidad y matriz física iOS/Android pendientes.
- Catálogo de emergencias sin teléfonos accionables no verificados;123/106 no activados. Contenido clínico pending.
- Solo datos ficticios en esta evaluación; release:check bloquea publicación sin evidencia.
- NORTH5 actualizado; los12 SPECs están implementados pero aceptación integral sigue abierta.
- Evaluación privada HTTPS desplegada en Sites; ver docs/private-deployment.json. Sin acceso público, hooks o CI remota ejecutada.
- Fuente de hosting versionada en repo privado Sites (/workspace/sites/refugio); repositorio original conserva cambios locales.
- GitHub Pages: base configurable y workflow manual preparados; ADR-003 propuesto, sin publicación/remoto modificado.
- Evidencia: `docs/verification.md`; comandos reales en `.claude/rules/verify.md`.

## Next

- Cerrar gates externos del BACKLOG con revisores reales y evidencia verificable antes de piloto/datos reales.
- Ejecutar matriz física iOS/Android, instalación/SMS, lectores de pantalla, usabilidad y rendimiento en dispositivo mínimo.
- Resolver observaciones de esos controles; marcar cada SPEC completo solo al satisfacer sus criterios aplicables.
- Elegir hosting, minimizar logs técnicos y verificar cabeceras reales antes de publicar.

## History

- 2026-10-15:18 SPECS y2 ADRs de diseño completados.
- 2026-10-15:NORTH nivel5 inicializado por solicitud explícita.
- 2026-10-15:usuario autorizó continuar hasta implementación/debug; MVP implementado con30 pruebas y12 E2E locales aprobados.

- 2026-10-15: corregido acceso fallido a localhost remoto mediante despliegue HTTPS owner-private verificado.
