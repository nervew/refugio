# SPEC008: Recursos oficiales por país y región

- **ID:** SPEC008
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001, ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H0/H3; SPEC001/002; EMERG-01 y al menos un recurso regional de urgencia confirmado antes de piloto.
- **Trazabilidad:** RF-006 / US-006.
- **Pantallas:** S09.

## 🎯 Objetivo

Mostrar recursos oficiales con cobertura, fecha y fuente verificadas, accesibles offline sin bóveda.

## 🚫 Non-goals

No usa GPS, activa candidatos no verificados, amplía cobertura por inferencia ni promete respuesta telefónica.

## 👤 User stories

Como persona usuaria quiero consultar la ayuda correspondiente a mi región para buscar atención humana. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** EmergencyResource público y región personal cifrada; selector bloqueado efímero en RAM.
- **Operaciones:** EmergencyCatalog.list(country,regionCode); enlaces tel solo por pulsación y recurso admisible.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Elegir territorio manualmente; estando bloqueado no leer preferencia privada.
2. Consultar recurso confirmado, horario/cobertura/fecha y fuente; pulsación explícita para llamar.
3. Revisar cada90d; si venció, conservar información previamente verificada con aviso; retirar recurso confirmado como retirado.

## ⚠️ Edge cases y manejo de errores

- Sin recurso aplicable: texto claro y ayuda presencial, sin generar un número.
- 123/106 pendientes: no enlaces accionables hasta comprobación oficial y segundo revisor.
- Offline puede conservar catálogo desactualizado: mostrar fecha y límites de recepción de retiradas.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001, ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [ ] Cada recurso accionable tiene fuente oficial, cobertura y fecha de verificación documentadas.
- [x] Cambiar región no expone recursos incompatibles ni revela región privada bloqueado.
- [x] Recursos verificados vencidos advierten; pending/retired no ofrecen llamada.
- [x] El piloto regional no se habilita con un catálogo sin urgencia de cobertura confirmada.
- [ ] Casos de T-006, T-018 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [04: functional-requirements](../../specs/04-functional-requirements.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [09: data-model](../../specs/09-data-model.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [12: safety-and-crisis-protocols](../../specs/12-safety-and-crisis-protocols.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)
- [17: open-questions-and-decisions](../../specs/17-open-questions-and-decisions.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
