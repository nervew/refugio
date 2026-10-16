# Especificación funcional

Autoridad de IDs: [producto](01-product-requirements.md). Todas las operaciones privadas requieren sesión desbloqueada. No se guarda entrada personal en URL, logs o caché del service worker. Pantallas y errores se detallan en [07](07-screen-specifications.md); contratos en [10](10-api-contracts.md).

## RF-001 — Plan personal (P0)

Campos independientes: emociones frecuentes; señales tempranas; vulnerabilidades; desencadenantes; pensamientos; sensaciones corporales; impulsos; estrategias que ayudan; estrategias que empeoran; red de apoyo; profesionales; recursos de emergencia personales. Vulnerabilidad = condición previa como sueño insuficiente; desencadenante = evento como una discusión. Listas con orden manual; contactos referenciados por ID, no duplicados. Sección de preparación selecciona hasta tres pasos iniciales entre estrategias seguras/habilidades y orden de apoyos; sin selección se usa STOP genérico. Los contenidos personales no se evalúan clínicamente por software.

Guardar sección es explícito, transaccional y admite vacíos. «Guardado en este dispositivo» solo tras commit; edición pendiente no se pierde por error de almacenamiento. Cierre/OS kill puede perder cambios sin guardar, advertido al salir controlado. Reordenar no requiere arrastrar: botones subir/bajar. Límites de campos y entidades definidos únicamente en [09](09-data-model.md).

Aceptación: crear plan con una señal, guardar, cerrar, abrir sin red, desbloquear y obtener el mismo texto y orden; plan vacío no impide entrar en crisis. Guardar con cuota agotada conserva versión anterior y permite exportarla.

## RF-002 — Habilidades (P0)

STOP, pros y contras, TIP, ACEPTAS, cinco sentidos y SALVARA son contenido público local versionado con precauciones visibles. Instrucciones y variantes en [03](03-dbt-clinical-framework.md). Personalización privada añade preferencias sin reemplazar advertencias. Cada detalle permite anterior/siguiente, cambiar habilidad y apoyo; sin temporizador obligatorio. Registro opcional enlaza habilidad a reflexión, nunca abre formulario automáticamente durante crisis.

Aceptación: todas accesibles bloqueado y en avión tras precache; cualquier paso permite omitir/cambiar y consultar precauciones. TIP muestra variante conservadora por defecto; no se desbloquean técnicas de riesgo con una casilla de autodiagnóstico.

## RF-003 — Crisis (P0)

Inicio → «Necesito apoyo ahora» → crisis. Ningún onboarding, formulario o consentimiento analítico bloquea este recorrido. Sesión desbloqueada presenta hasta tres pasos preparados de uno en uno y primer contacto de apoyo; bloqueada ofrece guía genérica y «Ver mi plan» para desbloquear. Se preservan solo posición genérica/estado en RAM mientras vive la pestaña; ninguna sesión clínica se registra sin decisión posterior del usuario. No se persiste bandera de crisis como perfil de salud.

Acciones permanentes: cambiar habilidad, apoyo, emergencias, salir. No se exige «finalizar» ni justificar abandono. Apoyo desde crisis desbloqueada muestra contacto principal y alternativo sin navegar por configuración. Plan parcial usa lo disponible, etiqueta «Puedes usar esta guía» y no invita a completar campos en crisis. No hay detección automática de peligro por textos ni escalada automática.

Aceptación: entrar con un toque estando bloqueado/plan vacío/sin red; leer instrucciones genéricas. Desbloquear permite plan; cancelar devuelve guía. Retroceder nunca abre preparación accidentalmente ni pierde acceso a ayuda.

## RF-004 — Reflexión (P1)

Después, por iniciativa del usuario: situación, vulnerabilidades, desencadenante, emociones, pensamientos, impulsos, habilidades, intensidad antes/después (nulo o entero0–10), resultados/aprendizajes. No inferir antes/después ni imponer mejora; «No me ayudó» es resultado válido. Crear/editar/eliminar por registro; fechas editables sin registros automáticos de eventos de crisis. Aceptación: guardar solo aprendizaje y habilidad; escala omitida sigue nula, sin cero automático ni diagnóstico.

## RF-005 — Apoyo (P0)

Contacto con nombre elegido, rol personal/profesional, medios, disponibilidad escrita por usuario, prioridad y mensaje editable. `tel:` solo por pulsación; copiar número/mensaje como fallback. SMS y compartir nativo son mejoras detectadas, siempre con vista previa y destinatario elegido en sistema. No dar por enviada una solicitud ni confirmar llamada atendida. Un contacto eliminado desaparece de referencias del plan dentro de la misma transacción; no se destruye texto histórico de una reflexión.

