# SPECS de ejecución NORTH

Los 18 documentos y2 ADRs de `specs/` conservan autoridad técnica. Estos 12 SPECs agrupan trabajo implementable por feature; no son copias ni reemplazos de los18. Estado actual: funcionalidad implementada y depurada localmente; los SPECs permanecen en Implementando hasta cerrar la aceptación integral y los gates que les correspondan.

## Orden y cobertura funcional

| SPEC | Hito | RF / US | Suite principal |
|---|---|---|---|
| [SPEC001 · Base PWA y disponibilidad offline](SPEC001-base-pwa-offline.md) | H1 | RF-007, RF-011 / US-007, US-011 | T-007, T-011, T-013, T-017 |
| [SPEC002 · Bóveda cifrada y sesión local](SPEC002-boveda-y-sesion.md) | H1 | RF-008 / US-008 | T-008, T-015, T-017 |
| [SPEC003 · Respaldo, restauración, impresión y borrado](SPEC003-respaldo-recuperacion-y-borrado.md) | H1–H2 | RF-009, RF-012 / US-009, US-012 | T-009, T-012, T-015, T-017 |
| [SPEC004 · Preparar y editar el plan personal](SPEC004-plan-personal.md) | H2 | RF-001 / US-001 | T-001, T-017 |
| [SPEC005 · Contactos y solicitud explícita de apoyo](SPEC005-red-de-apoyo.md) | H2 | RF-005 / US-005 | T-005, T-015 |
| [SPEC006 · Catálogo de seis habilidades DBT](SPEC006-seis-habilidades-dbt.md) | H3 | RF-002 / US-002 | T-002, T-018 |
| [SPEC007 · Modo crisis de acceso inmediato](SPEC007-modo-crisis.md) | H3 | RF-003 / US-003 | T-003, T-007, T-008, T-020 |
| [SPEC008 · Recursos oficiales por país y región](SPEC008-emergencias-regionales.md) | H0/H3 | RF-006 / US-006 | T-006, T-018 |
| [SPEC009 · Registro y reflexión posterior](SPEC009-reflexion-voluntaria.md) | H4 | RF-004 / US-004 | T-004, T-017, T-018 |
| [SPEC010 · Sistema visual y accesibilidad transversal](SPEC010-sistema-visual-y-accesibilidad.md) | H1–H4 | RF-010 / US-010 | T-010, T-014, T-020 |
| [SPEC011 · Actualización segura e instalación](SPEC011-actualizacion-y-migraciones.md) | H1/H3 | RF-011 / US-011 | T-011, T-013, T-017 |
| [SPEC012 · Evidencia de verificación y liberación](SPEC012-verificacion-y-liberacion.md) | H0–H4 | RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RF-008, RF-009, RF-010, RF-011, RF-012 / US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012 | T-001–020 |

Secuencia de trabajo: SPEC001 → SPEC002 → SPEC003 → SPEC004/005 → SPEC006/007/008 → SPEC009. SPEC010 y SPEC012 acompañan desde el principio; SPEC011 se diseña en H1 y se verifica con crisis en H3. Las dependencias de integración no autorizan publicación sin H0.

## Cobertura de los 18 documentos fuente

| Documento | SPECs de ejecución que lo aplican |
|---|---|
| [00-executive-summary.md](../../specs/00-executive-summary.md) | SPEC012 |
| [01-product-requirements.md](../../specs/01-product-requirements.md) | SPEC004, SPEC007, SPEC012 |
| [02-personas-and-user-journeys.md](../../specs/02-personas-and-user-journeys.md) | SPEC007, SPEC010, SPEC012 |
| [03-dbt-clinical-framework.md](../../specs/03-dbt-clinical-framework.md) | SPEC004, SPEC006, SPEC007, SPEC009, SPEC012 |
| [04-functional-requirements.md](../../specs/04-functional-requirements.md) | SPEC001, SPEC002, SPEC003, SPEC004, SPEC005, SPEC006, SPEC007, SPEC008, SPEC009, SPEC010, SPEC011, SPEC012 |
| [05-ux-information-architecture.md](../../specs/05-ux-information-architecture.md) | SPEC001, SPEC007, SPEC010 |
| [06-design-system.md](../../specs/06-design-system.md) | SPEC010 |
| [07-screen-specifications.md](../../specs/07-screen-specifications.md) | SPEC001, SPEC002, SPEC003, SPEC004, SPEC005, SPEC006, SPEC007, SPEC008, SPEC009, SPEC010, SPEC011 |
| [08-technical-architecture.md](../../specs/08-technical-architecture.md) | SPEC001, SPEC002, SPEC011 |
| [09-data-model.md](../../specs/09-data-model.md) | SPEC002, SPEC003, SPEC004, SPEC005, SPEC006, SPEC008, SPEC009, SPEC011 |
| [10-api-contracts.md](../../specs/10-api-contracts.md) | SPEC001, SPEC002, SPEC003, SPEC004, SPEC005, SPEC006, SPEC007, SPEC008, SPEC009 |
| [11-security-and-privacy.md](../../specs/11-security-and-privacy.md) | SPEC002, SPEC003, SPEC005, SPEC008, SPEC011, SPEC012 |
| [12-safety-and-crisis-protocols.md](../../specs/12-safety-and-crisis-protocols.md) | SPEC006, SPEC007, SPEC008, SPEC012 |
| [13-non-functional-requirements.md](../../specs/13-non-functional-requirements.md) | SPEC001, SPEC002, SPEC007, SPEC010, SPEC011, SPEC012 |
| [14-testing-strategy.md](../../specs/14-testing-strategy.md) | SPEC001, SPEC002, SPEC003, SPEC004, SPEC005, SPEC006, SPEC007, SPEC008, SPEC009, SPEC010, SPEC011, SPEC012 |
| [15-mvp-roadmap.md](../../specs/15-mvp-roadmap.md) | SPEC012 |
| [16-backlog.md](../../specs/16-backlog.md) | SPEC001, SPEC002, SPEC003, SPEC004, SPEC005, SPEC006, SPEC007, SPEC008, SPEC009, SPEC010, SPEC011, SPEC012 |
| [17-open-questions-and-decisions.md](../../specs/17-open-questions-and-decisions.md) | SPEC008, SPEC012 |

## Autoridad y estados

- Datos/formato/límites:09; comportamiento:04; diseño:06; presupuestos:13; evidencia:14. Ante contradicción nueva registrarla en17 antes de implementar.
- ADR001 yADR002 se conservan en [specs/adr](../../specs/adr/); índice en [DECISIONS](../DECISIONS.md).
- Draft → Implementando tras prechecks de viabilidad/ADRs; Completo solo con criterios y evidencia aplicables; Archivado preserva historia.
- Las aprobaciones técnica/de alcance no sustituyen gates externos. [Viabilidad](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md) y [backlog](../BACKLOG.md) muestran el límite de autorización.
- Comandos reales en `.claude/rules/verify.md`; resultados y límites en [evidencia](../../docs/verification.md).
