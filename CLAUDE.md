# Refugio

> north_skill_version: 4.0
> north_level: 5

## Proyecto

`Refugio`: PWA local-first de plan personal de crisis basado en habilidades DBT.

## Preferencias

- **Idioma:** `es`.
- **Estilo:** conciso, cambios concretos, verificar antes de declarar terminado.
- **Modo consultivo:** resolver lo inferible; preguntar ante ambigüedad material no resuelta.

## NORTH

Memoria del proyecto en `NORTH/`; nivel 5 activado por solicitud explícita del usuario.
Objetivo vigente: `Implementar Refugio siguiendo los 18 SPECS y los 2 ADRs existentes`.
El último mensaje sustituye la propuesta previa de `PassVault`; no es un cambio de nombre.

- Inicio de sesión: leer `NORTH/CONTEXT.md`.
- Decisiones: consultar `NORTH/DECISIONS.md` cuando afecten la tarea; no cargar el archivo histórico por defecto.
- Próximo trabajo: `NORTH/BACKLOG.md` y `NORTH/SPECS/README.md`.
- Viabilidad: `NORTH/VIABILITY/`; especificaciones de ejecución: `NORTH/SPECS/`.
- Fuente técnica canónica: `specs/`; NORTH enlaza, no mantiene copias divergentes.
- Las restricciones «no implementar en esta fase» describen la entrega documental anterior; el objetivo vigente habilita la fase futura de implementación.
- Aprobación de desarrollo no equivale a aprobación clínica, jurídica o de lanzamiento; conservar los gates de `specs/15-mvp-roadmap.md`.
- Reglas verificadas en `.claude/rules/`; no inventar comandos de build o tests antes de configurar herramientas.
- Commits: emoji + Conventional Commits; decisiones históricas inmutables, superar mediante un ADR nuevo.
- `/north`: estado; `/north next`: siguiente tarea; `/north heal`: estructura; `/north compact`: contexto; `/north resume`: pendientes.
