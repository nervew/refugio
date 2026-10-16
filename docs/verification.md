# Evidencia de implementación y depuración

Registro: 2026-10-15 (America/Bogota). Build de evaluación0.1.0, sin despliegue público. Esta evidencia sustituye el estado operativo del bootstrap NORTH, no reescribe los documentos históricos de diseño.

## Resultado técnico

- TypeScript estricto: aprobado.
- Vitest:30 pruebas aprobadas en3 archivos; WebCrypto real de Node24 y repositorio IndexedDB mediante fake-indexeddb. Incluye carrera al bloquear durante cifrado y caducidad de inspección.
- Playwright:12 recorridos aprobados en Chromium154 headless sobre Linux con el build real y CSP activa. Las dimensiones móviles son emulación de viewport, no hardware iOS/Android.
- Prettier: aprobado.
- Build Vite/Workbox: aprobado; manifiesto, iconos y precache íntegro. Presupuestos de JS gzip<=250KiB y build<=2MiB comprobados por scripts/check-build.mjs.
- npm audit:0 vulnerabilidades conocidas reportadas en esta consulta; no equivale a auditoría del código o cifrado.
- Capturas de escritorio, móvil390px y crisis inspeccionadas visualmente. Reflujo automatizado a320CSSpx y texto ampliado; revisión por lectores de pantalla pendiente.
- release:check: bloqueo previsto por6 gates sin evidencia externa; no constituye fallo de implementación ni autorización para omitirlos.

Reproducir con los comandos del README y `.claude/rules/verify.md`. El reporte HTML y trazas de cada ejecución se generan en playwright-report/ y test-results/ (ignorados por Git). La CI fue configurada pero no se ejecutó remotamente en esta sesión.

## Trazabilidad y alcance real de las pruebas

| RF / US | Implementación | Evidencia local principal |
|---|---|---|
| 001 · plan | Plan/SectionEditor, listas ordenadas, límites y guardado parcial | Dominio; E2E edición/reapertura y reordenar pasos; fallo de quota/CAS en integración. |
| 002 · habilidades | Seis fichas, precauciones, pasos, personalización y pros/contras | Dominio seis IDs/estado pendiente/TIP; E2E guía y tarjeta personalizada. CLIN-01/02 externo pendiente. |
| 003 · crisis | Entrada directa, secuencia privada/generic fallback, apoyo permanente | E2E una acción, bloqueado, pasos propios, cambiar guía y modo offline. Usabilidad profesional pendiente. |
| 004 · reflexión | Alta/edición/eliminación, paginación20, escalas opcionales | E2E registro mínimo, intensidades ausentes; validación estricta del modelo. Sin diagnóstico automático. |
| 005 · contactos | Roles, prioridad/orden, alternativa, tel/sms, vista previa y copia | Dominio limpieza de referencias y saneamiento; E2E alta y acceso desde crisis. Marcador/SMS reales pendientes en hardware. |
| 006 · emergencias | País/región, filtro, cobertura, vigencia y estado vacío | Dominio fixtures pending/verified/retired; E2E ningún candidato accionable. Sin números oficiales verificados en paquete. |
| 007 · offline | Shell precacheado y lectura/escritura cifrada local | E2E reinicio y desbloqueo en avión; caché parcial revoca readiness. Retención real en SO pendiente. |
| 008 · seguridad | AES-GCM/PBKDF2, clave RAM, bloqueo/avisos y CAS |30 tests incluyen cifrado/tag/AAD/IV, frase incorrecta, suspensión, canarios cifrados, carreras y bloqueo entre pestañas. Revisión independiente pendiente. |
| 009 · recuperación | Export envelope, import límite/validación/reemplazo, impresión separada | Integración roundtrip/corrupción/frase destino/rotación/caducidad; E2E descargar/borrar/restaurar y selección imprimible mínima. |
| 010 · accesibilidad | Ambos temas, movimiento reducido, foco y controles grandes | Axe AA sin hallazgos en escenarios públicos/privados/diálogo y tema oscuro;320px y texto ampliado. No se declara conformidad AA completa sin revisión manual. |
| 011 · instalación/update | Guías Safari/Android, prompt condicional y consenso de clientes | E2E esperando/denegación con guía abierta en contexto crisis, caché parcial y activación fuera de crisis. Instalación física pendiente. |
| 012 · borrado | Confirmación, eliminación transaccional de bóveda/preferencias y limpieza de UI | Integración cancelación y borrado; E2E borrar/restaurar, sin promesa de borrar archivos externos. |

Las suites T001–020 de14 son el plan global, no20 pruebas únicas que se den por ejecutadas íntegramente. T013 matriz física, T018 aprobación profesional, la parte manual de T014/020 y el rendimiento en dispositivo mínimo siguen abiertos. La cobertura local no certifica eficacia clínica ni cumplimiento jurídico.

## Rendimiento medido con alcance limitado

[performance-local.json](performance-local.json) registra20 activaciones inicio→crisis sobre shell precacheado, contexto offline, Chromium headless y viewport390x844. p95 observado:116ms, con sobrecoste de automatización incluido. No se extrapola a iOS/Android, arranque físico en frío, LCP/INP de campo ni derivación de clave en dispositivo mínimo. Presupuestos restantes de13 requieren hardware y protocolo de QA.

## Correcciones de depuración

