# Requisitos de producto

Versión 1.0 propuesta · 2026-10-15. Propietario: producto. Fuente del alcance: misión adjunta. Revisión clínica y jurídica externa pendientes.

## Problema, audiencia y resultado

Durante una crisis resulta difícil recordar apoyos y elegir una habilidad. Refugio permite preparar un plan en calma y consultar una secuencia corta, privada y disponible sin red después de la preparación técnica inicial. Piloto en español para adultos de 18 años o más en regiones colombianas habilitadas tras verificar recursos. Edad es segmentación de producto, no comprobación de identidad ni garantía de impedir acceso a menores. No recopilar fecha de nacimiento. Uso autónomo o acompañado; no requiere terapeuta ni compartir datos.

Éxito de producto se mide con pruebas de usabilidad consentidas y datos sintéticos: al menos 4 de 5 participantes encuentran crisis en una acción y el apoyo configurado en máximo dos acciones desde crisis desbloqueada; sin preguntas obligatorias ni bloqueo por plan incompleto. No se mide eficacia clínica ni se afirman reducciones de riesgo. Investigación con personas en crisis real queda fuera de esta fase y requiere protocolo profesional independiente.

## Alcance y prioridades

P0 es imprescindible para piloto; P1 completa el MVP público después de satisfacer P0. Ningún P1 permite omitir seguridad, accesibilidad o revisión clínica de lo que se libere.

| ID | Prioridad | Capacidad | Criterio de éxito |
|---|---|---|---|
| RF-001 | P0 | Plan editable con 13 categorías | Guardar parcial, reabrir offline y distinguir vulnerabilidad de desencadenante. |
| RF-002 | P0 | Seis habilidades DBT | Las seis incluyen objetivo, pasos, precauciones y personalización; accesibles sin plan. |
| RF-003 | P0 | Modo crisis | Una acción desde inicio, secuencia preparada y alternativa genérica; cambiar habilidad y ayuda siempre disponibles. |
| RF-004 | P1 | Reflexión voluntaria | Registro posterior editable, escala opcional 0–10, sin diagnósticos. |
| RF-005 | P0 | Red personal y profesional | Contactar o copiar mensaje con acción explícita; alternativas ordenadas. |
| RF-006 | P0 | Emergencias por territorio | Solo catálogo oficialmente verificado, región elegida manualmente, acceso bloqueado y offline a datos cacheados. |
| RF-007 | P0 | Disponibilidad offline | Shell y contenido completo precacheados; lectura/escritura privadas offline tras desbloquear. |
| RF-008 | P0 | Bóveda y privacidad | Cifrado local, clave RAM, sin cuenta, sin envío de datos personales. |
| RF-009 | P0 | Respaldo y recuperación | Exportar cifrado y restaurar atómicamente; plan legible voluntario con aviso. |
| RF-010 | P0 | Accesibilidad | WCAG2.2 AA objetivo, lectores de pantalla y ambos temas verificados antes de liberar. |
| RF-011 | P0 | Instalación y actualización segura | Uso web sin instalar; guía iOS/prompt condicional Android; sin recarga impuesta en crisis. |
| RF-012 | P0 | Control y borrado | Eliminar datos locales tras confirmación y comprobar eliminación; explicar copias externas. |

Fuera del MVP: menores como población objetivo, cuentas, backend clínico, sincronización, historial en nube, notificaciones, geolocalización, adjuntos multimedia, mensajería propia, IA, scoring de riesgo, diagnóstico, medicación, recomendaciones personalizadas automáticas y panel de profesionales. Exportar no implica compartir automáticamente.

## Decisiones operativas

No cobro ni monetización en piloto; futuro modelo pendiente sin anuncios ni venta de datos. Sin analítica en producto: resultados se recogen fuera de la app en sesiones de prueba consentidas. Hosting estático recibe solicitudes técnicas e IP: reducir logs y evaluar proveedor; «sin backend de aplicación» no significa ausencia total de tratamiento técnico.

La primera visita necesita red para descargar la aplicación. No puede prometerse offline antes de precache y verificación, ni después de que el sistema borre almacenamiento. Preparación muestra «Listo para usar sin conexión» únicamente después de comprobar recursos, persistencia de prueba y lectura del contenido; la etiqueta es una comprobación actual, no garantía futura. Emergencias telefónicas necesitan cobertura y dependen de otras apps/operador.

## Condiciones de liberación

H0: aprobación clínica real, revisión jurídica, recursos regionales oficialmente verificados y responsables asignados. H1–H4: criterios técnicos y de usabilidad del [roadmap](15-mvp-roadmap.md). Todo riesgo crítico de seguridad, contenido peligroso o pérdida de datos bloquea piloto; incertidumbres no críticas deben estar documentadas con dueño y seguimiento. Las especificaciones están completas como propuesta de implementación; no constituyen certificación clínica, legal o de plataformas.
