# 14. Estrategia de pruebas

Estado: plan de verificación previo a implementación. **No se han ejecutado pruebas de aplicación, accesibilidad, criptografía, rendimiento ni dispositivos en esta fase documental.** El análisis de especificaciones no equivale a validación clínica, legal o de producto.

## Enfoque y herramientas propuestas

Vitest para dominio, validadores y repositorios; React Testing Library para componentes mediante roles/nombres accesibles; Playwright para recorridos web y fallos de almacenamiento/red; axe-core para hallazgos automáticos; inspección manual con VoiceOver y TalkBack. Usar fixtures ficticios claramente reconocibles, nunca historias clínicas reales. Las pruebas de Web Crypto se ejecutan también en navegadores reales: un mock no demuestra compatibilidad ni cifrado correcto.

Los unitarios cubren decisiones de dominio y límites; integración cubre transacciones, cifrado y migraciones; E2E cubre experiencias completas. No se requiere un porcentaje arbitrario de cobertura: toda regla P0 y cada condición límite identificada debe tener caso y resultado revisable. Los simuladores ayudan a desarrollar; no sustituyen la matriz física de liberación.

## Trazabilidad funcional, historias y pruebas

Cada ID siguiente identifica una suite de aceptación con varios casos. Desglosar en implementación como `T-001.a`, `T-001.b`, etc., manteniendo el ID padre en el informe y en CI.

| Suite | Requisito / historia | Casos y criterio de aceptación |
|---|---|---|
| T-001 | RF-001 / US-001: plan personal | Crear/editar todos los campos del plan, distinguir vulnerabilidad previa y desencadenante, guardar, bloquear y recargar: tras desbloquear se recuperan exactamente los valores confirmados. Campos vacíos no impiden crisis. Fallar escritura no muestra «Guardado». Límites y validación coinciden con el modelo. |
| T-002 | RF-002 / US-002: habilidades | Están STOP, Pros y contras, TIP, ACEPTAS, Cálmate con los cinco sentidos y SALVARA; cada una tiene objetivo, indicación, precauciones, instrucciones, ejemplo, personalización y registro opcional. TIP muestra precauciones antes de cualquier instrucción corporal y permite alternativa sin ejercicio ni frío. Cambiar habilidad mantiene acceso a apoyo. |
| T-003 | RF-003 / US-003: crisis | Desde inicio y bloqueo, una activación abre crisis genérica. Sin plan, con plan parcial, offline y con sesión bloqueada el flujo sigue útil, sin formularios obligatorios. Datos privados requieren desbloqueo. Peligro inmediato muestra orientación y acceso a recursos verificados; contactos personales visibles solo dentro de sesión abierta. Salir/cambiar habilidad no destruye el plan. |
| T-004 | RF-004 / US-004: reflexión | Guardar y recuperar situación, vulnerabilidades, desencadenante, emociones, pensamientos, sensaciones corporales, impulsos, habilidades, intensidades y aprendizajes; omitir registro es posible. Validar intensidades y límites definidos por modelo; no inferir diagnósticos ni riesgo. Fallar guardado conserva borrador solo durante sesión y advierte pérdida al bloquear. |
| T-005 | RF-005 / US-005: red de apoyo | Crear, editar, ordenar y eliminar contactos personales/profesionales y alternativas. Confirmar nombre/número antes de delegar llamada o mensaje al sistema; cancelar no comunica nada. No hay envío automático. Dispositivo sin manejador muestra alternativa de copiar manualmente con advertencia de privacidad; tras bloqueo no quedan nombres/números en DOM ni historial de rutas. |
| T-006 | RF-006 / US-006: emergencias | Seleccionar país/región sin geolocalización obligatoria; solo un recurso previamente verificado con ficha oficial y cobertura aplicable permite acción telefónica. Tras más de 90 días se advierte revisión pendiente sin retirar acceso por antigüedad; recursos retirados y candidatos nunca permiten llamada. Una región sin recursos validados presenta orientación genérica, sin inventar número. 123 y 106 no son accionables mientras su verificación siga pendiente. Revisar error/no cobertura y confirmación del sistema. |
| T-007 | RF-007 / US-007: offline | Primera visita, caché parcial y caché íntegra tienen estados diferentes. Solo caché completa verificada permite indicar disponibilidad offline. En avión, cerrar/abrir conserva acceso a shell, seis habilidades, crisis pública y bóveda tras desbloqueo. Eliminar caché o datos revoca la indicación; denegar persistencia no bloquea uso. |
| T-008 | RF-008 / US-008: seguridad | Crear frase de ≥16 caracteres tras normalización NFC sin recortar espacios; frase incorrecta no abre datos. Recargar, cerrar, bloqueo manual, 5 min inactividad o 5 min oculto bloquean; aviso visible 30 s antes del bloqueo por inactividad. Al regresar con plazo vencido no existe frame privado antes de evaluar deadline. Volver tras suspensión con temporizadores detenidos también bloquea. |
| T-009 | RF-009 / US-009: export/import | Exportar cifrado, borrar instalación de prueba e importar con frase correcta recupera contenido. Probar frase errónea, bytes alterados/truncados, versión nueva no soportada, límite máximo/máximo+1 y esquema inválido: ningún caso modifica la bóveda previa. Importar reemplazo exige confirmación con opción de exportar previamente; cancelación es inocua. La impresión legible requiere sesión, selección explícita y advertencia; no incluye reflexiones ni se abre desde respaldo cifrado. Revisar vista previa, cancelación y PDF del sistema como capacidad opcional. |
| T-010 | RF-010 / US-010: accesibilidad | Recorrer preparación, crisis, contacto, importación y bloqueo con teclado, VoiceOver y TalkBack. Se anuncia título, error, guardado y bloqueo una sola vez; orden de lectura y foco es coherente; diálogos contienen y restituyen foco. Sin trampas de teclado, iconos sin nombre ni errores indicados solo por color. Aplicar además T-014. |
| T-011 | RF-011 / US-011: instalación/actualización | Instrucciones específicas de Safari y Chrome funcionan cuando no hay prompt automático. Lanzamiento instalado abre ruta válida; cancelar instalación permite seguir. Nueva versión avisa fuera de crisis; no fuerza activación/recarga con crisis activa en cualquier pestaña. Aceptar actualización segura mantiene bóveda; migración fallida conserva versión de datos y ofrece recuperación. |
| T-012 | RF-012 / US-012: borrado | Cancelar confirmación no cambia datos. Confirmar elimina bóveda/temporales, bloquea memoria y al recargar no recupera plan ni contactos. Se explica antes que los archivos exportados externos no se borran. Crisis genérica queda disponible si caché pública existe. |

