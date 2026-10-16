# Acceso a Refugio

`http://localhost:4173` solo funciona en el equipo donde se ejecuta `npm run preview`. El servidor de esta sesión está en un entorno remoto; ese enlace no confirma acceso desde el navegador del usuario.

La configuración `.openai/hosting.json` registra una instancia Sites para evaluación privada con datos ficticios. El acceso debe permanecer exclusivo del propietario: no cambiar a público ni presentar el hosting privado como aprobación para uso clínico o piloto público.

El despliegue sirve `dist/` por HTTPS; no incorpora backend de datos, sincronización, analítica o números de emergencia pendientes. Los datos de la bóveda siguen en el navegador del visitante, bajo el origen de esta dirección. Si se cambia de dominio, el almacenamiento previo no se transfiere automáticamente: utilizar exportación/importación explícita.

Origen asignado a esta instancia: https://refugio-plan-personal.heartytulip64.chatgpt.site . Solo considerar accesible después de confirmación de despliegue exitoso. La autenticación exterior de Sites limita quién puede abrir el sitio; no sustituye el cifrado/frase del plan ni crea sincronización.

Los helpers de Sites referidos por la habilidad no están instalados en este executor. Para esta entrega se utiliza un flujo equivalente de Git autenticado con credencial efímera recibida por stdin, commit del código exacto y archivo del build que contiene su manifiesto. La credencial no se guarda en archivos ni argumentos del shell.

Para ejecutar el paquete descargado en tu propio equipo: Node.js24+, `npm ci`, `npm run build`, `npm run preview` y abrir entonces localhost:4173 en ese mismo equipo. No basta abrir index.html con doble clic.

## Resultado confirmado

Despliegue privado exitoso: [abrir Refugio](https://refugio-plan-personal.heartytulip64.chatgpt.site). El backend confirmó acceso owner-private. La evidencia nativa se registra en [private-deployment.json](private-deployment.json). No se cambiaron los gates clínicos, jurídicos o de piloto público.
