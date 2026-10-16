# 11 · Seguridad y privacidad

Fecha de especificación: 2026-10-15. Estado: diseño pendiente de implementación, pruebas y revisión legal/profesional. No es certificación de seguridad ni dictamen jurídico. Fuentes y limitaciones: [registro de investigación](research/00-sources-and-findings.md), [OWASP consultado](research/OWASP-local.md).

## Modelo de amenazas y límites

Se protegen plan de crisis, contactos, personalizaciones y reflexiones frente a lectura casual de archivos/base local, sesión bloqueada y exposición accidental en logs/cachés. El diseño reduce filtraciones sin una cuenta ni transmisión de estos datos al operador.

| Amenaza | Medida MVP | Límite residual |
|---|---|---|
| Dispositivo compartido o extraviado | Bóveda cifrada, bloqueo, sin vista privada bloqueado | Sesión abierta, capturas y vista del sistema operativo pueden revelar datos. Recomendar bloqueo del dispositivo. |
| Copia física de IndexedDB/backup | AES-GCM + frase resistente + PBKDF2 | Ataque de diccionario offline posible; una frase débil no se vuelve fuerte por cifrado. |
| XSS/dependencia comprometida | CSP restrictiva, texto escapado, sin HTML arbitrario, paquetes fijados/revisados | Código malicioso ejecutado con el origen durante sesión abierta puede leer datos y capturar la frase. |
| Eliminación/evicción del almacenamiento | Aviso de persistencia y copia cifrada voluntaria | PWA no garantiza conservación; limpiar navegador/desinstalar puede perder la única copia. |
| Backup manipulado/importación hostil | Límites previos, AES autenticado, esquema estricto y reemplazo atómico | No distingue de forma fiable frase incorrecta y ciphertext dañado. |
| Datos revelados al pedir ayuda | Revisión previa y apertura explícita de marcador/SMS | Operador telefónico, app externa y receptor gestionan la información fuera de Refugio. |

Fuera de garantía: dispositivo comprometido/root, malware, extensiones privilegiadas, captura de pantalla, coacción, navegador o sistema operativo malicioso, recuperación forense de memoria/disco y eliminación segura del soporte físico. No afirmar “privacidad absoluta”, “cifrado militar”, anonimato total ni seguridad clínica garantizada.

## Cifrado y gestión de claves

**SEC-01 · P0.** WebCrypto en contexto seguro HTTPS; no criptografía propia. Frase secreta ≥16 caracteres Unicode tras normalización NFC, sin recortar espacios; permitir pegado y gestores de contraseñas. Contar longitud por puntos de código Unicode, evitando divergencias entre UI y validación; el mínimo por sí solo no garantiza entropía. Recomendar varias palabras aleatorias y evitar nombres/frases obvias. Confirmación al crear/cambiar; no mostrar frase salvo control momentáneo accesible. Sin PIN corto, preguntas de seguridad, biometría ni recuperación por correo en MVP.

**SEC-02 · P0.** PBKDF2-HMAC-SHA-256 deriva AES-256-GCM con sal aleatoria de 16 bytes generada por `crypto.getRandomValues`. Mínimo 600.000 iteraciones; calibración local en alta/cambio de frase busca aproximadamente 750 ms y nunca rebaja el mínimo. Techo de formato v1: 2.000.000 iteraciones, documentado para controlar consumo de importaciones hostiles. Si el mínimo tarda varios segundos, comunicar progreso y no reducirlo ni bloquear ayuda genérica. Registrar iteraciones en cabecera; no recalibrar al desbloquear. Reevaluar umbral con OWASP y dispositivos soportados antes de implementar; un cambio incompatible exige formato/ADR nuevo.

**SEC-03 · P0.** AES-GCM 256 bits, nonce/IV aleatorio nuevo de 12 bytes por cifrado, tag de autenticación 128 bits. Una sal nueva por bóveda, cambio de frase e importación hacia destino; persistir solo sal, parámetros, nonce y ciphertext, nunca frase ni clave. Nunca reutilizar deliberadamente nonce con la misma clave, incluso tras reintentar una escritura fallida. Cabecera completa sin ciphertext autenticada como AAD mediante serialización canónica del formato v1: propiedades ordenadas lexicográficamente en cada objeto, JSON sin espacios, UTF-8, enteros decimales y enums ASCII; base64url sin padding. Rechazar campos desconocidos y representaciones alternativas.