## Suites transversales

| Suite | Cobertura | Aceptación y evidencia |
|---|---|---|
| T-013 | Plataformas; NFR-005, 015 | Matriz física inferior completa; registrar SO/navegador exactos, modelo, instalación, build y resultados. Captura/video sin información real. Todas las celdas requeridas pasan, incluyendo teclado virtual, notch/safe area, rotación, vuelta desde llamada, proceso eliminado y reinicio offline. |
| T-014 | Accesibilidad y contenido; NFR-001..003, 019 | axe sin hallazgos críticos/serios y revisión manual sin incumplimientos AA abiertos. Medir colores en claro/oscuro y estados; 48px táctiles, foco visible/no oculto, 200% texto, 320px reflow, zoom 400%, movimiento reducido y navegación completa por lector/teclado. Revisar error, vacío, carga y offline, además de estado ideal. |
| T-015 | Amenazas; NFR-008..010, 018 | Inspeccionar IndexedDB, Local/Session Storage, Cache Storage, historial, consola y red: cero texto personal en reposo/logs/rutas. Solo recursos propios estáticos en red; políticas CSP y ausencia de terceros verificadas. Payloads HTML se muestran como texto; no ejecutan scripts. IV único por escritura; alteración GCM se rechaza; clave no se exporta ni persiste. Comprobar pestañas múltiples y bloqueo coordinado. |
| T-016 | Rendimiento; NFR-013, 014 | Medir build de producción con 20 repeticiones y reportar p95 frente a presupuestos RNF. Registrar frío/caliente, caché, perfil de red y modelo físico; inspeccionar tamaños comprimidos, LCP/CLS e interacción representativa. Fallar un presupuesto requiere corregir o registrar excepción P1, nunca reducir seguridad silenciosamente. |
| T-017 | Resiliencia y datos; NFR-006, 007, 016 | Inyectar cuota agotada, modo privado/IndexedDB denegado, interrupción antes/después de commit, caché parcial, SW fallido, migración interrumpida y dos pestañas escribiendo. Cada operación es íntegra o no se aplica; cero pérdida silenciosa; conflicto explícito impide sobreescritura inadvertida. Datos futuros desconocidos no se migran destructivamente. |
| T-018 | Revisión clínica y recursos; NFR-011, 012, 020 | Revisión profesional acreditada con identidad/fecha/versión y observaciones resueltas; comprobar seis habilidades y precauciones TIP. Revisión regional cita fuente oficial y cobertura de cada recurso publicado. Ambas pendientes hoy: gate no aprobado. Ninguna revisión simulada sustituye estas firmas. |
| T-019 | Calidad de entrega; NFR-017, 020 | Typecheck, build y suites automatizadas requeridas pasan; dependencias/licencias y CSP revisadas. Revisión de límites entre capas. Publicación incluye manifiesto/SW compatibles, copia de seguridad de datos antes de migración y mecanismo de despliegue de corrección. Ningún bloqueo P0 abierto ni gate externo pendiente. |
| T-020 | Comprensión y baja carga | Antes de piloto con usuarios, evaluar prototipo con escenarios ficticios y reclutamiento voluntario fuera de crisis aguda, con protocolo revisado. Objetivo inicial ≥4/5 participantes encuentran crisis en ≤10 s sin ayuda y entienden que la app no llama por sí sola; cualquier malentendido que aumente peligro bloquea liberación hasta resolverlo. No es validación clínica ni estudio de eficacia. |

## Matriz mínima física previa a liberar

