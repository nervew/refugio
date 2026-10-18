# Comprensión de Refugio sin conocimientos previos

Fecha del análisis: 17 de octubre de 2026. Estado: auditoría de contenido y recorridos, propuesta sin implementar. Complementa [feedback de primer uso](2026-10-17-feedback-onboarding.md).

Revisión conjunta de dos subagentes de UX: lenguaje/primer uso y tareas/expectativas, más síntesis del agente principal. Material: feedback aportado, capturas y código actual. No hubo nuevas sesiones con participantes. La existencia de textos y destinos se confirmó en código; sus efectos en usuarios nuevos son hipótesis. No es una revisión clínica acreditada.

## Problema de fondo

Para empezar, la persona necesita reconocer para qué sirve la app, qué puede hacer ahora y qué ocurrirá al elegir una opción. El propósito emocional queda implícito y varios nombres presuponen vocabulario terapéutico. Esto puede afectar tanto a quien nunca oyó hablar de DBT como a quien conoce el término pero no sus herramientas.

La sigla DBT no aparece en el texto actual de la interfaz revisada. Sí aparecen STOP, TIP, ACEPTAS y SALVARA, junto a categorías como vulnerabilidades y desencadenantes. Añadir una definición obligatoria de DBT no resolvería por sí solo esas decisiones.

«Crisis» puede referirse a problemas económicos, familiares, laborales o de otros ámbitos. Un problema económico también puede provocar malestar emocional. El texto debe explicar qué tipo de apoyo ofrece Refugio sin excluir motivos de malestar ni prometer resolver el problema externo.

## Propuesta de explicación inicial

> Refugio reúne guías y recordatorios para momentos en que las emociones se sienten muy intensas o te cuesta decidir qué hacer. Puedes consultar una guía ahora o preparar tu plan para después.

Propuesta de contenido para validar con UX y revisión profesional; no constituye una definición diagnóstica ni una promesa de mejoría.

No exigir que la persona decida si «está en crisis», conozca DBT, tenga un diagnóstico o haya recibido terapia para acceder a las guías. Conservar las condiciones vigentes de la demo y la información sobre sus límites.

## Hallazgos priorizados

| Prioridad | Evidencia confirmada | Riesgo de comprensión a validar | Propuesta |
| --- | --- | --- | --- |
| Alta | Inicio habla de «herramientas», «plan» y «personas» sin describir el ámbito emocional (`Home.tsx:28`) | Esperar ayuda económica, asesoría general o atención humana | Explicar el propósito en una frase visible junto a la acción principal |
| Alta | «Consultar en modo crisis» y «Salir del modo crisis» no explican crisis (`Plan.tsx:33`, `Crisis.tsx:28`) | Pensar en otra clase de crisis o creer que solo sirve en situaciones extremas | «Ver mis pasos para un momento difícil» y «Volver al inicio»; dejar explicación contextual de crisis emocional si se conserva el término |
| Alta | «Pedir apoyo» con icono telefónico y «Encontrar compañía» llevan a contactos privados (`components.tsx:33`, `Home.tsx:83`, `Support.tsx:12`) | Esperar hablar con alguien y encontrarse con creación/desbloqueo | «Mis contactos» para agenda personal; acceso independiente «Ver líneas de atención», disponible sin plan |
| Alta | Guía inicial «Probar STOP» y catálogo con STOP, TIP, ACEPTAS, SALVARA (`Crisis.tsx:60`, `content/skills.ts`) | Tener que conocer nombres antes de elegir; interpretar ACEPTAS como mandato o SALVARA como promesa | Priorizar títulos que describen acciones. Mantener nombres técnicos en un segundo nivel y revisar equivalencias profesionalmente |
| Media | Navegación «Habilidades», tarjeta «Mis herramientas» y catálogo «Un recurso» (`App.tsx:88`, `Home.tsx:70`, `Skills.tsx:18`) | Pensar que son secciones distintas o capacidades que ya debería tener | Usar «Guías» en navegación y «Guías paso a paso» como título; comprobar longitud en móvil |
| Media | Seis tarjetas equivalentes y numeradas; el cuándo/ejemplo está en el detalle (`Skills.tsx:20`, `:76`, `:159`) | No saber elegir o pensar que hay que completar una secuencia | «Puedes probar una sola guía y cambiar cuando quieras». Hacer visible una indicación breve de uso; mantener el inicio directo existente sin crear triage automático |
| Alta | Plan con13 tarjetas numeradas01–13 y sin comienzo mínimo señalado (`Plan.tsx:36–75`) | Interpretarlo como cuestionario obligatorio, sin entender para qué prepara las notas | Explicar el plan y agrupar por «Lo que noto», «Lo que me ayuda», «Personas a quienes puedo acudir». Ofrecer un primer paso pequeño y opcional |
| Media | «Vulnerabilidades», «Desencadenantes», «Pensamientos asociados» (`domain/model.ts:16–20`) | Interpretar vulnerabilidad como defecto o no distinguir las categorías | Probar preguntas cotidianas: «Cómo estaba antes», «Qué pasó justo antes», «Qué pasa por mi mente». Mantener distinciones y ejemplos bajo revisión de contenido |
| Media | Reflexión pide «Intensidad antes/después» sin objeto ni momentos explícitos (`Reflections.tsx:248`) | No saber qué medir o interpretar un puntaje como valoración de riesgo | Definir qué sensación y qué momentos se comparan. Mantener omisión y aclaración de que no es diagnóstico. Resolver primero el caso de reflexiones que no parten de una guía |
| Media | «No necesitas registrar cada crisis» (`Reflections.tsx:63`) | Excluir un día difícil que la persona no llama crisis | «Puedes escribir sobre un momento difícil» o «No necesitas registrar todo lo que te pasa» |
| Media | «Cálmate con los cinco sentidos» (`content/skills.ts:103`) | Sentir que se ordena un resultado o que se falla si no llega calma | Probar «Explorar una sensación que te resulte cómoda», conservando libertad de parar/cambiar y revisión profesional |
| Media | «Tu profesional tratante» y «Disponibilidad acordada» (`Plan.tsx:67`, `Support.tsx`) | Suponer que se necesita terapeuta o una red ya preparada para usar la app | Explicar que añadir personas/profesionales es opcional; «¿Cuándo puedes contactar a esta persona, si lo sabes?» |
| Media | «Red de apoyo» y «Contactos profesionales» abren la misma lista sin filtro (`Plan.tsx:55–69`) | Esperar destinos diferentes o un directorio de profesionales | Una entrada «Mis contactos» con tipos claros o filtros reales correspondientes |
| Media | Ayuda regional no muestra teléfonos antes de seleccionar región (`Emergency.tsx:11–14`) | Creer que no hay ayuda disponible o confundir registro con selección territorial | Dar protagonismo a «¿Dónde necesitas atención?». Mantener cobertura explícita y no asumir ubicación ni cobertura nacional |

