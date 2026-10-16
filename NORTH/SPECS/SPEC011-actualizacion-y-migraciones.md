# SPEC011: Actualización segura e instalación

- **ID:** SPEC011
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001, ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H1/H3; SPEC001/002/003; coordinación multipestaña y pruebas de recuperación.
- **Trazabilidad:** RF-011 / US-011.
- **Pantallas:** S12, S15.

## 🎯 Objetivo

Instalar sin obligatoriedad y actualizar sin interrumpir crisis ni destruir datos.

## 🚫 Non-goals

No fuerza skipWaiting, recarga en crisis, depende de BackgroundSync ni cambia esquema sin validación.

## 👤 User stories

Como persona usuaria quiero actualizar en un momento adecuado manteniendo mi plan guardado. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Versión de shell/contenido/esquema y envelope; schemaVersion separado de versión IndexedDB según09.
- **Operaciones:** Ciclo SW waiting y comando explícito de actualización; migraciones puras y persistencia atómica según08/09.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Ofrecer guía Safari manual y prompt Android solo cuando capacidad lo permita; seguir web sin instalar.
2. Descargar nueva versión manteniendo antigua activa; esperar a salir de crisis en todas las pestañas.
3. Guardar cambios, ofrecer copia y actualizar por acción; desbloquear/migrar con validación y commit completo.

## ⚠️ Edge cases y manejo de errores

- Pestaña suspendida con crisis activa: no forzar activación/recarga desde otra.
- Migración fallida o esquema posterior: conservar envelope anterior y rechazar escrituras incompatibles.
- Fallo de descarga/SW: conservar versión utilizable, explicar reintento fuera de crisis.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001, ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [ ] Cancelar instalación no restringe acceso web ni datos.
- [x] Actualizar en cualquier pestaña no interrumpe crisis activa ni borradores sin resolver.
- [ ] Migración interrumpida conserva bóveda recuperable, sin mezcla de generaciones.
- [x] La versión nueva no afirma soporte móvil antes de pasar matriz física.
- [ ] Casos de T-011, T-013, T-017 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [08: technical-architecture](../../specs/08-technical-architecture.md)
- [09: data-model](../../specs/09-data-model.md)
- [11: security-and-privacy](../../specs/11-security-and-privacy.md)
- [13: non-functional-requirements](../../specs/13-non-functional-requirements.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