1. Cascada responsive corregida: reglas móviles después de las generales; sin columnas estrechas ni overflow a320px.
2. Borradores protegidos por router de datos, incluyendo historial; cancelar salida conserva lo escrito.
3. Escrituras de otra pestaña informan conflicto sin destruir borrador; CAS impide sobrescritura silenciosa.
4. Actualización espera respuestas de todos los clientes y bloquea interacción durante activación; no respuesta, borrador, pestaña oculta o contexto de crisis la impiden.
5. Contexto crisis se conserva al abrir habilidades, apoyo y emergencias; también protege actualizaciones desde una guía. El progreso público de pasos se mantiene solo en RAM al bloquear.
6. Formularios normalizan listas al enviar, sin mutar el estado ni depender del orden onClick/onSubmit.
7. Borrado/lock desmontan UI privada y diálogos; ayudas públicas siguen operativas. Cifrado pendiente aborta al vencer la sesión.
8. Barra de ayuda fija con espacio reservado y margen de scroll para mantener apoyo/emergencias accesibles sin cubrir controles.

## Pendientes externos y límites

Consultar release-readiness.json y NORTH/BACKLOG.md: clínica acreditada, fuentes oficiales regionales, privacidad jurídica colombiana, seguridad independiente, hardware físico y accesibilidad/usabilidad manual. Todos siguen sin aprobación.

No se ha elegido/contratado hosting ni definido responsable jurídico/canal de derechos. Los recursos123/106 siguen sin cobertura comprobada y excluidos del catálogo accionable. Las guías están marcadas pending. El release local no ofrece recuperación de frase ni sincronización.

Vite emite un aviso por tamaño bruto de chunk>500kB, aunque el presupuesto comprimido total pasa; vite-plugin-pwa emite aviso de deprecación de inlineDynamicImports en su pipeline. No impiden compilar y no se ocultaron bajando seguridad ni omitiendo recursos offline.

## Capturas sin datos reales

[Escritorio](screenshots/desktop.png), [móvil](screenshots/mobile.png), [modo crisis](screenshots/crisis-mobile.png). Son evidencia de vistas seleccionadas, no auditoría visual exhaustiva.

## Compatibilidad preparada para GitHub Pages

Verificación adicional local:31 pruebas unitarias/integración,2 E2E sobre /refugio/ (assets, scope/manifiesto, bóveda y reinicio offline),12 E2E raíz, tipos, formato y presupuestos de build aprobados. Se corrigió un fixture de corrupción que podía dejar el primer carácter del ciphertext sin cambiar; ahora siempre modifica el archivo. No se detectó un fallo de autenticación del cifrado.

La configuración no se ha enviado ni activado en GitHub. El repositorio nervew/refugio es público. Workflow manual y límites en docs/github-pages.md; ADR-003 propuesto. La evaluación Sites existente conserva su privacidad y su build desplegado; no se modificó su audiencia.

## 2026-10-16: GitHub público

PR https://github.com/nervew/refugio/pull/1 integrada en main (b264f5f0aa52897a87c681efbe930cb11456f3d8), autorizada como demo con datos ficticios. CI final de PR 38897618647 aprobada: check, formato, auditoría y12 E2E. Despliegue 38897897430:31 Vitest y2 E2E Pages aprobados, pero configure-pages devuelve404 (Pages sin habilitar); deploy omitido. Requiere activar Settings→Pages→Source:GitHub Actions y reejecutar. No se declara sitio Pages publicado.

## 2026-10-16: prueba sobre la URL publicada

https://github.com/nervew/refugio/actions/runs/38899623865 ejecutó navegadores contra https://nervew.github.io/refugio/ (sin servidor local ni interceptar recursos): HTTP200, crear plan con frase sintética y ambos consentimientos, guardar nota, recargar, desbloquear y comprobar persistencia. Chromium escritorio2.2s, Chromium móvil2.3s y WebKit con perfil iPhone10s:3 aprobadas, sin pageerror. Es emulación, no dispositivo físico. Datos solo en contextos limpios del runner; no se accedió al plan del usuario. Reproducción disponible en tests/deployed/plan.spec.ts y playwright.deployed.config.ts, rama remota fix/live-plan-check. CI general de esa revisión38899623820 aprobada.

No se reprodujo el botón sin respuesta reportado por el usuario. Pendiente navegador concreto y confirmar si cambia a “Abriendo tu espacio…”. No se aplicaron cambios especulativos a la aplicación ni se borró almacenamiento del usuario.

## 2026-10-16: revisión UX, color y Bogotá

Revisión con subagentes de UX y diseño: guardar contenido retorna al menú principal tras persistencia, con confirmación genérica. Secciones, preferencias del plan, contactos y reflexiones tienen acción explícita de guardar y volver. Cancelación y conflicto conservan borrador; los errores no navegan. Se coordinó la navegación con el bloqueador para evitar el aviso de descarte después de guardar.

Catálogo de demo:123/106 solo para CO-DC; fuentes y salvedades en [evidencia Bogotá](bogota-resources.md). Número visible en botón, horarios y fecha documental. No se realizaron llamadas ni se declara aprobación clínica o editorial independiente.

Paleta salvia/durazno/lavanda y variantes oscuras, sin fuentes externas. Subagente visual verificó contraste de nuevos pares mínimo5.56:1 claro/7.28:1 oscuro, axe Home sin infracciones y móvil390px sin overflow. Suite principal comprueba axe y320px.

Verificación de esta revisión:31 Vitest, build y13 E2E raíz aprobados. 2 E2E de subruta aprobados, incluyendo reinicio offline. Despliegue remoto de esta revisión pendiente al redactar este registro.
