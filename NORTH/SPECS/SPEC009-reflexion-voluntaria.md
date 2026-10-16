# SPEC009: Registro y reflexión posterior

- **ID:** SPEC009
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H4; SPEC002/003; P1, después de crisis P0.
- **Trazabilidad:** RF-004 / US-004.
- **Pantallas:** S10, S11.

## 🎯 Objetivo

Permitir aprender de experiencias mediante un registro privado, voluntario y editable.

## 🚫 Non-goals

No hace scoring de riesgo, diagnósticos, interpretación clínica, rachas ni analítica de eficacia.

## 👤 User stories

Como persona usuaria quiero escribir lo que aprendí cuando yo decida, sin que la app me diagnostique. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Reflection, campos opcionales, bodySensations e intensidades enteras0–10 o ausentes; límites09.
- **Operaciones:** Reflections.list/get/save/remove; escrituras con revisión y sesión; paginación local del contrato10.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Abrir registro por iniciativa propia o desde acción opcional tras habilidad.
2. Completar los campos deseados y guardar explícitamente; intensidad omitida permanece ausente.
3. Reabrir, editar o eliminar con confirmación; ningún registro automático por abrir crisis/guía.

## ⚠️ Edge cases y manejo de errores

- Cuota o conflicto: conservar último commit y ofrecer recuperación del borrador mientras sesión viva.
- Intensidad inválida: mensaje accesible, sin convertir ausente en cero.
- Límite200 registros: no borrar por antigüedad automáticamente; ofrecer exportar/borrar.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] Se puede guardar únicamente aprendizaje y habilidad, sin completar cuestionario.
- [x] Se distinguen vulnerabilidades y desencadenante, sensaciones, pensamientos e impulsos.
- [x] Intensidad no disminuida y «no me ayudó» se aceptan sin juicio.
- [x] No se crean diagnósticos, tendencias interpretadas ni registros automáticos.
- [ ] Casos de T-004, T-017, T-018 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [03: dbt-clinical-framework](../../specs/03-dbt-clinical-framework.md)
- [04: functional-requirements](../../specs/04-functional-requirements.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [09: data-model](../../specs/09-data-model.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
