# Backlog

Estado actual: funcionalidad implementada y depurada localmente; aceptación pública pendiente. Evidencia en docs/verification.md. El detalle de producto permanece en [backlog canónico](../specs/16-backlog.md); este archivo prioriza ejecución y bloqueos. 🔴 bloquea piloto/datos reales, no necesariamente desarrollo con fixtures. Responsables son roles futuros, no personas ya contratadas.

## 🔴 Critical

- [2026-10-15] B-001 `CLIN-01/02: revisión acreditada de las seis fichas y TIP`. Responsable producto/clínica; H0; [marco](../specs/03-dbt-clinical-framework.md).
- [2026-10-15] B-002 `EMERG-01: verificar fuentes oficiales de 123/106 y cobertura de la región piloto`. Responsable editorial; H0; candidatos deshabilitados hasta evidencia; [fuentes](../specs/research/00-sources-and-findings.md).
- [2026-10-15] B-003 `GATE-LEGAL: definir responsable, avisos y tratamiento técnico del hosting`. Responsable privacidad/legal; H0; [seguridad](../specs/11-security-and-privacy.md).
- [2026-10-15] B-004 `GATE-SEC: revisar cifrado y demostrar restauración sin pérdida`. Responsable seguridad/QA; antes de piloto; SPEC002/003/012.
- [2026-10-15] B-005 `Aprobar matriz móvil real y accesibilidad`. Responsable QA/frontend/UX; antes de H4; SPEC010/012; sin resultados aún.

## 🟡 Debt

Sin defectos bloqueantes conocidos en el alcance local automatizado. La revisión independiente y los dispositivos reales aún pueden descubrir incidencias. Riesgos de diseño en [17](../specs/17-open-questions-and-decisions.md).

## 🟢 TODOs

- [2026-10-15] B-015 `GitHub Pages: revisar propuesta y visibilidad antes de activar`. Compatibilidad y workflow locales; publicación remota pendiente. Ver docs/github-pages.md.

- [2026-10-15] B-006 `SPEC001: shell, herramientas reales, PWA y readiness offline`. H1; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-007 `SPEC002: bóveda, sesión y persistencia atómica`. H1; depende SPEC001; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-008 `SPEC003: export/import, rotación y borrado`. H1–H2; depende SPEC002; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-009 `SPEC004/005: preparar plan y red de apoyo`. H2; depende SPEC002/003; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-010 `SPEC006/007/008: habilidades, crisis y emergencias`. H3; depende H0 para distribución y base privada; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-011 `SPEC009: reflexión voluntaria`. H4; P1; depende SPEC002; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-012 `SPEC010: accesibilidad y sistema visual en todos los flujos`. Transversal; comienza SPEC001; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-013 `SPEC011: actualización segura y migraciones`. H1/H3; depende SPEC001/002/003; implementado; verificación local aprobada, aceptación integral según gates.
- [2026-10-15] B-014 `SPEC012: pruebas, evidencia y decisión de liberación`. Transversal/H4; implementado; verificación local aprobada, aceptación integral según gates.

## 🕳️ Context pending

- [2026-10-15] Q-001 `Designar profesionales/revisores y propietario editorial`. Responsable producto; antes de H0/H4; Q01/02/03/06 de17.
- [2026-10-15] Q-002 `Determinar hardware, protocolo de usabilidad y presupuesto del piloto`. Responsable producto/QA; antes de H3/H4; Q04/05/08 de17.
- [2026-10-15] Q-003 `Revisar marca y derechos del contenido`. Responsable producto/legal; antes de publicación; Q07 de17.

## 📦 Archived

- [2026-10-15] `PassVault como objetivo de este proyecto`: descartado del alcance vigente por la instrucción posterior de usar los 18 SPECS y2 ADRs de Refugio; no se eliminó documentación previa.
