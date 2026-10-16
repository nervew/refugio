# Viabilidad: implementación incremental de Refugio

- **Fecha:** 2026-10-15
- **Estado:** ✅ Aprobado para desarrollo incremental con datos sintéticos; lanzamiento pendiente de gates externos.

## 💡 Propuesta

Implementar la PWA Refugio a partir de los 18 SPECS y2 ADRs existentes, mediante unidades de ejecución trazables. Solicitud de implementación registrada como objetivo; esta tarea configura su memoria y planificación.

## 🤔 Motivación

La fase documental terminó; falta convertir sus contratos en comportamientos verificables. Mantener referencias canónicas evita duplicación al organizar el trabajo con NORTH.

## 🔧 Impacto técnico

- **Módulos afectados:** shell, dominio, UI, cifrado, repositorio IndexedDB, service worker, catálogo editorial y pruebas.
- **Dependencias nuevas previstas:** React/TypeScript/Vite, Dexie, Workbox; herramientas propuestas Vitest/RTL/Playwright/axe. No están instaladas ni se fijan versiones ficticias; verificar compatibilidad y lockfile en SPEC001.
- **Servicios externos:** hosting estático HTTPS; no backend de negocio ni SDK de terceros. Elegir proveedor antes de publicación. Fallos de red no impiden uso tras precarga comprobada.
- **Cambios en datos:** esquema nuevo, sin datos existentes que migrar; envelope y futuras migraciones siguen09/11. CAS evita sobrescritura; importación valida y reemplaza atómicamente.
- **Compatibilidad hacia atrás:** no existe versión implementada previa; cada release futura debe respetar formato e impedir escritura sobre esquema posterior.
- **Observabilidad:** pruebas y errores locales no sensibles; sin telemetría. No inventar métricas reales; presupuestos13 se medirán en implementación.

## ⚠️ Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación / cierre |
|---|---|---|---|
| Pérdida de almacén o frase | No medida | Alto | Recuperación y export probadas, impresión explícita, sin recuperación remota prometida. |
| XSS o filtración de sesión | No medida | Alto | CSP/origen dedicado, ausencia de terceros, pruebas de canarios; cifrado no cubre sesión comprometida. |
| Contenido clínico no apto | No evaluada profesionalmente | Crítico | Fixtures y revisión CLIN-01/02 antes de distribución. |
| Número fuera de cobertura | Sin verificación actual | Crítico | Candidatos deshabilitados; fuentes oficiales por región y EMERG-01. |
| Comportamiento móvil divergente | Sin prueba física | Alto | Matriz real iOS/Android, suspensión/llamada/eviction y pruebas offline. |

## 📊 Impacto en scope

- **Sprint actual:** crea organización de ejecución NORTH; no da por implementada ninguna feature.
- **Objetivo del proyecto:** implementar Refugio según los documentos, sin incorporar PassVault, IA ni sincronización.
- **Incrementalidad:** H1 con fixtures mientras H0 avanza; H2 plan/apoyo; H3 crisis; H4 reflexión y aceptación. No liberar piloto solo por terminar código.
- **Capacidad:** presupuesto, equipo y revisores no confirmados; viabilidad técnica propuesta, sin promesa de fechas, coste ni eficacia clínica.

## 🔀 Alternativas evaluadas

| Alternativa | Pros | Contras | Decisión |
|---|---|---|---|
| PWA local-first incremental | Sigue ADRs, recuperable por hitos, sin servidor privado | Retención y plataformas variables | Elegida para desarrollo. |
| Framework con backend/cuentas | Posible multi-dispositivo | Contradice MVP, más operación y claves remotas | Diferida, requiere nuevo ADR. |
| App nativa/híbrida | Mejor integración del dispositivo | Tiendas y mayor mantenimiento | Diferida según ADR001. |
| No hacer nada | Sin costes de implementación | No satisface objetivo vigente | No elegida. |

## ✅ Recomendación

Construir por hitos con datos sintéticos y pruebas de recuperación primero. Preservar specs/ y gates existentes; no necesita reabrir los ADRs para inicializar NORTH.

## 🎯 Decisión

- **Decisión:** aprobar organización y desarrollo incremental dentro del alcance solicitado; no aprobar piloto público ni tratamiento real.
- **Fecha:** 2026-10-15
- **Razón:** el usuario autorizó activar NORTH hasta5 y fijó la implementación de Refugio como objetivo; no se interpreta como revisión clínica/legal independiente.
- **Próximos pasos:**
  - [x] Crear SPEC001–012 como Draft y enlazar fuentes canónicas.
  - [x] Registrar prioridades en CONTEXT y bloqueos en BACKLOG.
  - [x] Clasificar este análisis en _approved con límites de aprobación explícitos.
  - [x] Implementar SPEC001 y registrar comandos/evidencia reales.
  - [ ] Resolver gates externos antes de datos reales/piloto.

## Referencias

[Roadmap](../../../specs/15-mvp-roadmap.md), [riesgos](../../../specs/17-open-questions-and-decisions.md), [ADR001](../../../specs/adr/0001-local-first-pwa.md), [ADR002](../../../specs/adr/0002-local-security.md).

## Seguimiento de ejecución

2026-10-15: el usuario autorizó continuar hasta implementar y depurar. Funcionalidad MVP implementada; verificación local en docs/verification.md. Las condiciones externas y de lanzamiento permanecen pendientes, sin modificar la decisión original.
