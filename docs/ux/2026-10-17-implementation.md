# Implementación de comprensión y primer uso

Fecha: 17 de octubre de 2026 (America/Bogota). Solicitud del usuario: implementar el feedback de primer uso y la auditoría de comprensión sin conocimientos de DBT. Se conserva la demo con datos ficticios y sus gates profesionales pendientes.

## Cambios

- Inicio y bienvenida explican el propósito emocional y las dos tareas: consultar una guía ahora o preparar recordatorios para después.
- Creación: «Crea tu plan personal», «No necesitas registrarte» y «Crear mi plan». La frase, su longitud, el cifrado y los dos consentimientos se conservan. La ayuda inmediata aparece antes del formulario y describe que abre una guía de la app. Restauración se identifica como recuperación de una copia; frase olvidada aparece cuando ya existe plan bloqueado.
- Estados: plan inexistente, bloqueado, abierto, cargando y almacenamiento inaccesible tienen textos distintos. Inicio y guía inmediata no confunden falta de datos en RAM con inexistencia del plan.
- Navegación: «Guías», «Mis contactos» y «Líneas y urgencias». Se distinguen la agenda privada y la atención externa, accesible sin plan. Los pasos de la app aclaran que no hay una persona respondiendo.
- Guías: títulos descriptivos, nombres técnicos secundarios y origen DBT en información opcional. Se retiran ordinales del catálogo. Se mantienen los seis IDs, pasos, precauciones, contenido en revisión y acceso directo a ayuda.
- Plan: tres grupos («Lo que me ayuda», «Lo que noto», «A quién puedo acudir»), sin numeración de cuestionario ni duplicar la entrada a contactos profesionales. Inicio opcional con un paso o contacto; se conservan los campos y roles existentes.
- Editor: «Escribir mi primera nota» / «Agregar otra nota», foco en el nuevo campo y estado vacío distinto de guardado. El guardado sigue volviendo al inicio solo tras persistencia exitosa.
- Preguntas cotidianas para señales, condiciones previas, acontecimientos, pensamientos y sensaciones. Reflexión opcional sobre un momento difícil. Las valoraciones0–10 siguen comparando antes/después de una guía u otra acción probada; no se reinterpretan los valores existentes como inicio/final de un episodio ni se calculan diagnósticos o riesgo.
- Móvil: ayuda antes del formulario, barra de tres destinos, controles de48px y nombres accesibles explícitos al ocultar las etiquetas visuales del encabezado en pantallas pequeñas.

## Conservación y límites

No hay cambios en esquemas de almacenamiento, nombres de bases, formato cifrado, frases, algoritmos, importación o compatibilidad de planes históricos. Cambian títulos y ayudas visibles. Números, fuentes y cobertura de Bogotá se conservan. No se añaden cuentas, atención humana en vivo, envío automático, diagnósticos, clasificación de gravedad ni una promesa de mejoría.

El código y pruebas incluyen copias históricas sintéticas para comprobar recuperación. Los informes de análisis anteriores se publican sin nombres o capturas personales. Los subagentes de onboarding y lenguaje colaboraron en archivos distintos; su revisión no equivale a aprobación clínica acreditada.

Estas mejoras requieren volver a probar comprensión con personas. Pasar pruebas técnicas y axe no demuestra que las personas entiendan el producto. Las definiciones y adaptaciones clínicas siguen sujetas a revisión profesional antes del piloto formal.

## Verificación

34 pruebas unitarias,17 pruebas de navegador raíz,2 pruebas de subruta, build, formato y diff aprobados. Despliegue de esta revisión en curso al redactar este registro. Se añaden recorridos de primer uso, ayuda sin registro, estados de bloqueo, foco de primera nota y320px con letra ampliada/axe. El workflow de sitio público comprobará los textos y acceso a líneas sin crear plan, además de guardar/desbloquear y recuperar el formato histórico en tres perfiles de navegador.
