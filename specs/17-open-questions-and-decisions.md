# Decisiones, supuestos y pendientes

Registro: 2026-10-15. Propuesta de ingeniería completa para revisión; pendientes externos no sustituidos por opiniones de los cinco roles simulados.

## Decisiones comunes adoptadas

| ID | Decisión | Motivo / autoridad |
|---|---|---|
| D-01 | React + TypeScript + Vite, PWA SPA estática | Complejidad proporcionada, sin necesidad de SSR; ADR001. |
| D-02 | Local-first, sin cuentas, backend, IA, analytics ni sincronización MVP | Disponibilidad y minimización, ADR001/11. |
| D-03 | Bóveda AES-GCM y frase secreta >=16 caracteres NFC, clave solo RAM | Menor exposición en reposo; recuperación no garantizada, ADR002/09/11. |
| D-04 | Crisis genérica siempre pública, plan/contactos solo desbloqueados | Resolver disponibilidad vs privacidad sin atajo que exponga datos. |
| D-05 | Sesión vence a5min inactiva o5min oculta; aviso30s visible | Permitir retorno de llamadas breves y limitar exposición; comparar deadline antes de pintar. |
| D-06 | Respaldo cifrado completo; plan legible imprimible solo explícito | Recuperación y alternativa fuera del dispositivo, riesgos avisados. |
| D-07 | Piloto adultos18+, español y región colombiana verificada manual | Acotar validación; no verificación de identidad ni geolocalización. |
| D-08 | 123/106 candidatos deshabilitados hasta evidencia oficial | Cobertura no verificada en este entorno; gate H0. |
| D-09 | Verificado vencido se mantiene con advertencia; retirado se deshabilita | No quitar última información de ayuda solo por falta de red; no garantía de vigencia. |
| D-10 | Sin actualización forzada durante crisis | Evitar interrupciones; disponibilidad no equivale a parche inmediato offline. |

## Supuestos por validar

Teléfono personal con bloqueo de pantalla y navegador compatible; se admiten dispositivos compartidos con riesgos explícitos, sin prometer privacidad total. Predominio de planes de texto pequeños; límites09. Región seleccionada refleja dónde está la persona; se podrá cambiar de forma temporal bloqueado, sin revelar preferencia privada. No existe servicio de atención de Refugio, monitoreo ni respuesta humana continua.

## Preguntas abiertas con dueño y condición de cierre

| ID | Pregunta | Dueño | Cierre requerido |
|---|---|---|---|
| Q-01 | ¿Quién firma adecuación clínica de contenido y traducciones? | Producto + clínico acreditado | H0: credencial, revisión escrita y tratamiento de observaciones. |
| Q-02 | ¿Cobertura y condiciones actuales de123/106 en la región piloto? | Editorial | H0: fuentes oficiales leídas, ámbito/horario/canales/fecha y segundo revisor. |
| Q-03 | ¿Responsable jurídico y tratamiento técnico por hosting? | Privacidad/legal | H0: marco1581 y reglamentación aplicable verificados, logs y contratos definidos. |
| Q-04 | ¿Dispositivos físicos y versiones exactas para certificación inicial? | QA/frontend | Antes H3: matriz13/14 con resultados, sin confundir objetivo con soporte probado. |
| Q-05 | ¿Frase de16 y expiración5min son usables con población objetivo? | UX + seguridad | H3: sesiones consentidas, fallos y acciones correctoras; no debilitar cifrado sin nuevo ADR. |
| Q-06 | ¿Quién mantiene catálogo y contenido al terminar piloto? | Producto | Antes H4: responsable y proceso de retirada/incidencias. |
| Q-07 | ¿Marca y posibles derechos de uso de Refugio/variantes DBT? | Producto/legal | Antes publicación: búsqueda y revisión; licencia MIT repo no licencia contenidos ajenos. |
| Q-08 | ¿Tamaño del piloto y presupuesto de mantenimiento? | Producto | Antes H4: plan de soporte e investigación; sin añadir recopilación de datos por defecto. |

Q01–03 bloquean datos reales/piloto, no impiden implementar con fixtures sintéticos. No se pide al usuario resolver elecciones de ingeniería rutinarias ya tomadas.

## Riesgos y mitigaciones

| Riesgo | Severidad | Mitigación / residual |
|---|---|---|
| Instrucción corporal peligrosa | Crítica | TIP conservadora, CLIN-01/02 antes piloto; no aconsejar técnicas intensas. |
| Directorio incorrecto o sin cobertura | Crítica | Fuentes oficiales y región, cadencia90d, no activar candidatos; offline puede retener información desactualizada. |
| Pérdida de almacenamiento o frase | Alta | Respaldo cifrado probado y plan imprimible; sin recuperación servidor. |
| XSS/actualización maliciosa | Alta | CSP, dependencias mínimas, origen dedicado, integridad de releases; cifrado no protege sesión comprometida. |
| Bloqueo impide leer plan | Alta | Guía genérica y ayuda pública persistentes; frase conocida y alternativa impresa; evaluar usabilidad. |
| Contacto no responde o llamada falla | Alta | Alternativos, copiar, ayuda regional; no afirmar que mensaje fue recibido. |
| Datos en pantallas recientes/impresiones | Alta | Avisos, bloqueo manual, borrado privado DOM; no se garantiza control del OS o archivos externos. |
| PWA no disponible antes de descargar o tras eviction | Alta | Readiness comprobada, explicación y respaldo; no prometer «siempre offline». |
| Confundir app con atención/diagnóstico | Alta | Lenguaje claro, sin chat/triage automático ni promesa de vigilancia. |

## Resolución de contradicciones en revisión

Frase mínima unificada a16 (se descartó12); expiración en segundo plano unificada a5min (se descartó60s por retorno de llamadas); impresión explícita aceptada además de backup cifrado; región persistida cifrada y selección pública solo RAM; vencimiento90d advierte sin desactivar una fuente previamente verificada, mientras candidatos y retirados no llaman. Autoridad:09 para formato/límites de datos;04 para comportamiento;06 para tokens;13 para presupuestos de rendimiento;14 para evidencia. Si aparece contradicción posterior, registrarla aquí antes de implementar.
