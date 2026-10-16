# Depuración y recuperación

## Uso local

`npm run dev` permite desarrollo; para investigar offline/actualizaciones se necesita `npm run build && npm run preview` en localhost o HTTPS. No abrir index.html mediante file://. La PWA no queda lista por el mero hecho de instalarla: Ajustes comprueba el precache.

## Fallos esperados y diagnóstico

| Síntoma | Comprobación / acción |
|---|---|
| No aparece «Guías disponibles sin conexión» | Verificar service worker activo y caché íntegra; revisar HTTPS/localhost. No borrar la bóveda como solución. |
| No se puede guardar | Mantener el borrador en sesión, revisar permisos/cuota, descargar copia de lo previamente guardado. Jamás poner datos en claro para resolverlo. |
| Hay cambios en otra pestaña | Copiar manualmente notas que se quieran conservar, bloquear/reabrir y revisar la versión vigente; la escritura obsoleta no sobrescribe. |
| Frase incorrecta/copia alterada | Mensaje deliberadamente común; revisar frase y otra copia. No reinicializar datos de forma automática. |
| Importación rechazada | Formato, versión, tamaño, profundidad, KDF o autenticación no admisibles; destino permanece intacto. |
| Actualización no disponible o denegada | Salir de crisis y guardar cambios en todas las pestañas; una pestaña oculta/suspendida no cuenta como permiso. Cierre natural es alternativa. |
| Llamada/SMS no abre app | Usar número/texto seleccionable o copia explícita; no inferir entrega. Probar capacidades reales en el dispositivo. |
| Región sin números | Comportamiento previsto hasta verificación oficial; no habilitar candidatos para eliminar el estado vacío. |

## Datos y privacidad al investigar

IndexedDB contiene exclusivamente envelope y metadatos públicos mínimos. No registrar el payload, frase, clave o mensaje en consola, URL, screenshot o ticket. Las trazas E2E solo usan datos ficticios y se excluyen del repositorio. Revisar comportamiento con dos pestañas, suspensión, cuota y copias manipuladas después de cambios en persistencia.

No borrar almacenamiento del navegador como un «reset» de depuración cuando pueda haber datos sin copia. El borrado explícito de la app conserva caché pública para ayuda y no elimina descargas/impresiones. En perfiles de prueba vacíos se puede eliminar todo el origen para reproducir primera visita.

## Cambios corregidos durante implementación

- Orden de cascada: estilos móviles se cargan después de estilos generales; reflujo comprobado a320CSSpx y con texto ampliado.
- Navegación: borradores se protegen también al retroceder mediante el router de datos; no basta confirmar enlaces.
- Conflictos: una escritura de otra pestaña avisa y conserva el borrador; CAS rechaza la revisión obsoleta.
- Actualización: unanimidad de clientes, modo de espera y bloqueo de interacción durante activación; crisis, borrador o pestaña sin respuesta impiden activación forzada.
- Formularios: normalizar listas al enviar sin mutar el estado de React; no depender de onClick antes de onSubmit.
- Datos privados: al bloquear se desmontan vistas privadas y diálogos; no quedan detrás de un modal de desbloqueo.
