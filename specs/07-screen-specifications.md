# 07 · Especificación de pantallas

Fecha: 2026-10-15. IDs estables S01–S15; variantes no requieren pantallas extra. Cada pantalla aplica [sistema de diseño](06-design-system.md), jerarquía semántica, foco al título, navegación por teclado y objetivos de 48px. Implementación posterior; no hay prototipo validado con personas ni validación clínica acreditada.

## Reglas compartidas

Público significa contenido editorial descargado y catálogo oficialmente aprobado, nunca datos de una persona. Desbloqueado significa clave temporal en memoria y acceso al almacén cifrado. El estado de conexión y el estado de bloqueo son independientes. Cinco minutos de inactividad o de app oculta bloquean la sesión; aviso visible 30s antes permite continuar. Recarga/cierre y bloqueo manual requieren frase de nuevo. La aplicación no puede garantizar que el selector de apps, navegador, SO o capturas oculten datos.

Guardado es explícito, con estado pendiente y éxito solo después de transacción persistida. Descartar protege cambios no guardados; entrar a crisis no depende de confirmar descarte. No insertar texto sensible en URL, título de pestaña, analítica, logs ni mensajes técnicos. El teclado virtual no tapa acción activa; errores no borran valores. Sin conexión se conservan funciones locales ya descargadas; «llamar» requiere capacidad del dispositivo/red telefónica.

## S01 · Inicio `/`

- **Objetivo/contenido:** entrada limpia: nombre Refugio, acción predominante «Necesito apoyo ahora», acceso Mi plan, Habilidades, Apoyo; reflexión y ajustes secundarios. Explicación breve «Un apoyo para seguir tu plan. No sustituye atención profesional ni emergencias». «Emergencias» visible sin desplazamiento en móvil de referencia de 360×640px con texto predeterminado; con zoom puede requerir desplazamiento accesible.
- **Acciones:** crisis abre S04 en una activación; Mi plan y Apoyo redirigen S13 si bloqueado. No abrir bienvenida por encima del botón de crisis.
- **Estados:** primera entrada ofrece S15 opcional; bloqueado no muestra resumen, contacto ni conteo de registros; desbloqueado puede mostrar «Plan guardado»; offline aviso no modal; fallo de datos ofrece ayuda pública.
- **Aceptación/a11y:** CTA primero después del título en lectura y foco; no carrusel; botón nombrado exactamente como etiqueta. RF-003/RF-010.

## S02 · Preparar mi plan `/plan`

- **Contenido:** secciones de reconocimiento, contexto, estrategias y apoyo según 05. Cada fila muestra «Sin completar» o resumen breve elegido por usuario. Sin porcentaje, notas de desempeño o campos obligatorios. «Preparar primer paso» permite elegir habilidad/estrategia y contacto preferido para crisis.
- **Acciones:** editar sección S03; contactos S07/S08; catálogo S05; «Ver mi plan en modo crisis» S04; volver inicio.
- **Estados:** vacío «Puedes completar solo lo que te sirva»; parcial plenamente utilizable; bloqueado S13; fallo carga conserva acceso público sin inventar valores.
- **Aceptación/a11y:** encabezados de sección navegables y orden simple; contenido personal solo tras desbloquear; actualizar un campo no destruye otras secciones. RF-001.

## S03 · Editor de sección (subvista de `/plan`)

- **Contenido:** una categoría por formulario, etiqueta, ejemplo no persistido y campos multilínea/listas. Vulnerabilidad: «Algo que ya estaba presente, por ejemplo dormir poco». Desencadenante: «Lo que pasó antes de que aumentara el malestar». Pensamiento, sensación e impulso tienen campos separados. Estrategias que empeoran no se muestran como instrucciones de crisis.
- **Acciones:** agregar/eliminar elemento, guardar, cancelar. Ordenar estrategias mediante subir/bajar además de cualquier arrastre. Límites de longitud y conteos visibles según modelo de datos; mensaje antes de superar límite.
- **Estados:** borrador, guardando sin doble envío, guardado, error de validación, fallo de cuota/almacenamiento con reintento. Salida con cambios pide descartar, excepto entrada urgente a S04.
- **Aceptación/a11y:** etiquetas permanentes, error específico, foco al resumen de errores; salto entre campos no guarda de forma ambigua. Bloqueo limpia datos descifrados; borradores no confirmados pueden perderse y el aviso de sesión lo explica. RF-001/RF-008.

## S04 · Modo crisis `/crisis`

