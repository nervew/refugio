# Decisions

Registro de lectura de los dos ADRs existentes; sus textos canónicos permanecen intactos en `specs/adr/`. Los IDs se conservan, no son dos decisiones adicionales. Nuevos cambios requieren el siguiente ID libre y referencia a la decisión superada.

## Minor

- 2026-10-15: `NORTH nivel 5` activado por solicitud explícita; no se aplica el desbloqueo gradual porque el usuario pidió todos los niveles.
- 2026-10-15: `specs/` conserva autoridad técnica; `NORTH/SPECS/` organiza ejecución y trazabilidad, sin copiar las especificaciones fuente.
- 2026-10-15: objetivo vigente `Refugio según 18 SPECS y 2 ADRs`; el último mensaje corrige la propuesta anterior `PassVault`.

- 2026-10-15: `Zod` para validación estricta en formularios, importaciones y persistencia; no confiar solo en tipos estáticos.
- 2026-10-15: `createHashRouter` para URLs públicas estables y protección de borradores también al usar historial; sin IDs privados en rutas.
- 2026-10-15: `Result` en la frontera de acciones UI; errores internos LocalError no exponen texto sensible.
- 2026-10-15: `Vitest + Playwright/axe` implementan verificación local; matriz física y validación profesional se registran aparte.

- 2026-10-15: `Sites owner-private` para evaluar Refugio desde el equipo del usuario; localhost del executor no era accesible. Esta barrera de acceso externa no incorpora cuentas/sincronización de datos al producto ni aprueba piloto público.

## ADRs

## ADR-001: Usar PWA local-first sin backend de negocio

- **Fecha:** 2026-10-15
- **Estado:** Aceptada
- **Contexto:** El plan debe estar disponible tras preparación offline y contiene información sensible; el repositorio carece de implementación previa.
- **Decisión:** Adoptar React/TypeScript/Vite, Dexie, Workbox y WebCrypto sin cuentas, sincronización, IA ni telemetría. Texto canónico: [ADR-001](../specs/adr/0001-local-first-pwa.md).
- **Consecuencias:** Menor operación y uso sin cuenta; la retención del navegador no está garantizada, exige respaldo y pruebas físicas de plataformas.
- **Alternativas consideradas:** Framework con servidor/cuentas añade operación y superficie; nativo/híbrido añade distribución y mantenimiento. Comparación completa en la fuente canónica.

## ADR-002: Cifrar la bóveda y desbloquear por sesión local

- **Fecha:** 2026-10-15
- **Estado:** Aceptada
- **Contexto:** Almacenamiento compartido o copiado puede exponer datos; desbloquear añade un coste de disponibilidad que se cubre con guías públicas.
- **Decisión:** AES-256-GCM y PBKDF2, frase mínimo16 puntos de código tras NFC sin recortar, clave no extraíble solo RAM. Perfil, parámetros, AAD y sesión completos: [ADR-002](../specs/adr/0002-local-security.md), [datos](../specs/09-data-model.md), [seguridad](../specs/11-security-and-privacy.md).
- **Consecuencias:** Protección en reposo con pérdida de recuperación si falta la frase; sesión vence según el contrato, sin defensa contra XSS activo o sistema comprometido. Auditoría pendiente.
- **Alternativas consideradas:** Texto legible y clave persistida no cubren la amenaza; WebAuthn/nativo como dependencia se pospone por compatibilidad y recuperación.

## ADR-003: Evaluar GitHub Pages para una demo pública

- **Fecha:** 2026-10-15
- **Estado:** Propuesta
- **Contexto:** Petición de evaluar Pages sobre repositorio público y evaluación Sites privada.
- **Decisión:** Build configurable por base y despliegue manual propuestos; ver [ADR canónico](../specs/adr/0003-github-pages-proposal.md).
- **Consecuencias:** Preparar compatibilidad no publica; cabeceras y aislamiento por origen son limitaciones explícitas.
- **Alternativas consideradas:** Sites privado; hosting con cabeceras configurables y dominio dedicado; Pages con dominio propio.

## 2026-10-16: autorización de demo pública en Pages

El usuario confirmó publicar la evaluación en GitHub Pages con datos ficticios. ADR-003 aceptado para ese alcance. La activación de Pages y el resultado remoto aún requieren evidencia; los gates profesionales permanecen pendientes.

## 2026-10-16: ajustes UX y recursos de Bogotá para evaluación

Por solicitud del usuario, guardar secciones, preferencias del plan, contactos y reflexiones vuelve al inicio solo tras persistir; se conserva confirmación genérica. Revisión con subagentes UX/diseño: paleta calmada con acentos y temas oscuros equivalentes. El catálogo de demo incorpora123 y106 solo para Bogotá con fuentes oficiales y fecha documental; evidencia/límites en docs/bogota-resources.md. Las revisiones editorial independiente, clínica y demás gates del piloto formal siguen pendientes.

## 2026-10-17: implementar comprensión para primer uso

El usuario autorizó implementar la auditoría UX: propósito emocional explícito, guías con nombres descriptivos y DBT opcional, separación de agenda privada/líneas de atención, estados de plan y agrupación opcional del plan. Se mantienen las seis guías, precauciones, identificadores, esquema/cifrado y consentimientos. Cambios y validación en docs/ux/2026-10-17-implementation.md. Las pruebas técnicas no sustituyen pruebas de comprensión ni revisión profesional.
