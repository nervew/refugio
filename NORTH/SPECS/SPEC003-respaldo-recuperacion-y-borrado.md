# SPEC003: Respaldo, restauración, impresión y borrado

- **ID:** SPEC003
- **Estado:** 🟢 Implementando — funcionalidad implementada y depurada localmente; aceptación integral del MVP pendiente de gates externos.
- **Fecha creación:** 2026-10-15
- **Última actualización:** 2026-10-15
- **ADRs relacionados:** ADR-002
- **ADRs extraídos de este SPEC:** ninguno nuevo; reutiliza las decisiones existentes.
- **Viability origen:** [desarrollo incremental aprobado](../VIABILITY/_approved/2026-10-15-implementacion-refugio.md), con gates externos pendientes.
- **Hito / dependencias:** H1–H2; SPEC002; impresión se integra con SPEC004.
- **Trazabilidad:** RF-009, RF-012 / US-009, US-012.
- **Pantallas:** S12, S14.

## 🎯 Objetivo

Demostrar recuperación y control de datos antes de ampliar funcionalidad privada.

## 🚫 Non-goals

No fusiona bóvedas, guarda copias en nube, exporta diario legible ni promete borrado forense.

## 👤 User stories

Como persona usuaria quiero restaurar una copia o borrar lo guardado aquí para controlar mis datos. Historias fuente: [backlog canónico](../../specs/16-backlog.md).

## 📐 Contratos

- **Datos:** Envelope v1 y token efímero de Backup.inspect; archivo máximo8MiB, payload2MiB, versiones y límites09.
- **Operaciones:** Backup.exportEncrypted/inspect/replace, Plan.preparePrint, Vault.deleteAll y Vault.changeSecret según10.
- **API remota:** no aplica al MVP. No crear endpoints para simular contratos locales.
- **Eventos:** solo mecanismos locales especificados en08–11; no mensajes ni datos privados a servicios remotos.

## 🔄 Flujos principales

1. Desbloquear y solicitar copia cifrada del envelope vigente; nombre neutro y frase correspondiente a esa copia.
2. Inspeccionar archivo y autenticar en memoria; mostrar recuentos y opción de respaldo actual.
3. Confirmar reemplazo con frase destino verificada o alta nueva; recifrar con sal nueva y commit atómico.
4. Imprimir plan solo con selección/aviso explícitos; borrar datos locales con confirmación independiente.

## ⚠️ Edge cases y manejo de errores

- Archivo hostil, KDF fuera de rango, tamaño excesivo o esquema futuro: rechazar antes de alterar destino.
- Cancelar, perder sesión, error de cuota o migración fallida: conservar bóveda anterior.
- Frase olvidada y sin copia cuya frase se conozca: no ofrecer recuperación inexistente; borrado sigue explícito.

## 🏗️ Decisiones arquitectónicas implícitas

Reutilizar ADR-002; no duplicar ADRs por organizar NORTH. Antes de pasar a Implementando, comprobar viabilidad, releer contratos canónicos afectados y registrar cualquier decisión nueva de alcance transversal con el siguiente ID libre. Un cambio que contradiga una decisión existente requiere ADR sucesor.

## 🧪 Criterios de aceptación

- [x] Roundtrip a un perfil vacío recupera todos los campos y referencias confirmados.
- [x] Un byte cambiado, frase errónea o archivo inválido nunca modifica envelope ni revisión previos.
- [x] Respaldo cifrado no abre vista imprimible ni solicita una segunda frase de exportación.
- [x] Impresión excluye reflexiones y desmarca contactos/notas opcionales; explica copias externas.
- [x] Borrar elimina bóveda, preferencias y estado privado; conserva ayuda pública y advierte límites externos.
- [ ] Casos de T-009, T-012, T-015, T-017 ejecutados con build/plataforma/evidencia y sin bloqueantes aplicables.
- [x] ADRs revisados antes de implementar; estado NORTH actualizado solo según evidencia.


## 🔗 Referencias

- [09: data-model](../../specs/09-data-model.md)
- [10: api-contracts](../../specs/10-api-contracts.md)
- [11: security-and-privacy](../../specs/11-security-and-privacy.md)
- [14: testing-strategy](../../specs/14-testing-strategy.md)

## Evidencia actual

Funcionalidad implementada en `src/`, verificada con TypeScript/build,30 pruebas Vitest y12 recorridos Playwright en Chromium. [Evidencia y cobertura por requisito](../../docs/verification.md). Los checks marcados reflejan el alcance local, no acreditación externa. El caso global de suites permanece abierto cuando incluye hardware, revisión profesional o aceptación manual pendiente.