- **Contenido inicial:** «Un paso a la vez»; instrucción genérica STOP de una frase; acción principal «Seguir este paso». Contacto favorito visible si desbloqueado y existente; «Buscar apoyo» y «Emergencias» persistentes. «Cambiar habilidad», «Ver más de mi plan» y «Salir de la guía» en orden secundario.
- **Acciones:** continuar S06, cambiar S05, apoyo S07, emergencias S09. Mostrar plan personal bloqueado solicita S13 sin impedir continuar públicamente. Sin interrogatorio, escala obligatoria ni evaluación automatizada de peligro.
- **Estados:** plan preparado usa primer paso seleccionado; incompleto usa paso genérico para partes ausentes; vacío «Puedes empezar sin tener un plan»; bloqueado «Tu plan está bloqueado…»; offline mantiene guía instalada; error de descifrado nunca deja pantalla vacía. Peligro inmediato se comunica mediante «Si hay peligro inmediato, abre Emergencias o busca ayuda presencial» y acción persistente, sin inferirlo de respuestas.
- **Aceptación/a11y:** una activación desde S01; primera instrucción no depende de cargar datos ni red; barra persistente no tapa texto/foco; etiquetas cortas y visibles. RF-003/RF-006/RF-007.

## S05 · Habilidades `/skills`

- **Contenido:** seis tarjetas, siempre en orden consistente: STOP, Pros y contras, TIP, ACEPTAS, Cálmate con los cinco sentidos, SALVARA. Nombre + objetivo breve; sin «mejor habilidad para ti», ranking ni recomendación según diagnóstico.
- **Acciones:** abrir S06; en contexto crisis conserva origen y retorno; preparación permite marcar preferida solo desbloqueado.
- **Estados:** pública completa offline si descargada, favorita personal oculta si bloqueado, contenido clínico deshabilitado para distribución si no pasó revisión requerida. No ofrecer contenido sin aprobar como si estuviera publicado.
- **Aceptación/a11y:** seis entradas identificables con teclado y lector; ningún filtro necesario para encontrarlas; cambio de habilidad no exige terminar la anterior. RF-002.

## S06 · Guía de habilidad `/skills/:publicSkillId`

- **Contenido:** objetivo y cuándo usar; precauciones antes de instrucción aplicable; un paso breve por vista con «Paso X de Y», ejemplo original y personalización opcional. «Siguiente», «Anterior», «Cambiar habilidad», «Buscar apoyo», «Emergencias». Pasos canónicos y límites en 03.
- **Variantes:** STOP muestra pausa/observación/acción consciente; Pros y contras compara actuar sobre impulso o resistirlo sin valorar moralmente a la persona; TIP presenta primero precauciones corporales y alternativa suave sin frío intenso, apnea ni esfuerzo impuesto; ACEPTAS ofrece estrategias breves sin convertir evitación temporal en solución prolongada; Cinco sentidos permite omitir cualquier sentido y alternativas para discapacidad/sensibilidad; SALVARA ofrece alternativas compatibles con valores sin obligación religiosa.
- **Personalización/resultados:** fuera de crisis puede editar ejemplos cifrados. Al terminar «Registrar cómo me fue» abre S10 preseleccionando habilidad, siempre omisible. Temporizador, si existe, es opt-in, pausable y sin avance obligatorio.
- **Estados:** estándar público, personalizado desbloqueado, contraindicación con alternativa y «Elegir otra habilidad»; offline; último paso con «Volver al inicio». Tras bloqueo regresa a contenido genérico del mismo paso sin recuperar texto personal.
- **Aceptación/a11y:** instrucciones completas accesibles sin gesto, sonido, color ni reloj; precauciones TIP visibles antes de cualquier técnica corporal; ninguna técnica intensa se activa en MVP, aunque la persona declare autorización profesional. RF-002/RF-003.

## S07 · Red de apoyo `/support`

- **Contenido:** contactos personales, profesional tratante y alternativos; preferido primero, luego orden manual; nota «Puedes probar con otra persona si no responde». Mensaje preparado visible solo desbloqueado. Emergencias separado visualmente de agenda privada.
- **Acciones:** llamar mediante botón explícito con teléfono legible; preparar mensaje en compositor externo, editar S08; otro contacto; S09. Copiar texto/teléfono solo por acción explícita, con aviso de portapapeles compartido cuando se ofrece.
- **Estados:** bloqueado muestra S13 y alternativa pública; vacío ofrece «Agregar contacto» en preparación y emergencias en crisis; sin marcador ofrece copiar número tras confirmar; volver de app externa no afirma envío o llamada atendida.
- **Aceptación/a11y:** tarjeta por sí sola no inicia llamada; nombres accesibles únicos («Llamar a Ana»); datos privados no disponibles en bloqueo. RF-005.

## S08 · Editor de contacto (subvista de `/support`)