| Familia | Configuración mínima | Recorridos requeridos |
|---|---|---|
| iPhone/iPad iOS/iPadOS 17 | Safari y añadida a pantalla de inicio; probar iPhone y iPad | T-003, 007..011, 013..017 |
| iPhone/iPad versión estable actual | Safari y instalada | Mismos recorridos; VoiceOver en ambos modos |
| Android 12 | Chrome estable anterior y estable actual, navegador y PWA instalada | Mismos recorridos; TalkBack en ambos modos |
| Android versión estable actual | Chrome estable actual, navegador y PWA instalada | Mismos recorridos; TalkBack en ambos modos |
| Escritorio secundario | Últimas dos estables de Chrome, Edge, Firefox y Safari, teclado y zoom | Preparación, consulta, export/import, impresión, foco, contraste y reflow; registrar sistema operativo; no sustituye la matriz móvil |

Si ya no es posible obtener una combinación mínima, registrar la limitación y cambiar explícitamente la política de soporte antes de publicar; no darla por probada. Impresión se prueba también en iOS/Android: sin manejador o PDF disponible, explicar la limitación sin afirmar que se produjo un archivo. Instalar por sí solo no acredita offline. Validar por separado, en iOS, navegador y aplicación instalada: almacenamiento y ciclo de vida pueden diferir.

## Fixtures y escenarios de fallo

Preparar al menos: bóveda vacía; plan completo; plan parcial sin contactos; texto español con tildes/emoji/espacios; entradas al máximo de tamaño; caracteres de control rechazados conforme al modelo; contactos extranjeros; registros sin mejora emocional; exportación válida y corrupta; datos de esquema anterior/futuro. Un resultado emocional peor nunca produce reproche ni recomendación automática de aumentar técnica corporal.

La regresión de seguridad incluye fecha de reloj adelantada/atrasada, pestaña suspendida, cierre abrupto, frase olvidada, permisos denegados y sesión desbloqueada que pasa a llamada telefónica. Debe mantenerse la regla de evaluar el deadline antes de mostrar datos al volver. No se promete protección frente a manipulación del SO o dispositivo comprometido.

## Gates y registro de resultados

1. Revisión documental: trazabilidad RF → US → T completa, decisiones sin contradicciones y pendientes con responsable.
2. Implementación: pruebas unitarias/integración/E2E, accesibilidad y revisión de seguridad pasan con evidencia por build.
3. Campo técnico: matriz física y presupuestos medidos; instalar, cachear, reiniciar offline, bloquear y recuperar exportación funcionan.
4. Seguridad de contenido: revisión clínica acreditada, fuentes oficiales de números y revisión de privacidad aplicable. No aprobados en esta fase.
5. Liberación: ninguna incidencia P0; excepciones P1 justificadas y aceptadas por responsable de producto, con plazo. Ni un score Lighthouse ni tests unitarios pueden reemplazar los gates anteriores.

Formato mínimo de evidencia: `suite/caso`, RF/US/NFR cubiertos, build/hash, fecha, ejecutor, equipo/versión, precondición, pasos, esperado, observado, estado y enlace a evidencia anonimizada. Usar `no ejecutado`, `aprobado`, `fallido` o `bloqueado`; nunca convertir ausencia de fallo en aprobación. Un cambio en cifrado, SW, migración o contenido clínico obliga a repetir las suites afectadas y los recorridos de crisis.

## Trazabilidad de protocolos de seguridad

| Protocolo | Suites responsables |
|---|---|
| SAFE-01 | T-003, T-007 |
| SAFE-02 | T-008 |
| SAFE-03 | T-003, T-006 |
| SAFE-04 | T-006, T-018 |
| SAFE-05 | T-006, T-018 |
| SAFE-06 | T-004 |
| SAFE-07 | T-002 |
| SAFE-08 | T-005 |
| SAFE-09 | T-018 |

Los protocolos se definen en [12](12-safety-and-crisis-protocols.md); esta tabla asigna evidencia futura, sin declarar aprobación.

## Trazabilidad complementaria de criterios de especialidad

| Criterios | Suites y condición de salida |
|---|---|
| CLIN-01..06 | T-001/002/004/018: seis fichas, traducciones y límites revisados; sin aprobación simulada. |
| ARC-01..07 (08) | T-007/008/011/013/015/017: offline, shell, claves, actualizaciones y persistencia. |
| AC-DATA-01..05 (09) | T-001/008/009/015/017: canarios, CAS, archivos inválidos, migración y público/privado. |
| AC-API-01..04 (10) | T-005/006/008/009/015/017: sin red de dominio, sesión, errores y acciones explícitas. |
| AC-SEC-01..05 y AC-PRIV-01 (11) | T-008/009/013/015/017/019: amenazas, recursos, cabeceras y límites de cifrado. |
| GATE-SEC / GATE-LEGAL (11) | H0/H4: revisión competente y jurídica documentadas; pendiente en esta fase. |

Esta tabla completa la relación RF↔US↔T, no sustituye el desglose de casos al implementar. Los criterios ARC se identifican con la grafía usada en08.
