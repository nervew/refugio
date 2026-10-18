# Directorio por ciudad y lenguaje emocional

Consulta documental: 18 de octubre de 2026 (UTC). Solicitud del usuario: aclarar qué empieza a ser difícil y añadir Medellín, Cali, Frankfurt am Main y Ámsterdam, conservando Bogotá.

«Cuando me cuesta manejar mis emociones» sustituye el título ambiguo de señales tempranas. La pregunta nombra cuerpo, pensamientos y conducta con ejemplos, sin cambiar la clave `earlySignals` ni las notas guardadas.

## Evidencia del directorio

| Ciudad | Recurso y alcance | Fuente de la entidad responsable |
| --- | --- | --- |
| Bogotá, Colombia | 123 emergencias y 106 orientación; solo Distrito Capital | [Evidencia existente](bogota-resources.md) |
| Medellín, Colombia | 123, emergencias del SIES-M, 24/7 | [Alcaldía, SIES-M](https://www.medellin.gov.co/es/secretaria-seguridad/siesm/) |
| Medellín, Colombia | Línea Amiga 106, orientación psicológica gratuita 24/7 para habitantes del Distrito | [Secretaría de Salud, Línea Amiga](https://www.medellin.gov.co/es/secretaria-de-salud/linea-amiga/). [Activación y cobertura del 106](https://www.medellin.gov.co/es/sala-de-prensa/noticias/la-alcaldia-de-medellin-activo-la-linea-106-para-consultas-de-salud-mental/) |
| Cali, Colombia | 123 activa emergencias; no se atribuye horario no comprobado | [Secretaría de Salud, Código Dorado](https://www.cali.gov.co/boletines/publicaciones/192266/para-prevenir-riesgos-en-salud-mental-el-gobierno-de-alejandro-eder-promueve-el-codigo-dorado/) |
| Cali, Colombia | 106, orientación por profesionales y primeros auxilios psicológicos, 24/7 | [Alcaldía, teleorientación](https://www.cali.gov.co/boletines/publicaciones/192156/alcaldia-de-cali-prioriza-la-salud-mental-calenos-tienen-a-disposicion-la-linea-106-para-teleorientacion/) |
| Frankfurt am Main, Alemania | 112, bomberos y emergencias médicas, gratuito | [Feuerwehr Frankfurt, Notruf](https://www.feuerwehr-frankfurt.de/ihre-sicherheit/notruf) |
| Frankfurt am Main, Alemania | TelefonSeelsorge 116123, servicio nacional de escucha, gratuito día y noche; alemán | [Operador, teléfono y preguntas frecuentes](https://www.telefonseelsorge.de/telefon/) |
| Ámsterdam, Países Bajos | 112, servicio nacional de emergencias, conecta con el lugar desde donde se llama | [Gobierno, cuándo llamar](https://www.government.nl/documents/question-and-answer/emergency-number-112/when-can-i-call-112) |
| Ámsterdam, Países Bajos | De Luisterlijn 0880767000, escucha confidencial para habitantes de Países Bajos, día y noche; neerlandés, tarifas habituales del operador | [Operador, preguntas frecuentes](https://www.deluisterlijn.nl/over-de-luisterlijn/veelgestelde-vragen/), [cobertura y horario](https://www.deluisterlijn.nl/persberichten/vraag-naar-luisterend-oor-luisterlijn-300000-gesprekken-2023/) |

Las páginas de Cali se corroboraron mediante los extractos indexados del dominio oficial: la apertura directa devolvió error/403 en el servicio de navegación. Esta limitación se registra; no se afirma una lectura integral ni una comprobación telefónica. El directorio de Medellín y su anuncio oficial identifican 106 y su cobertura; no se añaden canales históricos de WhatsApp que cambian entre publicaciones.

Cada tarjeta enlaza su propia fuente, identifica la entidad, fecha, alcance y límites. Las líneas de escucha no se presentan como despacho de ambulancias. No se promete español en Alemania ni Países Bajos. Los números se muestran para llamar desde el país seleccionado; no se fabrican prefijos internacionales.

Se mantienen las selecciones departamentales anteriores, sin asignarles cobertura municipal: Antioquia no equivale a Medellín y Valle del Cauca no equivale a Cali. Cambiar de país borra la ciudad temporal. País y ciudad pueden guardarse en el plan cifrado; no se muestran al estar bloqueado. El país admite CO/DE/NL de forma aditiva y sigue aceptando planes históricos CO, con el mismo formato cifrado.

`verified` significa cotejo documental para la demo de evaluación. Sin llamadas de prueba, mensajes, aprobación clínica ni revisión editorial independiente. Los gates externos siguen pendientes. Las fuentes deben revisarse como máximo a los 90 días; la interfaz advierte cuando vence la revisión y no garantiza respuesta.

## Validación

Comprobados: tipos, 35 pruebas unitarias/integración, build y 19 pruebas E2E en Chromium (incluidas accesibilidad, móvil y lectura cifrada histórica). También pasaron las 2 pruebas de subruta GitHub Pages. Publicación pendiente al registrar este cambio. Las pruebas nuevas comprueban selección de ciudades, país, número, fuente, ausencia de cruces de cobertura y persistencia cifrada sin exponer ubicación al bloquear.