- **Contenido:** nombre/alias, relación/rol, teléfono, canal admitido, mensaje preparado y preferido/alternativo. Aclarar «Acuerda antes cómo pedir apoyo a esta persona»; no se exige información médica. Campos opcionales salvo alias y al menos un canal válido para guardar.
- **Acciones:** guardar, cancelar, eliminar con confirmación, ordenar. No importar agenda completa, enviar invitación ni pedir permisos de contactos.
- **Estados:** nuevo/edición, formato inválido, guardado, error. Número personal no recibe etiqueta «emergencia verificada»; caracteres de control y esquemas ejecutables se rechazan.
- **Aceptación/a11y:** teclado telefónico es ayuda, no validación exclusiva; números admiten prefijo internacional y formato definido por contrato; errores explican qué corregir sin exponerlos en logs. RF-005/RF-008.

## S09 · Emergencias `/emergency`

- **Contenido:** país y región elegidos manualmente (selección pública temporal; persistir preferencias territoriales solo dentro de la bóveda desbloqueada), recurso con cobertura, disponibilidad declarada, canal, fuente oficial y fecha de verificación; «La disponibilidad del servicio puede cambiar». Sin permiso GPS ni detección por IP. «Si puedes, pide a alguien de confianza que te acompañe» y alternativa de urgencias presencial.
- **Acciones:** «Llamar a [servicio]» únicamente para recurso aprobado de la región; cambiar región; volver a guía. Abrir marcador nunca equivale a atención recibida. Fuente externa se anuncia como enlace que requiere internet.
- **Estados:** catálogo aprobado, región sin cobertura, verificación pendiente, recurso suspendido/no vigente según reglas de catálogo, offline con versión/fecha local. Colombia 123/106 son candidatos pendientes de verificación oficial de cobertura: no aparecen como botones ni números recomendados en la versión distribuible hasta aprobarse.
- **Aceptación/a11y:** pantalla pública accesible desde inicio y crisis, sin cuenta/frase; ausencia de catálogo presenta ayuda textual y acceso a apoyo si disponible. Recursos no verificados no son marcables, aunque estén en archivos internos de investigación. RF-006.

## S10 · Reflexión `/reflection`

- **Contenido:** formulario opcional de situación, vulnerabilidades, desencadenante, emociones, pensamientos, impulsos, habilidades utilizadas, intensidad antes/después 0–10 o sin respuesta, resultados y aprendizaje. «Puedes hacerlo después o dejar campos vacíos».
- **Acciones:** guardar, cancelar; si viene de S06 preselecciona solo habilidad, nunca inventa situación, intensidad ni resultado. Al guardar abre S11. No feedback diagnóstico.
- **Estados:** vacío, parcial válido, guardando, guardado, errores; bloqueado S13; sin plan permite registro igualmente.
- **Aceptación/a11y:** todas las preguntas son opcionales, cero distinto de omitido; no es ruta obligatoria para salir de crisis; controles de intensidad admiten entrada teclado además de cualquier slider. RF-004.

## S11 · Historial y detalle `/history`

- **Contenido:** lista por fecha local con etiqueta breve opcional; detalle expande un registro seleccionado en memoria. Fecha/hora visible y zona pertinente según modelo; sin gráficos de mejoría, rachas, etiquetas de riesgo ni diagnósticos.
- **Acciones:** abrir, editar S10, eliminar con confirmación y regresar lista. Exportar desde S14; no compartir individualmente por defecto.
- **Estados:** vacío con acción crear, bloqueado, error de lectura, eliminado. Lista no renderiza datos privados antes de verificar sesión. No autoselecciona último registro tras recarga.
- **Aceptación/a11y:** filas con nombre legible y fecha, no solo iconos; eliminación comunica resultado una vez y mueve foco a fila siguiente o título. RF-004/RF-012.

## S12 · Ajustes y privacidad `/settings`

- **Contenido:** tema, ayuda de instalación/offline, estado de almacenamiento, versión, catálogo región, aviso «Tus datos están en este navegador y dispositivo», bloqueo manual, copias/restauración y eliminación. Riesgo: almacenamiento del navegador puede ser borrado o expulsado y navegación privada no es respaldo.
- **Acciones:** cambiar tema, seleccionar región, S14, bloquear, solicitar persistencia si API lo permite, instalar solo cuando navegador lo permita; mostrar pasos manuales iOS revisados según plataforma. Actualización se ofrece fuera de crisis y sin borrador.
- **Estados:** instalado/no instalado/no compatible/desconocido; almacenamiento persistente concedido/denegado/no disponible; offline; update disponible. Nunca garantizar permanencia por concederse persistencia.
- **Aceptación/a11y:** funciones personales exigen S13; enlaces y ajustes etiquetados; mensajes no afirman borrar historial ni cerrar otras apps. RF-007/RF-008/RF-010/RF-011.

