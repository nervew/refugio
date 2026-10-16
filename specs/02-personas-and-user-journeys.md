# 02 · Personas y recorridos

Fecha: 2026-10-15. Personas hipotéticas de diseño; no representan investigación con participantes. Piloto: personas adultas, español de Colombia. No se asume diagnóstico, tratamiento vigente, conectividad constante ni dispositivo privado.

## Personas y necesidades

| Persona de diseño | Contexto | Necesidad y barrera | Respuesta del MVP |
|---|---|---|---|
| Ana, 29 | Prepara su plan en un momento tranquilo con acompañamiento profesional opcional | Distinguir condiciones previas y evento desencadenante sin escribir una historia extensa | Secciones independientes, ejemplos editables, todo opcional |
| Mateo, 36 | Angustia intensa, manos temblorosas, atención reducida | Empezar sin elegir entre muchas opciones | Una acción «Necesito apoyo ahora» desde inicio; primer paso STOP genérico |
| Luz, 54 | Usa lector de pantalla y texto ampliado; conexión intermitente | Leer y actuar sin pérdida de foco ni depender del color | Orden semántico, botones grandes, contenido instalado disponible offline |
| Sam, 23 | Comparte teléfono y teme exposición de sus registros | Consultar recursos públicos y proteger contenido personal | Sesión bloqueada por defecto; frase secreta para datos personales, avisos honestos sobre copias y navegador |

No se usará edad, intensidad ni diagnóstico para recomendar automáticamente una habilidad. El producto no detecta crisis ni predice riesgo.

## Recorridos y criterios observables

### J01 · Preparar un plan

S01 → S15 (si primera entrada) → S13 (crear frase secreta) → S02 → S03. La creación de almacenamiento personal nunca bloquea S04. El usuario puede guardar solo un contacto o una estrategia, omitir cualquier campo y volver después. Vulnerabilidades y desencadenantes tienen etiquetas y ejemplos distintos. Guardado local cifrado confirmado antes de salir; si falla, conservar el borrador solo durante sesión y mostrar «No se guardó».

Éxito: volver al plan conserva lo confirmado; ninguna sección exige completar otra; no hay porcentaje de éxito terapéutico ni rachas.

### J02 · Entrar en crisis con plan preparado

Desde S01, una activación abre S04, sin preguntas ni confirmación. Encabezado con un paso breve, «Buscar apoyo» y «Emergencias» persistentes; el primer apoyo personal elegido al preparar el plan aparece si la sesión está desbloqueada. S04 → S06 inicia pasos de una habilidad; «Cambiar habilidad» abre S05. No se programa una llamada ni se envía mensaje sin acción expresa.

Éxito: primera instrucción visible sin desplazamiento en móvil de referencia; contactos accesibles mientras se lee una habilidad; cualquier temporizador es opcional y pausable. Finalizar lleva a inicio; reflexión se ofrece como acción opcional.

### J03 · Crisis con sesión bloqueada o plan vacío

S01 → S04 muestra el recurso genérico público en una activación. «Ver mi plan» abre S13; cancelar o fallar conserva salida a S04. Se explica «Tu plan está bloqueado. Puedes seguir con estos pasos». Plan vacío: «Puedes empezar sin tener un plan». No se pide crear cuenta, frase, registro, consentimiento de investigación ni cuestionario para usar la ayuda pública.

Éxito: falla de descifrado, pérdida de frase o almacenamiento no inutiliza habilidades públicas y emergencias configuradas. No se muestran nombres ni teléfonos personales bloqueados.

### J04 · Sin conexión

Tras una primera carga completa, S01 → S04 → S06 funciona desde la caché; contactos personales requieren desbloqueo y datos disponibles localmente. Aviso no modal «Sin conexión. Puedes seguir usando lo guardado». Pulsar teléfono delega al sistema y no presupone servicio celular. Primer acceso sin haber descargado el sitio no tiene garantía offline: esto se explica en instalación, respaldo y ayuda.

Éxito: ni el aviso ni una actualización de PWA interrumpen un paso. Sin catálogo territorial verificado se muestra alternativa textual de ayuda presencial sin inventar un número.

### J05 · Pedir ayuda

S04/S06 → S07 → contacto seleccionado → botón «Llamar a [nombre]» o «Preparar mensaje». El compositor externo permite revisar destinatario y texto; no hay envío automático. Si no responde, «Otro contacto» mantiene la lista. «Emergencias» abre S09 desde cualquier pantalla de crisis. No se registra éxito de la llamada por haber abierto el marcador.

Éxito: ningún número se marca al tocar una tarjeta ni se transmite ubicación; alternativas permanecen accesibles al volver de otra app.

### J06 · Reflexionar y mantener

S01 → S10 → guardar → S11. Situación, vulnerabilidades, evento, emociones, pensamientos, impulsos, habilidades, intensidad antes/después y aprendizaje son opcionales. «No lo sé» o campo vacío son válidos; no se infiere cero. Edición y borrado se ofrecen sobre cada registro. Una habilidad puede adjuntar un resultado opcional sin duplicar automáticamente registros.

Éxito: no se calculan diagnósticos, valoraciones de riesgo ni clasificación de personas. Una reducción de intensidad no se interpreta como eficacia clínica.

### J07 · Recuperar o retirar datos

S12 → S14 exporta archivo cifrado; restaurar requiere frase del archivo, valida integridad y muestra resumen antes de sustituir datos locales. Se permite cancelar sin perder el plan actual. La impresión voluntaria del plan advierte sobre papel/PDF y permite seleccionar secciones, con contactos/notas opcionales desmarcados y sin reflexiones por defecto. La eliminación local requiere confirmar alcance y nunca afirma borrar descargas, copias externas, historial o datos retenidos por el navegador/SO. La frase perdida no se recupera mediante servidor: ayuda pública sigue disponible.

## Validación de diseño previa a lanzamiento

Pruebas de tareas con personas adultas diversas y apoyo clínico para revisar guion; no inducir crisis real. Incluir lector de pantalla, zoom, uso con una mano, sesión bloqueada, sin plan, fallo de almacenamiento y modo avión. Criterios: todos los recorridos completos sin barrera crítica, una activación para S04 desde S01, cero exposición personal con sesión bloqueada. No existen resultados de estos estudios todavía; registrar hallazgos y consentimiento fuera de la app.
