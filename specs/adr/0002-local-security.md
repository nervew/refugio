# ADR-002: Bóveda cifrada y desbloqueo local de sesión

- Fecha: 2026-10-15.
- Estado: decisión de diseño aceptada; revisión de seguridad y pruebas pendientes.
- Responsables: roles arquitectura y backend simulados, revisión de disponibilidad por producto/clínica.

## Contexto y amenaza

La bóveda contiene señales de crisis, experiencias, teléfonos y planes personales. Una persona con acceso casual a un dispositivo compartido o a una copia de IndexedDB no debe leerlos sin la frase. El plan también debe estar accesible en crisis: añadir un desbloqueo es un coste real de disponibilidad. No existe servidor que custodie claves o restablezca frases.

Fuera de la protección del cifrado local quedan malware, extensiones invasivas, captura de pantalla, acceso al dispositivo desbloqueado mientras la sesión esté abierta y JavaScript malicioso ejecutándose en el origen. HTTPS, CSP, dependencias verificadas y ausencia de terceros reducen estos riesgos, pero no convierten la PWA en un enclave seguro.

## Opciones evaluadas

| Opción | Disponibilidad | Privacidad y recuperación |
|---|---|---|
| Guardar datos legibles y apoyarse en el bloqueo del SO | Sin frase adicional | No protege dispositivo compartido ni copia de base; descartada |
| Cifrar y persistir la clave en el mismo navegador | Entrada automática | Una copia del perfil o código del origen puede recuperar clave y datos; no resuelve amenaza seleccionada |
| Cifrar con clave derivada de frase y conservarla solo en RAM | Requiere desbloquear cada sesión | Mejor defensa ante copia del almacén; no recuperable sin frase o backup accesible; elegida |
| WebAuthn/almacén nativo como requisito | Menor escritura de frase en algunos dispositivos | Compatibilidad y recuperación complejas; WebAuthn ordinario no es por sí solo cifrado de datos; pospuesto |

## Decisión criptográfica

Usar WebCrypto AES-GCM de 256 bits, etiqueta de autenticación de 128 bits, clave derivada mediante PBKDF2-HMAC-SHA-256, salt aleatorio de 16 bytes y entre 600 000 y 2 000 000 iteraciones para formato v1. En alta y cambio de frase, calibrar hacia 750 ms sin bajar de 600 000 ni superar 2 000 000; en desbloqueo usar el valor validado del envelope, nunca recalibrar. Fuente de aleatoriedad: `crypto.getRandomValues`; IV aleatorio nuevo de 12 bytes para cada escritura cifrada, nunca reutilizado deliberadamente ni derivado de ID/fecha. La clave CryptoKey de sesión se crea no extraíble. No almacenar frase ni clave derivada. Salts e IV son públicos y no deben confundirse con claves.

Se cifra una única instantánea completa de bóveda, no registros por separado. AAD autentica la cabecera completa sin `ciphertext` definida en [09](../09-data-model.md); serializar como JSON sin espacios con orden lexicográfico recursivo de claves y UTF-8 conforme a [11](../11-security-and-privacy.md). El adaptador debe verificar autenticidad antes de interpretar payloads. La autenticación del envelope permite comprobar desbloqueo; error de autenticación informa frase incorrecta o datos dañados sin borrar ni reinicializar la bóveda.

Los parámetros PBKDF2 se almacenan en cabecera y se validan antes de derivar. Validar entero dentro de 600 000–2 000 000 y algoritmos/longitudes exactas antes de derivar, impidiendo una importación con iteraciones enormes o debilitadas; otro algoritmo o rango requiere nueva versión, revisión y prueba. Medir coste en móviles objetivo y ofrecer progreso; no reducir iteraciones silenciosamente para cumplir presupuesto. Si no cumple disponibilidad, revisar ADR antes del lanzamiento. La robustez depende también de una frase suficientemente difícil de adivinar: exigir mínimo 16 caracteres tras normalización Unicode NFC; no recortar espacios, permitir frases largas y espacios, sin reglas de símbolos ni truncamiento. Aplicar la misma normalización en creación, desbloqueo, rotación e importación. No prometer que 16 caracteres aseguren entropía. La copia robada admite intentos offline sin límite de la UI.

El contenido sensible, incluidos nombres y teléfonos, se cifra; no indexar texto privado. IDs opacos, versiones, tamaños y parámetros criptográficos quedan visibles: minimizar y documentar esta fuga. Los metadatos privados de dominio permanecen dentro del ciphertext.

## Sesión y crisis

La clave solo vive en memoria de la pestaña; no se transmite al SW ni a otra pestaña. Recarga, cierre y bloqueo explícito obligan a desbloquear otra vez. Bloqueo tras cinco minutos sin interacción o cinco minutos en segundo plano, validando deadlines al volver antes de pintar información personal. Aviso visible 30 segundos antes del bloqueo por inactividad, prolongable con interacción explícita. Retirar datos del DOM al bloquear y no prometer borrado físico de RAM.

Crisis genérica, seis habilidades públicas y emergencias verificadas están accesibles sin desbloqueo. Plan y contactos personales requieren sesión abierta. Se explica esta separación durante preparación y se ofrece plan imprimible elegido conscientemente. No existe excepción oculta que escriba un plan personal legible para acelerar crisis. Este compromiso queda explícito en aceptación de producto y pruebas de usabilidad; si impide el uso seguro, debe revisarse antes de publicar.

## Copias, rotación y pérdida

Exportación completa cifrada, con la frase actual de la bóveda, sesión desbloqueada y acción explícita (no se pide reintroducirla para copiar el envelope), perfil criptográfico versionado. El backup reutiliza el envelope vigente ya cifrado, sin volver a cifrar ni generar un IV innecesario. No asumir que cambiar la frase local modifica copias anteriores. El formato debe permitir validación de tamaño, autenticidad, esquema y versión antes de reemplazar datos; un backup corrupto no altera la bóveda existente. No se ofrece envío automático, recuperación por email ni puerta trasera.

Cambiar la frase exige sesión desbloqueada y frase nueva confirmada: recifrar la instantánea completa con clave/salt/IV nuevos en una operación recuperable, sin mezcla de generaciones tras un fallo; conservar originales hasta commit. Este coste exige límites de tamaño del MVP. La impresión produce datos legibles fuera de la protección de la bóveda: advertencia breve, acción explícita, no caché ni registro, recordar custodia física. El SO/diálogo de impresión puede conservar un PDF y está fuera de control de la PWA.

Frase olvidada sin backup cuya frase se conozca implica pérdida de acceso. Antes de reiniciar exigir una confirmación específica de borrado local. La UI de exportación requiere sesión abierta; si todavía la hay, ofrecer copia cifrada antes de borrar. Bloqueado no se promete generar un respaldo mediante una ruta de recuperación que omita el desbloqueo. Ninguna promesa de borrado seguro del disco, de copias descargadas o de copias del SO.

## Consecuencias y verificación

La defensa es útil ante acceso casual/copia local, a costa de entrada de frase y mayor complejidad de migración. Exige pruebas de alteración de ciphertext, IV nuevo por escritura, ausencia de texto en almacenamiento/caché, bloqueo tras suspensión, exportación/importación y rotación interrumpida. Referencias operativas: [08](../08-technical-architecture.md), [09](../09-data-model.md), [11](../11-security-and-privacy.md), [14](../14-testing-strategy.md). No equivale a auditoría criptográfica ni conformidad legal certificada.
