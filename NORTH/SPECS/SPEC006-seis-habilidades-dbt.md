# SPEC006: Catálogo de seis habilidades DBT

- **ID:** SPEC006
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001, ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H3; SPEC001; preferencias SPEC002; CLIN-01/02 antes de distribución.
- **Trazabilidad:** RF-002 / US-002.
- **Pantallas:** S05, S06.

## 🎯 Objetivo

Representar seis guías originales versionadas y sus precauciones, con personalización opcional privada.

## 🚫 Non-goals

No activa TIP intensa, reproduce manuales protegidos, fuerza respiración ni declara aprobación profesional inexistente.

## 👤 User stories

Como persona usuaria quiero seguir una habilidad conocida y poder cambiar o detenerme sin registrar resultados. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** SkillDefinition y SkillPreference, incluida prosConsCard; IDs estables del modelo09.
- **Operaciones:** Skills.listPublic y Skills.savePreference; resultados voluntarios enlazan a SPEC009.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Listar STOP, pros/contras, TIP, ACEPTAS, cinco sentidos y SALVARA.
2. Abrir objetivo, indicación y precauciones antes de pasos; una instrucción breve cada vez.
3. Permitir cambiar, omitir o pedir apoyo en cualquier momento; personalizar solo fuera de crisis y desbloqueado.

## ⚠️ Edge cases y manejo de errores

- Ficha no revisada: fixtures internos identificados; impedir su distribución como aprobada.
- Preferencia privada bloqueada: usar texto público sin revelar personalización.
- Incomodidad o contraindicación: detener/ofrecer otra opción, sin diagnóstico ni presión para continuar.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001, ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] Cada ficha incluye objetivo, indicación, precauciones, pasos, ejemplo, personalización y registro opcional.
- [x] TIP no guía frío extremo/inmersión, ejercicio intenso ni retenciones en MVP.
- [ ] ACEPTAS/SALVARA no inventan expansiones regionales establecidas; CLIN01 verifica adaptación.
- [x] Las seis guías públicas funcionan offline/bloqueado tras precarga y pueden abandonarse.
- [ ] Casos de T-002, T-018 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [03: dbt-clinical-framework](../../specs/03-dbt-clinical-framework.md)
- [04: functional-requirements](../../specs/04-functional-requirements.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [09: data-model](../../specs/09-data-model.md)
- [12: safety-and-crisis-protocols](../../specs/12-safety-and-crisis-protocols.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
