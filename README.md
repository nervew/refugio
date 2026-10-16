# Refugio

PWA mobile-first para preparar y consultar un plan personal de crisis inspirado en habilidades DBT. React, TypeScript, Vite, Dexie/IndexedDB y WebCrypto. Funciona sin cuenta ni backend de negocio; no hay IA, analítica, anuncios ni sincronización.

## Abrir la evaluación privada

[Refugio en HTTPS](https://refugio-plan-personal.heartytulip64.chatgpt.site). Acceso exclusivo del propietario con su cuenta de ChatGPT. Despliegue confirmado; usar únicamente datos ficticios. `localhost` solo corresponde a ejecución en tu propio equipo. [Evidencia de despliegue](docs/private-deployment.json).

## Ejecutar

Requiere Node.js 24+ y npm. El lockfile fija las versiones utilizadas.

```sh
npm ci
npm run dev
```

Para comprobar la PWA y sus cabeceras sobre el build real:

```sh
npm run build
npm run preview
```

Abrir `http://localhost:4173` en el mismo equipo donde ejecutaste estos comandos. Este enlace no permite acceder desde tu equipo a un servidor ubicado en un entorno remoto. [Acceso y hosting privado](docs/hosting.md). El service worker se registra en el build de producción, no en el servidor de desarrollo. En otro dispositivo usar un origen HTTPS estable: WebCrypto y service workers requieren un contexto seguro. `localhost` se acepta para desarrollo; una IP de red por HTTP no ofrece esas garantías.

## Funciones implementadas

- Plan editable parcial, trece categorías, orden mediante botones y hasta tres pasos iniciales. Los editores de secciones, preferencias del plan, contactos y reflexiones guardan y vuelven al inicio con confirmación.
- Seis habilidades con precauciones, pasos, personalización y tarjeta de pros/contras.
- Modo crisis en una acción, ayuda pública bloqueado y plan/contactos solo dentro de sesión abierta.
- Red personal/profesional, alternativas, mensajes revisados antes de abrir apps externas y copia manual.
- Selector territorial con123 y106 para Bogotá D. C., fuentes oficiales y fecha de consulta documental; sin extrapolar cobertura. [Evidencia y límites](docs/bogota-resources.md).
- Reflexión voluntaria, intensidades opcionales y edición/eliminación; sin diagnóstico automático.
- Bóveda AES-256-GCM autenticada, PBKDF2-HMAC-SHA-256 entre600000 y2000000 iteraciones, frase NFC mínimo16 puntos de código, clave no extraíble solo RAM.
- Bloqueo manual, recarga, cinco minutos de inactividad o segundo plano; aviso y coordinación de pestañas.
- Copia cifrada completa, restauración validada/atómica, cambio de frase, impresión explícita del plan y borrado local.
- Temas claro/oscuro, texto ampliado, movimiento reducido, navegación con teclado, semántica accesible y diseño responsive.
- Precache íntegro comprobado y actualización que exige consentimiento de todas las pestañas fuera de crisis/borradores. Sin recarga automática en crisis.

## Verificar y depurar

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run format:check
npm audit --audit-level=high
```

`npm run check` agrupa TypeScript, pruebas unitarias/integración y build con presupuestos de peso. Los E2E arrancan el servidor del build y usan Chromium del sistema cuando existe; puede elegirse mediante `CHROMIUM_PATH`. Si falta, instalar el navegador de Playwright con `npx playwright install --with-deps chromium`. CI ejecuta estas comprobaciones; el workflow está creado pero su ejecución remota no se afirma.

Para inspeccionar un fallo: `npx playwright show-report`, o `npx playwright show-trace <trace.zip>`. Reportes, trazas y descargas de tests se ignoran en Git. Usar únicamente fixtures ficticios; no incluir datos personales en incidencias, capturas o logs.

## Evaluación y límites de lanzamiento

Esta entrega implementa el MVP para evaluación con datos ficticios. **No equivale a aprobación para piloto público o datos reales.** Siguen pendientes revisión clínica acreditada, verificación oficial regional, revisión jurídica colombiana, revisión de seguridad independiente, lectores de pantalla/usabilidad y hardware físico iOS/Android. El comando `npm run release:check` devuelve error mientras falte evidencia en `release-readiness.json`; no inventar aprobaciones para hacerlo pasar.

Las guías públicas siguen en estado editorial pendiente. No se distribuye un teléfono oficial sin evidencia. La aplicación no monitorea, diagnostica ni contacta a nadie por sí sola y no sustituye atención profesional ni emergencias.

Offline requiere descarga inicial íntegra y conservación del almacenamiento por el navegador. Borrar datos, desinstalar o eviction puede destruir la única copia. Una copia cifrada necesita su frase; no existe recuperación por servidor. Cifrar en reposo no protege una sesión abierta frente a XSS, extensiones, capturas o un sistema comprometido. Borrar desde la app no borra archivos externos ni garantiza borrado forense.

## Arquitectura y fuentes

- `src/domain`: esquema estricto, límites, referencias y acciones puras.
- `src/security`: cifrado, sesión y casos de uso de la bóveda; sin claves persistidas.
- `src/storage`: transacciones Dexie con revisión/CAS; un envelope cifrado por bóveda.
- `src/content`: guías públicas originales y contrato de emergencias; sin datos personales.
- `src/platform`: capacidades, descargas, preferencias públicas e integración PWA.
- `src/app` y `src/features`: navegación, formularios y las quince pantallas.
- `src/sw.ts`: precache y protocolo de actualización; nunca recibe datos privados ni abre la bóveda.

[18 SPECS](specs/00-executive-summary.md), [2 ADRs](specs/adr/), [NORTH](NORTH/README.md) y [evidencia de implementación](docs/verification.md). Las especificaciones originales describen la fase de diseño anterior; NORTH registra el avance posterior sin reescribir decisiones históricas.

## GitHub Pages

Demo pública autorizada; configuración con BASE_PATH=/refugio/, pruebas de subruta y publicación al actualizar main (o manual). [Guía y límites](docs/github-pages.md). Todavía no se ha publicado en GitHub Pages; el sitio de proyecto sería público y no conserva automáticamente la privacidad de Sites.

## Hosting posterior

Servir exclusivamente `dist/` bajo HTTPS y un origen dedicado. `scripts/serve.mjs` es un servidor estático de verificación local, no una API de negocio. `public/_headers` incluye la política CSP, no-referrer, nosniff, HSTS para hosting HTTPS compatible y caché; verificar las cabeceras reales del proveedor. Antes de publicar resolver los gates, definir responsable/canal de derechos y minimización/retención de logs técnicos. No se ha desplegado esta aplicación a un servicio público.
