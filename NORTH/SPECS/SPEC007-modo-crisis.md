# SPEC007: Modo crisis de acceso inmediato

- **ID:** SPEC007
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001, ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H3; SPEC001/002/004/005/006/008; fixtures antes de resolver H0.
- **Trazabilidad:** RF-003 / US-003.
- **Pantallas:** S01, S04, S06, S07, S09.

## 🎯 Objetivo

Dar acceso en una acción a una secuencia corta, ayuda humana y cambios de habilidad.

## 🚫 Non-goals

No hace triage automático, monitorea, registra sesiones de crisis ni obliga a completar un plan.

## 👤 User stories

Como persona usuaria quiero un siguiente paso sencillo sin responder cuestionarios durante una crisis. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Plan y contactos leídos solo con sesión; estado de navegación genérica efímero, sin historial clínico automático.
- **Operaciones:** Lecturas de Plan/Skills/ContactActions/EmergencyCatalog del contrato10; sin endpoints nuevos.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Inicio o bloqueo → Necesito apoyo ahora → primer paso útil sin esperar datos privados.
2. Si sesión abierta, usar secuencia preparada; si falta plan o está bloqueado, guía genérica con opción de desbloqueo.
3. Mantener cambiar habilidad, apoyo y emergencias; salir o continuar sin obligar a finalizar ni registrar.

## ⚠️ Edge cases y manejo de errores

- Descifrado fallido, plan parcial o red ausente: conservar guía y salida a apoyo público.
- Vencimiento de sesión: limpiar privados, volver a contenido genérico sin pantalla vacía.
- Peligro inmediato: orientación humana y emergencia verificada, sin formularios ni número inventado.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001, ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] Una activación desde inicio/bloqueo abre apoyo genérico; no onboarding obligatorio.
- [x] Se muestran como máximo tres pasos preparados de uno en uno.
- [x] Cambiar habilidad requiere máximo dos acciones y las salidas humanas permanecen visibles/accesibles.
- [x] No hay diagnóstico, evaluación automática de peligro ni registro forzado al cerrar.
- [ ] Casos de T-003, T-007, T-008, T-020 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [02: personas-and-user-journeys](../../specs/02-personas-and-user-journeys.md)
- [03: dbt-clinical-framework](../../specs/03-dbt-clinical-framework.md)
- [04: functional-requirements](../../specs/04-functional-requirements.md)
- [05: ux-information-architecture](../../specs/05-ux-information-architecture.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [12: safety-and-crisis-protocols](../../specs/12-safety-and-crisis-protocols.md)
- [13: non-functional-requirements](../../specs/13-non-functional-requirements.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
