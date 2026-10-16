# SPEC004: Preparar y editar el plan personal

- **ID:** SPEC004
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001, ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H2; SPEC002/003; componentes accesibles SPEC010 desde el inicio.
- **Trazabilidad:** RF-001 / US-001.
- **Pantallas:** S02, S03.

## 🎯 Objetivo

Editar las trece categorías del plan y ordenar hasta tres pasos iniciales sin exigir completitud.

## 🚫 Non-goals

No diagnostica, puntúa el plan, interpreta texto ni obliga a rellenar todas las secciones.

## 👤 User stories

Como persona usuaria quiero preparar mi plan en calma para recordar lo que me ayuda durante una crisis. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** CrisisPlan, PlanItem, referencias de Contact/SkillDefinition/EmergencyResource; recursos personales diferenciados.
- **Operaciones:** Plan.read/save(session,draft,expectedRevision); validación y errores del modelo09/contrato10.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Desbloquear y elegir sección; distinguir vulnerabilidad previa de acontecimiento desencadenante.
2. Editar listas y reordenar con botones; elegir pasos, habilidades y apoyos prioritarios.
3. Guardar sección explícitamente; anunciar solo tras commit; reapertura offline recupera versión confirmada.

## ⚠️ Edge cases y manejo de errores

- Plan vacío/parcial: crisis ofrece genéricas, no desvía a formulario obligatorio.
- Cuota/conflicto: no descartar último guardado ni afirmar éxito; ofrecer reintento y copia.
- Referencias eliminadas: limpiar de forma transaccional, sin números sustituidos silenciosamente.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001, ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] Las trece categorías del RF001 son editables, separadas y guardables parcialmente.
- [x] Hasta tres pasos iniciales conservan orden y pueden editarse sin arrastrar.
- [x] Cerrar/reabrir offline y desbloquear conserva texto y orden confirmados.
- [x] El fallo de guardado conserva borrador mientras la sesión sea válida y explica pérdida al bloquear.
- [ ] Casos de T-001, T-017 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [01: product-requirements](../../specs/01-product-requirements.md)
- [03: dbt-clinical-framework](../../specs/03-dbt-clinical-framework.md)
- [04: functional-requirements](../../specs/04-functional-requirements.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [09: data-model](../../specs/09-data-model.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
