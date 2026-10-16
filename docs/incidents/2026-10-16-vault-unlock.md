# Lectura de planes con campos opcionales vacíos

Fecha: 16 de octubre de 2026. El usuario reportó al desbloquear: «No pudimos leer esta copia. El archivo debe ser una copia de Refugio válida.» No se recibió ni se accedió a su frase, archivo o almacenamiento.

## Reproducción y causa

Se reprodujo exactamente INVALID_FILE creando una bóveda, asignando explícitamente undefined a profile.regionCode, cifrando y volviendo a abrir. Zod admite propiedades opcionales explícitamente undefined. El serializador canónico anterior generaba un token undefined sin comillas en vez de omitir la propiedad, así que AES-GCM protegía texto que no era JSON válido. Mientras la sesión seguía abierta el plan podía parecer correcto; al recargar/bloquear JSON.parse fallaba después del descifrado. Otras propiedades opcionales vaciadas podían producir el mismo problema. El fallo existía antes del cambio visual; no se atribuye al usuario ni a una frase errónea.

## Corrección y compatibilidad

- La serialización de objetos omite valores undefined; arrays siguen la representación JSON null para elementos undefined. La cabecera AAD no cambia porque sus campos son obligatorios y definidos.
- Solo tras descifrado AES-GCM autenticado, si JSON estricto falla, se reconoce el token histórico undefined como valor completo de una propiedad. Se distingue texto entre comillas y escapes; no se cambia texto del usuario.
- Se usa un marcador efímero no presente en el texto, validación JSON con límites de tamaño/profundidad y validación estricta completa del modelo. No se usa eval, no se admiten llamadas/expresiones ni elementos undefined de arrays.
- La frase original y la autenticación siguen siendo obligatorias. Cabecera, límites KDF, versiones, etiqueta GCM y esquema mantienen sus controles. Una frase incorrecta sigue fallando.
- Abrir no reescribe el registro. El plan recuperado queda en RAM; el siguiente guardado explícito usa JSON correcto. La compatibilidad también aplica al contenido descifrado de copias, sin relajar el parser del archivo externo.

No se garantiza reparación de otros daños, formatos desconocidos o pérdida de la frase. No se debe borrar almacenamiento ni crear otro plan para probar esta corrección.

## Evidencia

El test de regresión falló con INVALID_FILE antes del cambio y pasa después. Hay pruebas de recuperación de un cifrado histórico autenticado, preservación de texto/escapes, rechazo de frase incorrecta y estructuras inválidas, y fixture sintético generado con el serializador anterior. La fixture pública contiene solo datos ficticios y una frase de prueba conocida. Las pruebas del navegador instalan ese registro exclusivamente en contextos de prueba limpios y comprueban que se recupera su nota.

34 pruebas unitarias,14 E2E y build aprobados. El E2E recupera una nota del fixture histórico. Despliegue en curso al redactar este registro.
