# SPEC005: Contactos y solicitud explícita de apoyo

- **ID:** SPEC005
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H2; SPEC002/004; integrar acceso inmediato en SPEC007.
- **Trazabilidad:** RF-005 / US-005.
- **Pantallas:** S07, S08.

## 🎯 Objetivo

Organizar personas, profesionales y alternativas, con acciones de contacto elegidas por la persona.

## 🚫 Non-goals

No importa agenda, envía alertas automáticas, confirma entrega ni implementa mensajería propia.

## 👤 User stories

Como persona usuaria quiero encontrar un apoyo principal y otro alternativo para pedir compañía. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Contact y ContactChannel tel/sms, availabilityText y mensaje opcional; relación alternativa sin autoenlace.
- **Operaciones:** Contacts.upsert/remove, ContactActions.prepare/open; portapapeles o WebShare solo mejoras detectadas según10.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Crear alias, canal y disponibilidad opcional; redactar mensaje y ordenar contactos.
2. En crisis desbloqueada mostrar principal/alternativo y teléfono antes de una acción explícita.
3. Delegar llamada/SMS al sistema o copiar texto seleccionable; volver sin afirmar que fue atendido.

## ⚠️ Edge cases y manejo de errores

- Sin marcador o portapapeles rechazado: ofrecer número/texto seleccionable.
- Sesión vencida: ocultar contactos y mostrar alternativa pública.
- Eliminar contacto: limpiar referencias del plan y de alternativos en misma transacción.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] Datos privados no existen en UI bloqueada ni rutas del navegador.
- [x] Llamar/preparar mensaje requiere pulsación; pulsar una tarjeta no envía nada.
- [x] Desde crisis desbloqueada se encuentra apoyo principal en máximo dos acciones.
- [x] El fallback de copia no se dispara automáticamente y advierte privacidad.
- [ ] Casos de T-005, T-015 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [04: functional-requirements](../../specs/04-functional-requirements.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [09: data-model](../../specs/09-data-model.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [11: security-and-privacy](../../specs/11-security-and-privacy.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