Aceptación: desde crisis ver principal y alternativo; sin handler telefónico copiar; denegar portapapeles muestra texto seleccionable. Ninguna acción manda mensaje automáticamente.

## RF-006 — Emergencias (P0)

Selector manual país/región en preparación; se guarda región cifrada dentro de la bóveda; estando bloqueado se permite selección temporal en RAM, sin revelar la preferencia privada. Catálogo verifica territorio y muestra servicio/horario/canal/fecha/fuente. Sin región o catálogo vacío: ayuda general, elegir región y contacto privado si desbloqueado; sin número inventado. Colombia123/106 son candidatos de investigación deshabilitados, no datos productivos. No afirmar servicio 24h, gratuidad o alcance sin fuente. Vigencia y retiro en [fuentes](research/00-sources-and-findings.md).

Aceptación: número candidato nunca genera enlace de llamada; cambiar región oculta recursos incompatibles; offline señala datos de última verificación; recurso desactualizado se etiqueta; peligro inmediato permite acciones humanas sin cuestionario. Piloto regional bloqueado si no hay recurso oficial confirmado para la región.

## RF-007 — Offline (P0)

Cachear únicamente shell, iconos locales y contenido público versionado. Bóveda cifrada en IndexedDB separada. Estado sin conexión es informativo, sin bloquear guía. `navigator.onLine` es indicio, no comprobación de disponibilidad. Precarga incompleta ofrece reintentar en preparación; primera carga fallida necesita instrucciones del navegador pues una página no descargada no puede ejecutarse.

Aceptación: después de readiness, reiniciar instalado en avión, desbloquear y leer/guardar plan; borrar Cache API rompe readiness sin afirmar que plan se borró; borrar origen puede perder ambos y se explica.

## RF-008 — Privacidad (P0)

Frase mínima16 caracteres normalizada NFC sin recortar; admite espacios/pegado. Clave solo RAM, sin PIN ni clave persistida. Bloqueo manual, recarga/cierre, cinco minutos de inactividad o cinco minutos oculto. Advertencia treinta segundos antes cuando visible, posibilidad de mantener sesión; al volver oculto se comprueba vencimiento antes de renderizar texto privado. Genéricas/emergencias no se bloquean. Contrato criptográfico en09/11; no se promete protección frente a XSS, OS comprometido o capturas.

Aceptación: al bloquear no queda texto privado en DOM ni stores accesibles de UI; export cifrado requiere sesión; frase perdida sin respaldo y frase no se recupera por servidor.

## RF-009 — Copias (P0)

Exportar bóveda completa cifrada con nombre neutro y formato versionado; import valida tamaño/formato/KDF/autenticación/esquema antes de confirmar reemplazo. No merge; mantener original ante error. Permitir exportar original antes de reemplazar. Plan legible usa vista imprimible local, mínimo elegido, aviso de información sensible y confirmación; no exporta diario por defecto, no requiere generador PDF externo. PDF del sistema opcional, no se garantiza en todos los dispositivos.

Aceptación: exportar/restaurar a perfil vacío reproduce campos y referencias; cambiar un byte rechaza; contraseña errónea no modifica bóveda; export legible nunca ocurre al tocar «Respaldo cifrado».

## RF-010–012 — Accesibilidad, ciclo de vida y borrado (P0)

RF-010: ambos temas, foco, nombres, zoom, reflujo, lector y movimiento reducido según06/13; accesibilidad cubre también guías y archivos imprimibles legibles.

RF-011: no exigir instalación; instrucciones manuales Safari y prompt Android solo disponible por capacidad. Version nueva espera; usuario elige actualizar fuera de crisis, guardar cambios antes; fallo mantiene shell anterior y datos migrados con recuperación. No recarga forzada ni prompts comerciales en crisis.

RF-012: borrar bóveda y preferencias con confirmación explícita distinta de bloquear. Clave RAM se descarta antes de volver al inicio; contenido público puede conservarse para ayuda offline, pero preferencias de región/tema y datos privados se eliminan. Explicar que descargas, impresiones y copias del sistema no se borran. No afirmar borrado forense. Fallo parcial muestra estado de error sin afirmar éxito.

Aceptación: T-010/011/012 y pruebas transversales de14; segundo perfil del navegador es almacén independiente, no cuenta sincronizada.
