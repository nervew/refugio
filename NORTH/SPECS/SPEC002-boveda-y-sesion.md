# SPEC002: Bóveda cifrada y sesión local

- **ID:** SPEC002
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001, ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H1; SPEC001; integrar recuperación SPEC003 antes de introducir datos reales.
- **Trazabilidad:** RF-008 / US-008.
- **Pantallas:** S12, S13, S15.

## 🎯 Objetivo

Crear, abrir, cerrar y persistir una bóveda cifrada completa, con sesión solo RAM y escrituras atómicas.

## 🚫 Non-goals

No incluye PIN, biometría, clave persistida, cuenta ni recuperación por correo.

## 👤 User stories

Como persona usuaria quiero que mi plan permanezca privado cuando la sesión esté bloqueada. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** VaultPayload, envelope v1, storageRevision y SessionHandle; parámetros completos y límites exclusivamente en09/11.
- **Operaciones:** Vault.status/create/unlock/lock/changeSecret, Plan.read/save; Result y LocalError del contrato10.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Crear frase confirmada de mínimo16 puntos de código NFC, sin recortar espacios; generar sal y clave WebCrypto.
2. Validar documento, cifrar snapshot fuera de transacción y confirmar revisión CAS antes de escribir.
3. Desbloquear por autenticación; avisar30s antes del vencimiento visible, bloquear a5min inactivo o5min oculto.
4. Al retomar, comprobar deadline antes de pintar datos privados; guías genéricas siguen disponibles.

## ⚠️ Edge cases y manejo de errores

- Frase errónea o autenticación fallida: mismo error sin borrar bóveda ni filtrar datos.
- Conflicto entre pestañas: rechazar escritura obsoleta; nunca sobrescribir silenciosamente.
- Sin WebCrypto, cuota o transacción abortada: no fallback en claro ni anuncio falso de guardado.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001, ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] PBKDF2 600000–2000000, sal16B, AES256-GCM IV12B/tag128 y AAD canónica se ajustan a09/11 y ADR002.
- [x] Canarios personales no aparecen en reposo en IndexedDB sin cifrar, URLs, cachés, logs o DOM bloqueado.
- [x] Bloqueo manual, reload, suspensión y vencimiento coordinado limpian UI/estado privado sin impedir ayuda pública.
- [x] Dos escrituras sobre la misma revisión producen un commit y un conflicto explícito.
- [ ] Casos de T-008, T-015, T-017 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [08: technical-architecture](../../specs/08-technical-architecture.md)
- [09: data-model](../../specs/09-data-model.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [11: security-and-privacy](../../specs/11-security-and-privacy.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
