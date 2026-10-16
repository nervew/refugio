# Refugio · Especificaciones completas del MVP

Versión documental 1.0 · 2026-10-15. Estado: propuesta lista para planificar implementación con condiciones de lanzamiento identificadas. **No se implementó la aplicación.** No hay validación clínica profesional, dictamen legal, pruebas de aplicación ni certificación móvil ejecutadas.

Refugio es una PWA para preparar y consultar un plan personal de crisis inspirado en habilidades DBT. La experiencia central abre apoyo en una acción, reduce decisiones y ofrece seis guías sin cuestionarios obligatorios. Audiencia inicial: adultos, español, piloto en regiones colombianas cuya ayuda oficial se verifique antes de publicar.

## Investigación realizada

Se inspeccionó el repositorio: solo README, licencia MIT y .gitignore; no había AGENTS.md, código ni SPECS reutilizables. Se consultaron realmente fuentes de MDN sobre service workers, instalación y almacenamiento, W3C sobre WCAG2.2 y OWASP sobre seguridad HTML5 mediante sus repositorios oficiales. Copias, URLs, fecha y hashes están en [investigación](research/00-sources-and-findings.md) y [manifiesto](research/sources.json). La red restringida impidió consultar portales oficiales colombianos y fuentes clínicas: la cobertura actual de123/106 y la revisión bibliográfica regional quedan explícitamente pendientes. No se inventaron verificaciones.

## Arquitectura recomendada

React + TypeScript + Vite, SPA estática PWA, IndexedDB mediante Dexie y WebCrypto. Se compararon PWA ligera, framework con servidor y aplicación nativa/híbrida. Se elige la primera por simplicidad y uso offline; decisiones [ADR001](adr/0001-local-first-pwa.md) y [ADR002](adr/0002-local-security.md). Sin cuenta, backend de aplicación, IA, analítica ni sincronización en MVP.

El plan, contactos y reflexiones se almacenan en una bóveda AES-GCM con clave derivada de frase secreta y mantenida solo en RAM. El contenido genérico y catálogo oficial público son independientes de la bóveda. Desbloquear es necesario para el plan personal; las guías públicas siguen disponibles bloqueado. Offline depende de una descarga inicial íntegra y de que el navegador conserve almacenamiento: no se promete permanencia. Copia cifrada y plan imprimible explícito cubren alternativas de recuperación, sin recuperación de frase en servidor.

## Diseño y alcance

Dos contextos: preparación en calma y crisis. Quince pantallas especificadas; una instrucción principal cada vez, apoyo/cambiar habilidad/emergencias accesibles. Sin formularios obligatorios en crisis, rachas, gamificación ni diagnósticos. Temas claro/oscuro, colores originales adaptados con ratios calculados, objetivos táctiles48px y WCAG2.2 AA como criterio de verificación pendiente.

MVP: plan de trece categorías, seis habilidades (STOP, pros/contras, TIP, ACEPTAS, cinco sentidos y SALVARA), crisis, red personal/profesional, recursos regionales verificados, reflexión voluntaria, cifrado, respaldo/restauración, impresión del plan y borrado. TIP utiliza únicamente una alternativa conservadora propuesta; su fidelidad, traducción y seguridad requieren aprobación acreditada. No se incluyen técnicas intensas o de frío extremo.

## Entregables y lectura recomendada

| Documento | Contenido |
|---|---|
| [01 Producto](01-product-requirements.md) | Alcance y12 requisitos priorizados. |
| [02 Personas y recorridos](02-personas-and-user-journeys.md) | Hipótesis de usuarios, contextos y flujos. |
| [03 Marco DBT](03-dbt-clinical-framework.md) | Seis fichas originales, precauciones y gates clínicos. |
| [04 Funcional](04-functional-requirements.md) | Comportamientos, errores y aceptación RF001–012. |
| [05 Arquitectura UX](05-ux-information-architecture.md) | Navegación, flujo de crisis y estados. |
| [06 Diseño](06-design-system.md) | Tokens, contrastes, componentes y microcopy. |
| [07 Pantallas](07-screen-specifications.md) | S01–S15 y estados accesibles. |
| [08 Arquitectura técnica](08-technical-architecture.md) | Alternativas, capas, caché, migraciones y plataformas. |
| [09 Datos](09-data-model.md) | Entidades, envelope cifrado, límites y concurrencia. |
| [10 Contratos](10-api-contracts.md) | Interfaces locales; sin API remota innecesaria. |
| [11 Privacidad](11-security-and-privacy.md) | Amenazas, claves, recuperación y obligaciones por revisar. |
| [12 Seguridad en crisis](12-safety-and-crisis-protocols.md) | Peligro inmediato, ayuda humana y recursos oficiales. |
| [13 No funcionales](13-non-functional-requirements.md) | Veinte objetivos medibles. |
| [14 Pruebas](14-testing-strategy.md) | Veinte suites, matriz móvil y trazabilidad. |
| [15 Roadmap](15-mvp-roadmap.md) | H0–H4 y criterios de salida. |
| [16 Backlog](16-backlog.md) | Doce historias trazables y habilitadores. |
| [17 Decisiones](17-open-questions-and-decisions.md) | Riesgos, supuestos, dueños y preguntas abiertas. |
| [ADRs](adr/) | Dos decisiones arquitectónicas justificadas. |
| [Revisión final](research/01-review-and-verification.md) | Revisión de los cinco roles y límites de la verificación documental. |

## Riesgos, pendientes y siguiente orden de trabajo

Riesgos principales: pérdida del almacenamiento o de la frase; exposición en sesión abierta/XSS; recursos telefónicos fuera de cobertura o desactualizados; contenido DBT adaptado aún sin revisión real; limitaciones PWA en móvil. La mitigación y el riesgo residual se detallan en11/12/17.

Antes del piloto se necesita psicólogo clínico acreditado con experiencia DBT, revisión legal colombiana, verificación oficial de123/106 y de la cobertura de la región elegida, revisión del cifrado y pruebas físicas iOS/Android. Los candidatos123/106 no generan llamadas hasta verificarse. La pregunta de quién asume revisión clínica, privacidad y mantenimiento editorial tiene dueño en17; no se disimula como una aprobación ya obtenida.

Orden recomendado: **H0 contenido/recursos/privacidad → H1 bóveda/offline/recuperación → H2 plan/apoyos → H3 crisis accesible y dispositivos → H4 reflexión, pruebas completas y piloto**. H1 puede desarrollarse con datos sintéticos mientras se resuelven revisiones externas, sin habilitar datos reales. Las especificaciones documentales están completas; los gates de lanzamiento permanecen pendientes.
