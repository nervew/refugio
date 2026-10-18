# Feedback de primer uso: registro, ayuda y primera nota

Fecha del feedback: 17 de octubre de 2026. Estado: análisis y propuesta; sin cambios de aplicación ni despliegue. Revisión conjunta de tres subagentes: UX principal, diseño móvil y semántica/viabilidad del onboarding. No representa revisión clínica acreditada.

## Material y alcance

Una conversación de prueba informal y dos capturas móviles aportadas por el usuario. Se omiten nombres, conversación ajena al producto y datos personales. No hubo entrevista adicional ni observación directa de la sesión. No se infieren edad, diagnóstico, experiencia digital ni resultados generales a partir de una participante.

La participante dice que busca cómo registrarse, valora la frase secreta, comprende «Crear mi plan» y pregunta qué significa «Seguir con apoyo público». La captura del editor muestra una sesión abierta y una sección sin notas; no demuestra que se completara todo el recorrido sin ayuda ni que hubiera una dificultad concreta en esa sección.

## Diagnóstico consensuado

El recorrido espera que la persona comprenda un plan cifrado local, mientras ella busca el paso familiar de registrarse. La explicación «No necesitas crear una cuenta» existe, pero queda distante del conjunto de decisiones inferior en móvil. El vocabulario cambia entre preparar, crear, espacio personal y refugio. «Apoyo público» nombra una categoría interna sin describir qué se abre o qué puede hacerse allí.

| Evidencia | Qué permite concluir | Prioridad |
| --- | --- | --- |
| Pregunta dónde registrarse | El comienzo no responde suficientemente a su expectativa de entrada | Alta |
| Entiende «Crear mi plan» y valora la frase | Conviene conservar esos conceptos y explicar su relación | Alta |
| Pregunta qué es «apoyo público» | La etiqueta no comunica el destino para esta participante | Alta |
| Captura de creación con varias salidas y texto extenso | Existe carga de lectura y varias alternativas; su efecto sobre el uso es una hipótesis | Media |
| Captura de editor sin campo visible antes de pulsar Agregar nota | Hay una acción previa para empezar a escribir; no hay evidencia verbal de que haya fallado | Por validar |

No sabemos si interpretó «público» como atención estatal, ayuda de otra persona o contenido compartido. Son posibles interpretaciones para preguntar, no hallazgos del test.

## Propuesta de entrada y copy

Título: **Crea tu plan personal**.

Explicación: **No necesitas registrarte. Tu plan se guarda en este navegador y se abre con tu frase secreta.**

Acción principal del formulario: **Crear mi plan**.

Conservar «Frase secreta», mínimo de seguridad, confirmación de frase y explicación del cifrado. Dejar «cifrado» en una explicación de privacidad cercana. El comentario favorable no demuestra que cualquier frase sea segura ni justifica reducir los requisitos actuales.

Acceso visible antes del formulario: **Necesito apoyo ahora**.

Explicación de esa acción: **Abre una guía paso a paso. Puedes usarla sin crear un plan ni escribir tu frase.**

Destino: `/crisis`, coherente con el actual enlace «Seguir con apoyo público». No requiere completar el formulario ni consentimientos. «Ver guías de apoyo» sería una alternativa válida para explorar `/skills`, pero no debe emplearse como etiqueta del mismo destino sin decidir cuál es la intención. Para esta revisión se propone mantener el destino actual y usar «Necesito apoyo ahora».

Recuperación secundaria: **¿Tienes una copia de Refugio? Restaurarla**. La opción de frase olvidada corresponde principalmente al estado de plan existente bloqueado. Mantener la restauración disponible: un navegador sin plan puede necesitar importar una copia.

«Registrarse», «Iniciar sesión» o «Entrar como invitado» pueden crear expectativas de cuenta, recuperación remota o acceso desde otros dispositivos que esta aplicación no ofrece. La necesidad observada es reconocer cómo empezar; no hay evidencia de que solicite cuentas nuevas. Explicar explícitamente el equivalente local conserva la arquitectura y las expectativas correctas.

