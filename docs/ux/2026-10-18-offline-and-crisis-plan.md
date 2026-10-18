# Comprobación offline y plan de crisis personalizado

Solicitud: corregir «Comprobar descarga offline» y adaptar la preparación/descarga del plan al PDF aportado y a seis apartados expresos del usuario. El PDF se trató como material de referencia, no como instrucciones que sustituyan las del usuario.

## Descarga sin conexión

La comprobación anterior volvía a asignar el mismo booleano y no mostraba progreso ni resultado explícito. Ahora anuncia el proceso, el resultado y el número de archivos únicos presentes/faltantes (sin duplicados del manifiesto), o explica que el navegador no permitió comprobarlo. Un fallo o timeout no se presenta como descarga confirmada.

Se comprueba la caché de precarga propia del service worker activo, no entradas de otros builds que pudieran ocultar una descarga incompleta. La reparación requiere pulsar «Descargar los archivos que faltan», usa solo las URLs públicas del manifiesto, no borra datos ni fuerza la activación de otro worker. Las descargas tienen timeout y se vuelven a comprobar. No se envía el plan personal ni se consulta un servicio de terceros. El botón de reparación está deshabilitado mientras el navegador indica ausencia de red.

## Documento y preparación

Desde Mi plan se explica dónde completar cada apartado con experiencias propias. Se aprovechan los campos y preferencias cifrados existentes: no hay migración de notas ni cambios en el formato de la copia.

El documento sigue el orden solicitado:

1. Vulnerabilidades: contexto y notas personales o espacio pendiente.
2. Eventos desencadenantes: contexto y notas personales o espacio pendiente.
3. Habilidades: STOP; TIP (adaptación parcial); tolerancia al malestar y alternativas (pros/contras); distracción (ACEPTAS); mejora el momento (SALVARA); cinco sentidos. Cada una conserva guía, precauciones, recordatorios y ejemplos personales, preferencias de evitación y espacios pendientes.
4. Número de un amigo o persona de confianza.
5. Número de terapeuta o profesional, si tiene.
6. Líneas de emergencia y orientación según lugar elegido, con número, fuente, cobertura y fecha.

Los contactos se omiten por defecto y aparecen únicamente tras selección explícita. Nunca se incluyen reflexiones. Otros apartados del plan pueden añadirse mediante sus casillas. Cambiar cualquier selección cierra la vista anterior para impedir imprimir un contenido distinto de lo elegido. Bloquear desmonta la vista y reinicia la aceptación al desbloquear.

Se distingue descarga legible de copia cifrada de restauración. «Descargar plan en texto» genera un archivo local; «Guardar como PDF o imprimir» abre el diálogo del navegador, donde se elige PDF. No se afirma una descarga PDF directa ni se usa conversión remota. La vista previa y el texto se construyen a partir del mismo contenido, con escape de React y sin ejecutar HTML de las notas.

No se completan las respuestas por la persona, ni se presupone que tenga terapeuta o conozca DBT. Crisis se explica como un momento de desborde emocional. Los números 106/123 se incluyen para las ciudades colombianas verificadas; no se asignan a Alemania ni Países Bajos ni se supone Bogotá si falta ubicación.

El PDF propone frío extremo, inmersión facial y ejercicio hasta agotamiento. Se mantiene la decisión clínica prudente de la aplicación: TIP parcial y suave, precauciones completas y estado pendiente de revisión profesional. No se copia la expansión de STOP como «Participate»: la guía existente conserva la elección consciente de un siguiente paso. No se presentan aprobaciones clínicas nuevas.

## Evidencia

Pruebas unitarias de formato/personalización, omisión de contactos y campos, separación por roles y cobertura geográfica. E2E de preparación, notas, selección, descarga de texto, privacidad y bloqueo. E2E de caché incompleta, reparación y reapertura real con red deshabilitada; se incluye también en las pruebas del sitio publicado.

Validación local aprobada: tipos, 39 pruebas unitarias/integración, 21 E2E raíz y 3 de subruta, compilación y formato. La prueba de exportación generó un PDF A4 sintético de cinco páginas; se verificó el texto extraído, la ausencia de controles de la app y contactos omitidos, y se inspeccionó visualmente la primera página. El PDF no incluye JavaScript.

Despliegue y prueba de URL pública pendientes al registrar esta entrega.