**SEC-04 · P0.** Antes de derivar: tamaño de archivo ≤8 MiB, formato/versión exactos, algoritmos permitidos, `iterations` entero entre 600.000 y 2.000.000, longitudes sal/nonce/tag y base64url válidos, ciphertext ≥16 bytes y límites de [09](09-data-model.md). No aceptar parámetros arbitrarios ni intentar fallback criptográfico. Frase equivocada y autenticación fallida producen `UNLOCK_FAILED`, sin mensajes que permitan inferir datos internos.

La clave se importa/deriva como `CryptoKey` no extraíble para los usos necesarios; la frase solo permanece el tiempo indispensable para la derivación. No guardar una versión “hash de frase” adicional ni un verificador de menor coste. JavaScript no garantiza borrado de memoria: descartar referencias y limpiar buffers controlables reduce exposición, sin prometer eliminación física inmediata. La clave permanece en memoria mientras exista la sesión desbloqueada.

**SEC-05 · P0.** No hay recuperación si se pierde la frase. Una copia cifrada **y su frase correspondiente** permiten restaurar; una copia sola o reinstalar no. Cambiar frase no cambia copias antiguas. Mensaje obligatorio durante alta: “Guarda tu frase en un lugar seguro. Si la pierdes, no podremos recuperar tu plan. Descarga una copia cifrada y conserva también su frase.” Copia sin clave actual no crea acceso alternativo a la bóveda.

## Sesión y disponibilidad en crisis

**SEC-06 · P0.** Bloquear al pulsar “Bloquear”, recargar/cerrar, a los **5 minutos sin interacción** o tras **5 minutos en segundo plano**. Son límites independientes; se aplica el primero que venza. Aviso accesible 30 segundos antes cuando está visible, con “Seguir aquí”; no renovar por temporizadores, reproducción de animaciones ni actualizaciones de red. Al regresar de suspensión comprobar el plazo **antes de pintar datos privados**; los temporizadores en segundo plano no son fiables. Llamadas breves pueden conservar sesión si no vence ningún plazo.

Bloquear limpia estado de UI, borradores privados y vistas de impresión en memoria; no mantener detalles privados detrás de un modal. La ruta privada vuelve a pantalla neutra. `BroadcastChannel` propaga bloqueo, pero cada pestaña verifica sus plazos y revisión. Ventanas nuevas empiezan bloqueadas. No prometer protección de la miniatura del selector de apps: reemplazar la vista al ocultarse como mitigación, conservando la sesión en memoria solo hasta su plazo.

**SEC-07 · P0.** Modo crisis no deshabilita bloqueo. Habilidades genéricas, instrucciones de seguridad y catálogo público **previamente verificado y no retirado** permanecen accesibles sin frase. Plan, contactos y personalizaciones requieren desbloqueo; comunicar este coste en preparación y ofrecer impresión sensible voluntaria. Sin cuestionarios ni identificación para ayuda genérica. Si IndexedDB/WebCrypto falla, la ayuda pública sigue disponible desde el paquete instalado; no crear una bóveda en claro como fallback.

## Superficie web y operación