## Estados que deben corregirse conjuntamente

Revisión de `src/features/Home.tsx`, `Unlock.tsx` y `Crisis.tsx`:

| Estado real | Acción personal coherente | Mensaje en apoyo inmediato |
| --- | --- | --- |
| Sin plan (`absent`) | Crear mi plan | Puedes seguir estos pasos sin crear un plan |
| Plan existente bloqueado (`locked`) | Desbloquear mi plan | Tu plan está cerrado; puedes abrirlo o seguir con estos pasos |
| Plan abierto (`unlocked`) | Ver mi plan | Mostrar contenido preparado si existe |
| Almacenamiento no disponible (`unavailable`) | Explicar y ofrecer reintento | Mantener guías accesibles; no afirmar que el plan existe o fue borrado |

Inicio usa actualmente `session.data` para elegir Abrir/Preparar: un plan bloqueado no tiene datos en memoria y recibe «Preparar mi plan». Crisis usa `!data` para afirmar que el plan está cerrado: también lo hace cuando no existe. Son inconsistencias confirmadas en código, no conductas observadas en esta participante. Los mensajes de contactos deben respetar igualmente esa distinción.

## Móvil y editor: propuestas para validar

- Conservar letra legible, ampliación, foco y objetivos táctiles; no reducir letra para hacer caber el formulario.
- Ordenar información esencial en fragmentos breves. Conservar advertencias de pérdida de frase, almacenamiento y evaluación con datos ficticios, edad y consentimiento. Cualquier simplificación legal debe mantener su contenido material y revisión correspondiente.
- Empezar por copy y jerarquía antes de introducir un asistente de varios pasos, que agregaría navegación.
- En el editor vacío, probar **Escribir mi primera nota** y después **Agregar otra nota**. Acercar la acción a la pregunta y dar foco al campo al abrirlo.
- Probar si se entiende «Señales tempranas» y la pregunta actual. Los ejemplos, si hicieran falta, deben ser opcionales y revisados para no inducir respuestas.
- Distinguir «Aún no has añadido notas» de «Cambios guardados». La captura no muestra Guardar; eso no prueba que la participante no lo encontrara.

## Orden recomendado

1. Aclarar primer uso, sustituir apoyo público por una acción concreta y corregir estados inexistente/bloqueado en todo el recorrido.
2. Reordenar recuperación y hacer accesible ayuda inmediata antes del formulario.
3. Probar la primera nota y el vocabulario del editor antes de rediseñarlo.

## Validación pequeña y sin guiar

Volver con la misma participante y sumar dos o tres personas nuevas. Tareas con datos ficticios:

1. «Es tu primera visita y quieres preparar algo para recordar cuando tengas un momento difícil. Muéstrame cómo empezarías».
2. «Ahora quieres consultar una herramienta sin preparar un plan».
3. «Escribe una nota y guárdala; después vuelve a abrir tu plan».

No indicar qué botón pulsar ni explicar términos antes de la elección. Registrar primera acción, dudas, retrocesos, ayudas del moderador y qué esperaba que ocurriera. Pedir después que explique dónde cree que queda guardado el plan y para qué sirve su frase. Incluir móvil, letra ampliada y teclado abierto.

Criterios propuestos: distinguir crear plan y recibir apoyo sin ayuda; no esperar una cuenta o recuperación remota; comenzar a escribir y reconocer el guardado. Un resultado con tres o cuatro personas orienta la siguiente iteración, no acredita usabilidad general ni valida clínicamente el producto.

Implementación posterior autorizada por el usuario: [registro](2026-10-17-implementation.md). Las observaciones e hipótesis de esta auditoría se conservan como antecedente; las pruebas técnicas no sustituyen la validación con personas.
