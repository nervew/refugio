# NORTH · Refugio

Nivel5, versión de habilidad4.0. Activación directa autorizada por el usuario; no requiere pasar por cinco rondas de confirmación.

| Nivel | Archivos | Estado documental |
|---|---|---|
| 1 · Base | [CLAUDE](../CLAUDE.md), [CONTEXT](CONTEXT.md) | Configurado; objetivo vigente y estado real. |
| 2 · Decisiones | [DECISIONS](DECISIONS.md), [archivo](DECISIONS-archive.md) | Dos ADRs existentes enlazados, sin crear decisiones duplicadas. |
| 3 · Backlog | [BACKLOG](BACKLOG.md) | Bloqueos, tareas, responsables por rol y preguntas abiertas. |
| 4 · Viabilidad | [VIABILITY](VIABILITY/README.md) | Desarrollo incremental autorizado; publicación y datos reales sujetos a gates. |
| 5 · Specs | [SPECS](SPECS/README.md) | SPEC001–012 implementados; aceptación integral abierta, cubren los18 documentos y2 ADRs canónicos. |

## Verificación de esta inicialización

Comprobación documental ejecutada: nivel/version del manifiesto, directorios, numeración secuencial, enlaces locales, secciones de contratos/aceptación, cobertura de18 documentos y RF/US001–012, marcador contra HEAD, ausencia de plantillas incompletas y límites de tamaño. Resultado: sin errores; CLAUDE y CONTEXT tienen31 líneas cada uno, por debajo de120/80. Los demás archivos NORTH quedan por debajo de400.

Durante el bootstrap no existía aplicación y no se ejecutaron pruebas de producto. La implementación posterior sí tiene comandos y pruebas reales; las aprobaciones externas, hooks y commits nuevos siguen sin realizarse. El marcador .north-last-sync identifica el commit base, no implica árbol limpio ni que los archivos nuevos estén versionados.

## Implementación y depuración

MVP implementado;30 pruebas unitarias/integración y12 E2E Chromium aprobados. [Evidencia completa](../docs/verification.md), [ejecución](../README.md), [pendientes externos](BACKLOG.md). El resumen de verificación anterior corresponde a la inicialización documental, no al estado actual del código.

## Próxima unidad de trabajo

Cerrar revisión clínica/legal/editorial y de seguridad independiente, matriz móvil real y aceptación manual. No publicar ni introducir datos reales hasta disponer de evidencia; `npm run release:check` conserva ese bloqueo.

Fuente técnica original: [resumen de SPECS](../specs/00-executive-summary.md). La configuración de NORTH está completa; aprobar lanzamiento sigue siendo un trabajo posterior, trazados con estado y evidencia independientes.
