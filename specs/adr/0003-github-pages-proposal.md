# ADR-003: Evaluar GitHub Pages para una demo pública

- **Fecha:** 2026-10-15
- **Estado:** Aceptada para demo pública por el usuario el 2026-10-16; activación y publicación pendientes
- **Contexto:** Se solicitó evaluar GitHub Pages para Refugio. El repositorio es público, mientras que la evaluación actual en Sites tiene acceso exclusivo del propietario. La aplicación asumía rutas absolutas desde raíz.
- **Decisión:** Proponer un build estático con BASE_PATH configurable, soporte PWA por subruta y publicación manual de evaluación solo con datos ficticios. Mantener Sites privado y los gates profesionales pendientes. Configuración y límites en [guía](../../docs/github-pages.md).
- **Consecuencias:** GitHub Pages aporta HTTPS y entrega estática, pero no admite cabeceras personalizadas completas y un sitio de proyecto comparte origen con otros proyectos del propietario. CSP por meta es parcial; namespaces de IndexedDB/BC evitan colisiones, no proporcionan aislamiento de seguridad. Antes de datos reales se requiere revisar origen dedicado y política completa. Cambiar dominio exige exportación/importación para trasladar datos locales.
- **Alternativas consideradas:** Mantener Sites privado permite evaluación exclusiva ya operativa; Cloudflare Pages/Netlify con dominio dedicado ofrecen más control de cabeceras; GitHub Pages con dominio propio separa origen, conservando límites de cabeceras. No se reemplaza ni se cambia el estado de ADR-001/002.
