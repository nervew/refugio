# GitHub Pages: preparación y límites

Estado: publicación de demo pública autorizada por el usuario el 2026-10-16. Código enviado en la PR #1; activación de Pages pendiente. La evaluación existente en Sites conserva su acceso privado.

## Encaje

Refugio compila a archivos estáticos: GitHub Pages puede servir dist/ por HTTPS. El repositorio confirmado es nervew/refugio, público. La URL esperada si se habilita la publicación es https://nervew.github.io/refugio/; no se afirma que esté activa.

## Cambios preparados

- BASE_PATH configurable: raíz por defecto, /refugio/ para el sitio de proyecto.
- Assets, iconos, manifiesto, start_url/scope y registro del service worker usan la misma base.
- El fallback offline y coordinación de clientes del SW se restringen a esa base.
- Almacén y canal por instalación: se mantienen los nombres existentes en raíz; la subruta usa un namespace diferente para evitar colisiones accidentales. Esto no crea aislamiento de seguridad por origen.
- CSP mediante meta en builds estáticos, y no-referrer mediante meta. El servidor local y hosts compatibles conservan las cabeceras completas existentes.
- Workflow pages.yml: publicación al actualizar main, autorizada el 2026-10-16, y ejecución manual con confirmación de demo pública. Sites conserva su privacidad.

## Límites frente al hosting recomendado

GitHub Pages no interpreta public/_headers ni permite configurar todas las cabeceras HTTP. CSP por meta no admite frame-ancestors; HSTS, nosniff, COOP y políticas de caché quedan bajo control del proveedor. No se declara equivalencia con las cabeceras del servidor local o un hosting con configuración propia.

Una ruta /refugio/ comparte origen con otros sitios de nervew.github.io. Esos proyectos no quedan aislados por el navegador aunque la bóveda esté cifrada y tenga un namespace distinto. Para información sensible se recomienda un subdominio propio exclusivo y un hosting que satisfaga la política completa; revisar el modelo de amenazas antes de datos reales.

Cambiar de chatgpt.site a github.io cambia de origen. Los planes no se trasladan automáticamente: requieren copia cifrada y su frase, e importación consciente. La demo sigue siendo para datos ficticios, con revisiones clínicas, jurídicas y seguridad independiente pendientes.

## Verificación local

```sh
BASE_PATH=/refugio/ npm run check
npm run test:pages
npm run build
npm run test:e2e
```

Las dos primeras órdenes verifican el build bajo subruta en puerto4175, sin depender de GitHub. Las otras restauran y prueban el build raíz para no romper Sites. BASE_PATH puede establecerse mediante el entorno de tu terminal si no utiliza sintaxis POSIX.

## Activación posterior

1. Subir código/configuración a nervew/refugio mediante una rama y PR.
2. Fusionar el cambio en main para publicar la evaluación autorizada.
3. En el repositorio: Settings → Pages → Build and deployment → Source: GitHub Actions.
4. Actions → Publicar demo de Refugio en GitHub Pages → Run workflow, rama main; marcar confirm_public_evaluation.
5. Esperar que el job deploy termine correctamente y abrir la URL que devuelve GitHub. No se puede declarar publicado solo por compilar localmente.

No introducir secretos, frases, backups .refugio o datos personales en GitHub. El workflow solo publica dist/. Su confirmación es para demo pública con datos ficticios, no una aprobación clínica/legal ni para uso con datos reales. release:check sigue bloqueando el lanzamiento formal mientras falten evidencias.
