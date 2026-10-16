# Roadmap de implementación

No se implementa código en esta entrega. Orden de dependencia: H0 → H1 → H2 → H3 → H4. Estimaciones de esfuerzo no equivalen a compromisos de calendario; equipo y presupuesto se fijan al iniciar. Producto acepta cada hito y conserva evidencias de14.

| Hito | Resultado concreto | Dependencias | Criterio de salida | Responsable futuro |
|---|---|---|---|---|
| H0 · contenido y riesgos | Catálogo regional verificado, seis fichas revisadas, dictamen privacidad, acuerdo de arquitectura y diseño | Profesional clínico acreditado, revisión legal, fuentes oficiales y propietario editorial | CLIN-01/02, EMERG-01 resueltos; fuentes exactas, región piloto y políticas aprobadas. Ningún candidato oficial activo sin evidencia. | Producto + clínica + privacidad |
| H1 · base privada y offline | Shell público, genéricas, bóveda, bloqueo, import/export y migración | ADRs y modelo09; se puede trabajar con fixtures sintéticos mientras H0 avanza, sin piloto | T-007/008/009/012, actualizaciones y error de cuota; recuperación probada antes de datos reales | Arquitectura + frontend + seguridad |
| H2 · preparar el plan | Editor de secciones, red de apoyo, selección de pasos y respaldo imprimible | H1, diseño accesible | RF-001/005, teclado/lector, borrado y roundtrip; indicadores solo tras commit | Frontend + UX |
| H3 · crisis accesible | Entrada en una acción, seis guías, contactos, emergencias, estados parciales/bloqueados | H0–H2 | RF-002/003/006/010/011; pruebas físicas offline, retorno de llamada y bloqueo, evaluación de usabilidad | Frontend + clínica + UX |
| H4 · MVP piloto | Reflexión opcional, documentación de soporte, proceso editorial y plan de incidencias | H3, P1 reflexión y cero bloqueantes | Matriz completa14, evidencia de pruebas firmada, pendientes asignados y decisión explícita go/no-go | Producto + QA |

La revisión clínica puede iterar durante diseño; nunca se usa la simulación de rol como aprobación de H0. La revisión legal debe definir responsable del tratamiento, región admitida, logs de hosting y textos públicos antes de datos reales. No recopilar datos personales para desarrollo o QA; fixtures sintéticos.

## Secuencia interna de cada hito

Especificación acordada → prototipo/implementación futura → prueba de fallos → revisión de seguridad/accesibilidad → evidencia y aceptación. Resolver primero pérdida de datos y exposición; después pulir apariencia. No postergar accesibilidad de flujos críticos a una fase final.

## Salida del piloto y mantenimiento

Piloto pequeño con adultos y consentimiento para investigación fuera de la app, sin exponer crisis reales a experimentos. Producto define protocolo de incidencias, responsable de contenido y ciclo de revisión de recursos <=90d. Cada release ejecuta regresión T-003/006/007/008/009/011 y suites afectadas. Publicar actualización crítica exige valorar usuarios offline: no se puede retirar remotamente una copia desconectada. Suspender nuevos despliegues y avisar en próxima visita si existe riesgo clínico confirmado, sin borrar planes.

## Fases posteriores no comprometidas

Sincronización cifrada, multidioma, otros países y eventual integración profesional requieren nuevos ADRs, revisión de consentimiento, modelo de amenazas y contratos. No se crean endpoints ni infraestructura preventiva. El MVP local sigue siendo utilizable sin esas fases.
