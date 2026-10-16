# SPEC010: Sistema visual y accesibilidad transversal

- **ID:** SPEC010
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-001
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H1–H4; Comienza junto a SPEC001 y acompaña cada pantalla; no esperar a terminar funcionalidades.
- **Trazabilidad:** RF-010 / US-010.
- **Pantallas:** S01–S15.

## 🎯 Objetivo

Aplicar la identidad Refugio y accesibilidad verificable en claro, oscuro y estados de error.

## 🚫 Non-goals

No introduce fuentes externas, decoración distractora, animaciones obligatorias ni convenciones visuales sin verificar.

## 👤 User stories

Como persona usuaria quiero acceder a guías y apoyos con lector, teclado o letra ampliada. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Tokens de06, preferencias públicas acotadas de09; no datos personales en etiquetas públicas.
- **Operaciones:** Preferencias locales del tema/texto/movimiento; componentes semánticos sin acceso directo a cifrado/DB.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Usar tokens y ratios aprobados en06; fuente sistema y objetivos táctiles48px.
2. Navegar S01–S15 con foco coherente, errores vinculados y anuncios discretos.
3. Cambiar tema/zoom/movimiento; comprobar reflow y barras sin ocultar contenido.

## ⚠️ Edge cases y manejo de errores

- Texto largo/teclado/notch: el diseño crece sin truncar acciones ni bloquear orientación.
- Color sin suficiente contraste: no usarlo como texto/control salvo variante validada.
- Fallo de guardado: aviso persistente y anunciado, sin depender solo de color o toast.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-001; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [ ] Ambos temas satisfacen AA en revisión manual y cero hallazgos automáticos críticos/serios abiertos.
- [ ] Texto200%, zoom400% y320CSSpx mantienen acciones y lectura sin scroll horizontal de página.
- [ ] VoiceOver/TalkBack y teclado recorren crisis, contacto, importación y bloqueo sin trampas.
- [x] Movimiento reducido elimina transiciones opcionales; no sonidos/autoavance/gestos exclusivos.
- [ ] Casos de T-010, T-014, T-020 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [05: ux-information-architecture](../../specs/05-ux-information-architecture.md)
- [06: design-system](../../specs/06-design-system.md)
- [07: screen-specifications](../../specs/07-screen-specifications.md)
- [13: non-functional-requirements](../../specs/13-non-functional-requirements.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