Las prioridades reflejan juicio de la auditoría sobre barreras de acceso, no frecuencias o severidades medidas con participantes.

## Nombres descriptivos y origen DBT

Ejemplos de jerarquía, pendientes de validación y revisión profesional:

- Principal: **Hacer una pausa antes de actuar**. Nombre secundario: STOP.
- Principal: **Dar un descanso a la atención**. Nombre secundario: ACEPTAS.
- Principal: **Hacer este momento más llevadero**. Nombre secundario: SALVARA.

La adaptación actual de TIP es parcial; su título debe describir las prácticas que efectivamente contiene y no presentar un protocolo completo. No inventar expansiones de siglas ni prometer resultados.

En «Sobre estas guías» puede explicarse su origen en la terapia dialéctico-conductual (DBT), que no hace falta conocerla para usar las guías y que esta adaptación sigue en evaluación/revisión profesional. Esa información no debe ser un paso obligatorio antes de acceder a ayuda.

## Tres intenciones comprensibles

1. **Quiero una guía ahora**: acceso directo, sin frase ni plan previo. Explicar que se abre una guía de la app.
2. **Quiero preparar mi plan**: lista personal de recordatorios, pasos y contactos para consultar después. Explicar dónde se guarda.
3. **Quiero contactar a alguien**: distinguir contactos propios de líneas de atención. No prometer chat, disponibilidad de una persona o envío automático.

Es una organización conceptual para diseñar y probar. No implica añadir tres botones equivalentes de golpe, un cuestionario de gravedad ni nuevas pantallas obligatorias. Conservar acceso visible a atención urgente y los límites actuales.

## Otros matices

- «Estoy aquí» y «Encontrar compañía» pueden sugerir presencia humana. La interpretación no está observada. Probar qué espera encontrar la persona antes de explicar el destino; aclarar en el punto de uso que son guías y contactos.
- El compositor actual ya dice que abre la app de mensajes y que la persona decide si envía; copiar tampoco envía. Conservar estas aclaraciones: el problema principal está en las etiquetas anteriores al compositor.
- «Mis próximos pasos» puede referirse a tareas pendientes para completar la app. Probar «Qué quiero hacer cuando me sienta sobrepasado» como explicación del contenido guardado.
- Evitar ejemplos de «crisis económica» como categoría excluida. El origen de una emoción puede ser financiero; lo importante es describir el alcance de las herramientas y no prometer resolver deudas o trámites.

## Validación propuesta

Con personas nuevas que no conozcan DBT, sin explicaciones previas:

- «Al ver esta primera pantalla, ¿para qué crees que sirve Refugio?»
- «¿Qué esperas encontrar al pulsar Pedir apoyo?»
- «Has tenido un día difícil y no sabes si lo llamarías crisis. Muéstrame qué harías aquí».
- «Quieres preparar algo para consultar después. ¿Por dónde empezarías?»
- «¿Crees que aquí habrá una persona respondiendo? ¿Qué te hizo pensar eso?»

Incluir diferentes motivos cotidianos de malestar, experiencia digital y uso con/sin terapia, sin inferir necesidades a partir de edad o parentesco. Mantener datos ficticios y no provocar malestar para probar la app.

Observar comprensión del alcance emocional, elección sin saber siglas, acceso a ayuda sin formulario, distinción entre guía/contactos/atención humana y reconocimiento de que el plan es opcional. Registrar dudas e intervenciones antes de generalizar. Revisar primero lenguaje y destinos; las definiciones y cambios de contenido terapéutico requieren su revisión profesional correspondiente.

Implementación posterior autorizada por el usuario: [registro](2026-10-17-implementation.md). Las observaciones e hipótesis de esta auditoría se conservan como antecedente; las pruebas técnicas no sustituyen la validación con personas.