## S13 · Crear frase / desbloquear `/unlock`

- **Contenido:** frase secreta de mínimo 16 caracteres, normalización NFC sin recortar; permite espacios y pegado; creación pide repetir frase y explica sin recuperación remota. Desbloqueo no impone mínimo a una frase existente antes de validar versión de respaldo. «Mostrar frase» opt-in momentáneo con estado accesible; no mostrar por defecto.
- **Acciones:** desbloquear/crear, cancelar al origen, «Seguir con ayuda pública», restaurar S14. Crear no borra datos previos; cambiar frase dentro de ajustes requiere sesión y reenvoltura atómica según contrato de cifrado.
- **Estados:** procesando, frase errónea o archivo inválido sin filtrar detalles de datos, espera progresiva ante errores según seguridad, fallo criptográfico, frase perdida. No PIN ficticio, pregunta de seguridad ni biometría prometida.
- **Aceptación/a11y:** input de contraseña etiquetado, aviso de error claro, pegado y gestor de contraseñas permitidos. Cancelación siempre vuelve a crisis si ese era origen. RF-008.

## S14 · Copia y restauración `/backup`

- **Contenido:** archivo cifrado como opción principal; explica que la frase del archivo puede diferir de la actual y que perderla impide recuperar. Resumen de versión, cantidad de elementos y alcance solo tras descifrado correcto. Impresión/PDF legible del plan es acción separada y explícita: «Este plan contiene información privada. Otras personas podrían ver el papel o el PDF. Elige qué incluir». Contactos/notas opcionales desmarcados por defecto; nunca incluir reflexiones automáticamente. La vista efímera no se cachea ni tiene enlace público.
- **Acciones:** descargar cifrado, preparar impresión y abrir diálogo del navegador; elegir archivo, validar versión/tamaño/integridad, introducir frase, vista previa y «Sustituir datos locales». Restauración MVP sustituye, no fusiona: recomendar copia previa y confirmar. Cancelar conserva almacén original. Eliminar datos locales en subvista: confirmar alcance, acto atómico y regreso a inicio público.
- **Estados:** preparando, descarga iniciada (sin afirmar archivo guardado), archivo inválido/no compatible, frase errónea, fallo de espacio, restaurado, eliminado. Error nunca destruye almacén previo; última descarga puede requerir comprobación manual en iOS.
- **Aceptación/a11y:** operación sustitutiva no se ejecuta al seleccionar archivo; avisar que borrar aquí no elimina archivos exportados, portapapeles, historial, copias externas ni capturas. RF-009/RF-012.

## S15 · Bienvenida `/welcome`

- **Contenido:** una pantalla breve: qué permite Refugio, ayuda pública sin registro, datos locales cifrados y riesgo de pérdida sin copia, límites de atención profesional/emergencias. Público adulto; no recopila fecha de nacimiento.
- **Acciones:** «Preparar mi plan» crea frase S13; «Explorar habilidades» S05; «Necesito apoyo ahora» S04; omitir vuelve a S01. No consentimiento de analítica ni onboarding por diapositivas.
- **Estados:** primera visita o reapertura desde ayuda; no modal superpuesto al inicio. Si almacenamiento falla, ayuda pública permanece disponible.
- **Aceptación/a11y:** todas las salidas accesibles, ninguna obligación de completar plan o marcar casilla para guía pública. RF-001/RF-003/RF-008.

## Comprobación de estados por riesgo

| Escenario | Resultado exigido |
|---|---|
| Inicio bloqueado, sin plan, modo avión tras instalación | S04 genérica y S06 descargadas en una acción; S09 sin números pendientes |
| Llamada externa de 2 minutos | Retorno sin acción repetida; sesión conservada si no se cumple otro criterio de bloqueo |
| Retorno tras 6 minutos oculta | Verificar deadline, bloquear antes de pintar personales, conservar guía pública |
| Guardado falla por cuota | No mensaje «Guardado»; mantener edición en sesión, ofrecer reintento y ayuda pública |
| Frase errónea | Error de acceso; no pérdida ni sustitución de almacén; crisis pública disponible |
| Restauración corrupta | Original intacto; mensaje recuperable; no presentar importación como completada |
| Texto 200%, ancho 320px, lector | Todas las acciones alcanzables; sin solapamiento con barra de ayuda |
| Catálogo sin verificación Colombia | Ningún enlace tel para 123/106; alternativa presencial explícita |

Estas condiciones se convierten en pruebas en [14](14-testing-strategy.md); revisión clínica y verificación territorial siguen siendo dependencias de publicación, no trabajo ya acreditado.
