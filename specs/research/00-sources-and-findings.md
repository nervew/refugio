# Investigación y evidencia

Consulta: 2026-10-15, America/Bogota. Fase documental; ninguna aplicación, prueba móvil, evaluación clínica ni dictamen jurídico ejecutados.

## Inspección inicial

Repositorio `/workspace/refugio`, commit inicial `e9eaab1`. Contenía README de dos líneas, licencia MIT y .gitignore; árbol de trabajo limpio. No se encontró AGENTS.md bajo /workspace, especificaciones, código, gestor de paquetes ni pipeline. Se conservan los archivos iniciales. La misión original se encuentra en el adjunto del usuario; esta documentación desarrolla su alcance sin implementar el producto.

## Método y acceso

Se leyó la política de red y el estado del entorno: acceso restringido a paquetes y GitHub; los portales de salud/gobierno, Apple, W3C web y MDN web no están autorizados. No se intentó eludir esa restricción. Se consultaron fuentes de los proyectos oficiales en sus repositorios de GitHub mediante HTTPS. `sources.json` conserva URL exacta, fecha, ruta y SHA-256 de cada copia. Son snapshots de ramas mutables, no una auditoría exhaustiva ni garantía sobre futuras versiones. El HTML W3C es fuente de edición; sus criterios se usan como base técnica, la conformidad normativa requiere contrastar la recomendación publicada antes de liberar.

| Fuente consultada | Hallazgo y consecuencia |
|---|---|
| [MDN Service Worker](MDN-SW.md) | Requiere contexto seguro; instalación y activación separadas; precache permite shell offline. Se usa HTTPS y actualización diferida fuera de crisis. |
| [MDN almacenamiento](MDN-storage.md) | IndexedDB no garantiza retención; cuotas, navegación privada, borrado y eviction. `persist()` puede rechazarse y no reemplaza respaldo. No prometer disponibilidad perpetua. |
| [MDN instalación](MDN-install.md) | Instalación depende del navegador; iOS carece de `beforeinstallprompt`; desde iOS16.4 se documenta instalación desde compartir en otros navegadores. MVP certificará Safari y dará instrucciones manuales. Android puede ofrecer prompt. |
| [OWASP HTML5](OWASP-local.md) | IndexedDB no cifra ni defiende de scripts hostiles. Evitar secretos en Web Storage y respuestas privadas en Cache API; usar origen dedicado, CSP y cifrado con clave no persistida. |
| [W3C WCAG2.2 fuente](WCAG22.html) y criterios [contraste](WCAG-contrast-minimum.html), [reflow](WCAG-reflow.html), [foco](WCAG-focus-not-obscured-minimum.html), [objetivo táctil](WCAG-target-size-minimum.html) | Texto normal 4.5:1; reflujo y foco visibles; mínimo AA de objetivos 24px con excepciones. Refugio eleva objetivos interactivos a 48px y exige AA en ambos temas. |

## Investigación oficial pendiente, sin afirmación de verificación

| Tema | Punto de entrada institucional para consulta posterior | Qué falta comprobar | Efecto |
|---|---|---|---|
| Colombia 123 | https://www.policia.gov.co/ y autoridad territorial de emergencias | Fuente exacta vigente, cobertura municipal/regional, servicio, disponibilidad, acceso telefónico | Candidato deshabilitado; no `tel:` precargado ni afirmación de cobertura nacional. |
| Colombia 106 | https://www.minsalud.gov.co/ y https://www.saludcapital.gov.co/ | Distinguir servicios nacional/territorial y sus condiciones; horario, cobertura, costo y canales vigentes | Candidato deshabilitado; no extrapolar cobertura de Bogotá a todo Colombia ni viceversa. |
| Datos sensibles | https://www.sic.gov.co/ y https://www.funcionpublica.gov.co/ | Texto aplicable Ley1581/2012 y reglamentación; responsable, tratamiento local, hosting y transferencias | Gate jurídico; sin declaración de cumplimiento. |
| DBT | Manuales legítimamente disponibles y profesional acreditado | Adaptaciones españolas STOP/TIP/ACEPTAS/SALVARA, originalidad, contraindicaciones y aptitud | Contenido propuesto; revisión clínica acreditada obligatoria antes del piloto. |
| PWA en dispositivos actuales | Documentación Apple/WebKit y Android/Chrome | Versiones, instalación, memoria/retención, retorno de llamada, almacenamiento standalone vs Safari | Matriz objetivo, prueba física pendiente. |

Estas URL son puntos de entrada, no páginas leídas ni evidencia de cobertura. No hay números oficiales verificados en este trabajo. No se publicará el piloto colombiano con catálogo vacío: H0 exige al menos un recurso de urgencia de cobertura confirmada por cada región admitida y verificación explícita de ambos candidatos. Si un candidato no aplica, registrar evidencia y mantenerlo deshabilitado. El usuario puede guardar sus propios contactos como datos privados; se distinguen de recursos oficiales y no se etiquetan como verificados.

## Vigencia de recursos

Responsable editorial designado por producto obtiene evidencia oficial con URL exacta, fragmento factual, ámbito y fecha; segundo revisor comprueba coincidencia, sin realizar llamadas de prueba a emergencias. Revisar cada 90 días y ante avisos de cambio. Versionar el catálogo en el paquete público. Offline mostrar fecha y región; si venció, advertir que puede haber cambiado, conservar acceso a última información verificada con etiqueta de desactualizada, sin inventar reemplazo. Una retirada confirmada se distribuye en siguiente versión; no se garantiza recepción offline inmediata. Véanse [protocolos](../12-safety-and-crisis-protocols.md).
