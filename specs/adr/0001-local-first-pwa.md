# ADR-001: PWA local-first sin backend en el MVP

- Fecha: 2026-10-15.
- Estado: decisión de diseño aceptada para el MVP, implementación y pruebas pendientes.
- Responsables: roles arquitectura, frontend y backend simulados.

## Contexto

El plan de crisis debe consultarse sin red después de una preparación inicial y contiene datos de salud y contactos. El repositorio inicial solo aporta README y licencia; no existen inversiones técnicas que obliguen a un framework. Una cuenta obligatoria añade fricción, recuperación y tratamiento de datos fuera del dispositivo. «Local-first» no equivale a retención garantizada: el navegador o el usuario pueden borrar IndexedDB y Cache API.

## Opciones evaluadas

1. React/TypeScript/Vite SPA PWA con IndexedDB: entrega estática, un cliente, offline directo, sin datos centrales; exige probar límites de iOS y enseñar backup.
2. Next.js con API/cuentas y sincronización: recuperación multidispositivo, mayor operación, superficie de ataque y complejidad de conflictos; red no puede ser dependencia del camino de crisis.
3. App nativa multiplataforma: mejor integración con almacenes de claves y distribución móvil, a costa de tiendas y mayor mantenimiento.

## Decisión

Elegir React + TypeScript + Vite, IndexedDB mediante Dexie, Workbox para precache y actualización controlada, contenido clínico estático y WebCrypto. No incluir backend de negocio, autenticación remota, sincronización, IA, telemetría, push ni CDN en ejecución. No crear endpoints simulados. Hosting HTTPS exclusivo sirve recursos públicos y no recibe el contenido del usuario.

Precachear seis habilidades completas y shell crítico, verificar disponibilidad offline antes de afirmarla, y mantener el SW nuevo esperando hasta una acción fuera de crisis o cierre natural de clientes anteriores. No activar ni recargar automáticamente en crisis. Exportación cifrada y plan imprimible explícito son requisitos de recuperación complementarios.

## Consecuencias y mitigaciones

- Ventaja: uso sin cuenta, superficie operativa pequeña, independencia de red para datos y contenido ya preparados.
- Coste: no hay recuperación desde soporte ni sincronización; pérdida del dispositivo o datos del navegador requiere backup externo.
- Coste: instalación y almacenamiento varían. Objetivo iOS/iPadOS 17+ Safari/standalone y Android 12+ Chrome últimas dos versiones estables; lanzamiento condicionado a pruebas reales de la matriz.
- Coste: una corrección clínica no llega a un cliente offline hasta actualizar. Contenido público versionado, revisión clínica y protocolo de incidentes deben considerar esa demora.
- Evolución: sincronización o paso a nativo requiere nuevo ADR y modelo de amenazas, no un backend anticipado.

## Verificación

ARC-01 a ARC-07 en [08](../08-technical-architecture.md); pruebas móviles y de actualización en [14](../14-testing-strategy.md). Fuentes realmente consultadas: [evidencia técnica](../research/architecture-evidence.md). No hubo prueba de instalación iOS/Android durante especificación.
