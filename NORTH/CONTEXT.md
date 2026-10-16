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
- Demo:123/106 activos solo Bogotá, cotejados con fuentes oficiales el2026-10-16; sin llamada de prueba ni aprobación clínica. Ver docs/bogota-resources.md.
- Solo datos ficticios en esta evaluación; release:check bloquea publicación sin evidencia.
- NORTH5 actualizado; los12 SPECs están implementados pero aceptación integral sigue abierta.
- Evaluación privada HTTPS desplegada en Sites; ver docs/private-deployment.json. El acceso de Sites se mantiene privado.
- Fuente de hosting versionada en repo privado Sites (/workspace/sites/refugio); fuente enviada además a GitHub mediante PR #1.
- GitHub Pages activo: run38897897430 reejecutado con éxito. Prueba real de URL run38899623865: crear/guardar/recargar/desbloquear aprobada en Chromium escritorio/móvil y WebKit. Usuario reporta botón sin respuesta; falta navegador y estado del botón para reproducir.
- UX: guardar contenido vuelve al inicio tras éxito; paleta salvia/durazno/lavanda en temas claro/oscuro. PR#2 integrada; Pages38903025400 publicado.31 unitarias,13 E2E raíz,2 subruta y6 pruebas de URL pública (38903297999) aprobadas.
- Incidencia desbloqueo: reproducido INVALID_FILE por undefined en campos opcionales al cifrar; serializador corregido y lectura histórica autenticada añadida.34 unitarias y14 E2E aprobados; publicación en curso. Ver docs/incidents/2026-10-16-vault-unlock.md.
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
