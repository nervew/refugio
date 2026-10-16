# Evidencia de arquitectura

Consulta: 2026-10-15 (fecha local del solicitante). Se consultaron fuentes técnicas de MDN mediante su repositorio oficial; no se ejecutó una PWA ni se usaron dispositivos físicos.

| ID | Fuente efectivamente consultada | Hallazgo aplicado | Límite |
|---|---|---|---|
| AR-S1 | [MDN, Service Worker API](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/service_worker_api/index.md) | Requiere contexto seguro; un worker nuevo espera mientras existan páginas con la versión anterior; `skipWaiting()` permite adelantar activación. | Describe API y ciclo de vida, no certifica comportamiento de Refugio. |
| AR-S2 | [MDN, Storage quotas and eviction criteria](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/storage_api/storage_quotas_and_eviction_criteria/index.md) | El almacenamiento es best effort por defecto; `persist()` puede denegarse; modo privado suele borrar datos al terminar; Safari puede desalojar datos por inactividad. | Las políticas dependen del navegador, motor y versión; no se extrapola un plazo garantizado para instalaciones iOS. |

Se descargaron y leyeron ambas páginas completas. Se preserva aquí la síntesis y el enlace, no una copia del contenido de terceros. URLs de rama mutable: los hallazgos deberán reconsultarse al iniciar implementación. No se comprobó instalación, permanencia de datos, suspensión, llamadas, impresión ni exportación en iOS/Android. Los mínimos de soporte de las especificaciones son objetivos de producto sujetos a la matriz de pruebas, no resultados observados.
