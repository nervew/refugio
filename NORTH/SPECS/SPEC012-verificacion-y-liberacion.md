# SPEC012: Evidencia de verificación y liberación

- **ID:** SPEC012
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001, ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H0–H4; Diseñar pruebas desde SPEC001; cierre requiere SPEC001–011 y gates externos resueltos.
- **Trazabilidad:** RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RF-008, RF-009, RF-010, RF-011, RF-012 / US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012.
- **Pantallas:** S01–S15.

## 🎯 Objetivo

Convertir criterios P0/P1 en evidencia reproducible y una decisión explícita sobre el piloto.

## 🚫 Non-goals

No trata checks documentales, mocks o emulación como aprobación clínica, cifrado auditado o soporte físico.

## 👤 User stories

Como responsable de producto quiero verificar comportamiento, privacidad y límites antes de permitir datos reales. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Fixtures sintéticos de entidades09, informes por build/dispositivo/caso y registro de bloqueantes; sin telemetría.
- **Operaciones:** Suites T001–020 y contratos locales; comandos reales se registran tras configuración, no se inventan aquí.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Asignar casos de RF/US/NFR/SAFE/CLIN/ARC/AC a suites14 y preparar datos ficticios.
2. Ejecutar automatización y revisión manual; registrar resultado, build, plataforma, evidencia y defectos.
3. Completar matriz física, revisión profesional y gates; corregir bloqueantes y registrar go/no-go explícito.

## ⚠️ Edge cases y manejo de errores

- Gate externo pendiente o falloP0: no liberar ni marcar MVP completado.
- Resultado de mock/emulador: registrar alcance y pendiente físico, sin extrapolar.
- PresupuestoP1 fallido: corregir o registrar excepción aceptada con dueño/fecha, sin debilitar cifrado.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001, ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] RF001–012 se trazan a US001–012 y T001–012, con T013–020 transversales.
- [ ] Roundtrip, manipulación, cuota, CAS, suspensión, retorno de llamada y actualización se prueban.
- [ ] Matriz física iOS/iPadOS17+ Safari/instalado y Android12+ Chrome últimas2 se documenta con versiones reales.
- [ ] CLIN01/02, EMERG01, GATELEGAL/GATESEC y accesibilidad tienen evidencia real antes del piloto.
- [x] Un SPEC pasa a Completo solo con sus criterios y suites satisfechos; inicializar NORTH no cumple estas pruebas.
- [ ] Casos de T-001, T-002, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010, T-011, T-012, T-013, T-014, T-015, T-016, T-017, T-018, T-019, T-020 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [00: executive-summary](../../specs/00-executive-summary.md)
- [01: product-requirements](../../specs/01-product-requirements.md)
- [02: personas-and-user-journeys](../../specs/02-personas-and-user-journeys.md)
- [03: dbt-clinical-framework](../../specs/03-dbt-clinical-framework.md)
- [04: functional-requirements](../../specs/04-functional-requirements.md)
- [05: ux-information-architecture](../../specs/05-ux-information-architecture.md)
- [06: design-system](../../specs/06-design-system.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [08: technical-architecture](../../specs/08-technical-architecture.md)
- [09: data-model](../../specs/09-data-model.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [11: security-and-privacy](../../specs/11-security-and-privacy.md)
- [12: safety-and-crisis-protocols](../../specs/12-safety-and-crisis-protocols.md)
- [13: non-functional-requirements](../../specs/13-non-functional-requirements.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)
- [15: mvp-roadmap](../../specs/15-mvp-roadmap.md)
- [16: backlog](../../specs/16-backlog.md)
- [17: open-questions-and-decisions](../../specs/17-open-questions-and-decisions.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