**SEC-08 · P0.** CSP objetivo: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`. Confirmar compatibilidad del build y evitar `unsafe-inline`/`unsafe-eval`; fuentes/iconos locales, sin CDN, iframes, píxeles ni scripts de terceros. HTTPS, HSTS y `Referrer-Policy: no-referrer`; enlaces oficiales externos por acción explícita con `noopener noreferrer`. Cabeceras definitivas se comprueban en hosting, no se dan por activas porque este documento las enumere.

Service worker solo almacena assets públicos del origen; nunca solicitudes con datos personales, envelopes, exportaciones, páginas de impresión ni esquemas `tel:`/`sms:`. No poner textos/IDs de contactos/frases en URL, fragmentos, historial, título del documento, errores, logs o notificaciones. Sin notificaciones push. Texto personal se renderiza escapado y no se interpreta como Markdown/HTML ejecutable. Dependencias mínimas, lockfile, auditoría y actualización controlada; sin `console.log` sensible en desarrollo ni producción.

El hosting puede registrar IP, agente de usuario y solicitudes de assets aunque no haya backend funcional. Elegir proveedor y configurar minimización/retención de logs antes del piloto; documentarlo en aviso de privacidad. No prometer “ningún dato sale del dispositivo” de forma absoluta: el contenido de la bóveda permanece local; descarga de la app, sitios oficiales y acciones de contacto implican comunicaciones externas.

## Privacidad, derechos y Colombia

**PRIV-01 · P0.** Plan/reflexiones contienen datos de salud o información que puede revelar salud mental, además de datos de terceros en contactos: tratarlos como sensibles. Piloto adulto 18+, español de Colombia; sin menores, perfilado, publicidad, venta de información, geolocalización, seguimiento o IA. Minimizar campos; no solicitar diagnóstico, identidad legal, localización exacta ni datos de terceros innecesarios.

Marco por revisar: Ley 1581 de 2012 (datos personales y sensibles, especialmente arts. 5–6) y reglamentación aplicable, incluida compilación del Decreto 1074 de 2015 cuando corresponda. Acceso a fuentes oficiales de Colombia no pudo verificarse en esta sesión; no afirmar cumplimiento legal, consentimiento válido ni exención de responsabilidad del operador por diseño local. Revisión por profesional jurídico colombiano y texto legal aprobado son **bloqueantes de piloto público**.

La revisión debe determinar responsable/encargados aplicables, base jurídica, autorización de datos sensibles y carácter facultativo, aviso/política, canal de consultas y reclamos, régimen de terceros, logs de hosting, derechos y plazos, transferencias/transmisiones, y alcance de obligaciones en una app que no recibe la bóveda. La autodeclaración de adultez no prueba edad; la confirmación local del aviso no reemplaza análisis de autorización. No recopilar consentimientos en servidor por defecto.

**PRIV-02 · P0.** La persona puede ver, corregir, exportar y eliminar datos locales. Eliminar un contacto limpia referencias; eliminar una reflexión no deja papelera en MVP. Borrar toda la bóveda con confirmación es posible aunque se olvide la frase. Aclarar que el navegador/OS, backups previos, papel/PDF y destinatarios de SMS no se borran con esta acción. La eliminación es lógica, sin prometer sobreescritura física en flash.

## Exportación, impresión y retención

**PRIV-03 · P0.** Exportación estándar cifrada completa. Antes de imprimir: “Este plan contiene información privada. Otras personas podrían ver el papel o el PDF. Elige qué incluir.” Desmarcar contactos/notas opcionales por defecto; nunca incluir reflexiones por arrastre ni datos en URL. Vista de impresión efímera, no cacheada y sin enlace público. No copiar automáticamente a portapapeles ni compartir con un tercero. Descargas, diálogo PDF e impresión pertenecen al navegador/OS; la app no garantiza limpiar su historial.

No borrar registros por antigüedad sin acción explícita. Al alcanzar límites informar y permitir exportar/borrar. Recomendar copia tras cambios importantes, sin presión durante crisis. Persistencia solicitada al navegador mejora conservación si concede permiso, sin garantía de retención. Modo privado/incógnito, limpieza de datos, desinstalación y políticas del sistema pueden eliminar datos.

## Verificación y bloqueantes

| ID | Prueba/gate |
|---|---|
| AC-SEC-01 | Tras bloqueo/reload, inspección de DOM, estado persistido, cachés y logs no encuentra canarios privados. |
| AC-SEC-02 | Alterar cada campo autenticado/ciphertext falla; salt/nonce distintos entre re-cifrados; clave/frase nunca persistidas. |
| AC-SEC-03 | Imports con KDF extremo, JSON profundo, >8 MiB, versión futura o campos extra se rechazan sin bloqueo prolongado ni escritura. |
| AC-SEC-04 | Simular 5 min inactividad/segundo plano y reanudar tras suspensión: vista privada no se repinta; habilidades públicas disponibles. |
| AC-SEC-05 | Dispositivo lento respeta mínimo PBKDF2; sin WebCrypto no hay guardado en claro; exportar/restaurar con frase distinta funciona. |
| AC-PRIV-01 | Captura de red muestra solo assets públicos, sin cuerpos privados ni SDK terceros; hosting revisado y descrito en aviso. |
| GATE-SEC | Revisión del esquema criptográfico por persona competente y pruebas en matriz móvil antes de piloto; no declarar auditoría realizada. |
| GATE-LEGAL | Revisión legal colombiana, responsable/canal de derechos y aviso aprobados antes de distribución pública. |
