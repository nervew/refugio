# SPEC001: Base PWA y disponibilidad offline

- **ID:** SPEC001
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H1; Ningún SPEC previo; desarrollo con fixtures mientras H0 avanza.
- **Trazabilidad:** RF-007, RF-011 / US-007, US-011.
- **Pantallas:** S01, S04, S05, S06, S15.

## 🎯 Objetivo

Crear el shell mobile-first, navegación pública, configuración real de herramientas y precache completo verificable.

## 🚫 Non-goals

No integra datos personales, servidor de negocio, cuentas ni instalación obligatoria.

## 👤 User stories

Como persona usuaria quiero abrir guías preparadas sin red para acceder al apoyo tras descargar la app. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Contenido público SkillDefinition/EmergencyResource, manifiesto y estado de readiness; bóveda pendiente de SPEC002.
- **Operaciones:** Skills.listPublic, EmergencyCatalog.list; adaptadores de shell y caché. No endpoint remoto.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Configurar React/TypeScript/Vite, Dexie/Workbox según ADR; fijar versiones compatibles y lockfile al implementar.
2. Mostrar inicio y crisis genérica; descargar shell y paquete público completo desde origen propio.
3. Verificar recursos antes de indicar disponibilidad offline; reabrir en avión y mantener guías.

## ⚠️ Edge cases y manejo de errores

- Primera visita sin descarga o caché parcial: no prometer acceso offline, ofrecer reintentar cuando haya red.
- IndexedDB o persistencia denegada: explicar límite y conservar ayuda pública si ya está instalada.
- Expulsión de almacenamiento: readiness se vuelve a comprobar, no asumir existencia del plan.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] La aplicación tiene comandos reales de desarrollo, build, typecheck y pruebas documentados después de configurarlos.
- [x] Desde shell íntegro, reiniciar en avión abre inicio y las seis guías públicas sin depender de una API.
- [x] No aparece «Listo sin conexión» con recursos críticos incompletos; denegar persist() no impide usar la app.
- [x] No se cargan fuentes, scripts ni SDK de terceros en ejecución.
- [ ] Casos de T-007, T-011, T-013, T-017 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [08: technical-architecture](../../specs/08-technical-architecture.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [13: non-functional-requirements](../../specs/13-non-functional-requirements.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
