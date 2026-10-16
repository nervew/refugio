# Backlog priorizado y trazabilidad

Cada US corresponde a RF del mismo sufijo, con aceptación detallada en04 y prueba T del mismo sufijo en14. P0 bloquea piloto; P1 completa el MVP. «Listo» significa implementado en fase posterior y evidencia aprobada, no redacción de esta historia. Estado actual de todas: especificada, sin implementar.

| Historia | Prioridad | Como persona usuaria quiero… para… | Aceptación verificable resumida | Dependencia / hito | Pruebas |
|---|---|---|---|---|---|
| US-001 / RF-001 | P0 | Preparar y corregir mi plan para recordar lo que me ayuda | Trece categorías, guardado parcial y orden; reabrir offline conserva texto; fallo no afirma guardado | US008, US007 / H2 | T-001 |
| US-002 / RF-002 | P0 | Consultar seis habilidades para elegir una conocida | Cada ficha con precauciones y pasos, cambiar/omitir; TIP conservadora | H0, US007 / H3 | T-002, T-018 |
| US-003 / RF-003 | P0 | Entrar en crisis directamente para dar el siguiente paso | Un toque, cero cuestionarios; fallback vacío/bloqueado, ayuda permanente | US001/002/005/006 / H3 | T-003, T-015 |
| US-004 / RF-004 | P1 | Reflexionar cuando decida para aprender sin juzgarme | Escala opcional, sin mejora exigida, editar/borrar sin diagnóstico | US008 / H4 | T-004 |
| US-005 / RF-005 | P0 | Encontrar apoyo y alternativas para pedir compañía | Principal y alternativo, mensaje previo editable, llamada/portapapeles manuales, sin envío automático | US008 / H2 | T-005 |
| US-006 / RF-006 | P0 | Ver ayuda de mi región para buscar atención adecuada | Solo verificados, región manual, fecha/cobertura, no candidatos, stale advierte, retirada deshabilita | H0, US007 / H3 | T-006, T-018 |
| US-007 / RF-007 | P0 | Abrir mi plan sin red para no depender de conectividad | Tras readiness reiniciar avión y leer/guardar; primer uso sin precarga no promete offline | ADR001 / H1 | T-007, T-013 |
| US-008 / RF-008 | P0 | Mantener privados mis datos para usar un dispositivo con confianza informada | Bóveda cifrada, clave RAM, sesión según04; genéricas siempre accesibles; sin cuenta ni telemetría | ADR002 / H1 | T-008, T-016 |
| US-009 / RF-009 | P0 | Llevar una copia para restaurar tras perder almacenamiento | Roundtrip cifrado, rechazo manipulación atómico, plan imprimible con aviso independiente | US008 / H1–H2 | T-009, T-019 |
| US-010 / RF-010 | P0 | Usar letra grande o lector para acceder al apoyo | Ambos temas AA, foco no oculto, tacto48px, movimiento reducido | Diseño06 / todos | T-010, T-014 |
| US-011 / RF-011 | P0 | Instalar y actualizar cuando convenga para acceder rápido | Safari manual, Android condicional; nueva versión no interrumpe crisis, datos intactos | US007, US009 / H3 | T-011, T-020 |
| US-012 / RF-012 | P0 | Borrar lo guardado aquí para controlar mis datos | Confirmación explícita, borrar bóveda/preferencias, sin falsa promesa de borrar impresiones | US008 / H1 | T-012 |

## Tareas de habilitación

| ID | Prioridad | Trabajo / dueño | Finalización |
|---|---|---|---|
| EN-01 | P0 | Producto contrata revisión clínica | Credencial y revisión registrada de seis fichas y protocolos; observaciones resueltas. |
| EN-02 | P0 | Editorial verifica 123/106 y región | Evidencia oficial exacta, dos revisores, cobertura y fecha, al menos urgencia regional válida; no llamadas de prueba. |
| EN-03 | P0 | Privacidad revisa marco colombiano y hosting | Responsable, bases/avisos, límites de datos locales y logs definidos, sin reclamos de certificación. |
| EN-04 | P0 | QA prepara dispositivos y fixtures | Versiones reales, perfiles instalados/navegador, sin datos reales, matriz14 ejecutable. |
| EN-05 | P0 | Seguridad revisa bóveda, dependencias y recuperación | Threat model11 y archivos manipulados/large/import/cross-tab resueltos. |
| EN-06 | P0 | UX prueba prototipo con adultos en calma | >=4/5 localizan crisis y contacto según01; incidencias críticas corregidas. |
| EN-07 | P0 | Editorial establece revisión de recursos | Dueño, cadencia90d, actualización/retiro y limitaciones offline documentadas. |

No se incluyen estimaciones ficticias de velocidad. En planificación se divide cada historia en tareas verificables sin cambiar RF. Bug de exposición, pérdida de datos, imposibilidad de crisis offline tras preparación o contenido corporal inseguro tiene prioridad sobre cualquier P1. No abrir trabajo de sincronización antes de cerrar H4 y nuevo alcance aprobado.
