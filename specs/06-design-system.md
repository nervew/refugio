# 06 · Sistema de diseño

Fecha: 2026-10-15. Identidad serena y legible para personas adultas; lenguaje respetuoso, formas simples y espacio suficiente. Sin ilustraciones infantiles, insignias, celebración de rachas ni decoración que compita con ayuda. Objetivo WCAG 2.2 AA, sujeto a pruebas manuales además de herramientas automáticas.

## Color y contraste

Contrastes calculados mediante luminancia relativa sRGB de WCAG, `(Lmayor + 0.05)/(Lmenor + 0.05)`, redondeados a dos decimales; sin transparencias. No equivalen a auditoría visual de una implementación.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `canvas` | #F6F3ED marfil | #10252D | Fondo |
| `surface` | #FFFFFF | #18343E | Tarjeta, diálogo |
| `text` | #183B46 petróleo | #F6F3ED | Texto principal |
| `text-secondary` | #183B46 | #B9CFCD | Texto secundario sin reducir opacidad |
| `primary-bg` | #183B46 | #7BA9A3 | Acción principal |
| `primary-text` | #F6F3ED | #183B46 | Etiqueta acción |
| `support-bg` | #7BA9A3 salvia | #18343E | Apoyo y selección suave |
| `border` | #57817F | #7BA9A3 | Límites de controles y foco |
| `focus` | #183B46 | #7BA9A3 | Anillo exterior con separación |
| `error-text` | #923A28 | #FFD0C3 | Error acompañado de texto/icono |
| `sand` | #D8C6B5 | #D8C6B5 | Superficie decorativa limitada |
| `terracotta` | #D58B78 | #D58B78 | Acento decorativo; sin texto pequeño encima |

| Par medido | Ratio | Decisión |
|---|---:|---|
| Petróleo / marfil | 10.82:1 | AA texto normal y AAA |
| Petróleo / salvia | 4.59:1 | AA texto normal; no añadir opacidad |
| Petróleo / arena | 7.23:1 | AAA texto normal |
| Petróleo / terracota | 4.45:1 | No AA normal: solo decoración o texto grande; se prefiere no usar para etiquetas |
| Blanco / salvia | 2.61:1 | Prohibido texto/controles que requieran contraste |
| Blanco / terracota | 2.69:1 | Prohibido texto/controles que requieran contraste |
| Marfil / fondo oscuro | 14.32:1 | AAA texto normal |
| Marfil / panel oscuro | 11.85:1 | AAA texto normal |
| #B9CFCD / panel oscuro | 8.05:1 | AAA secundario |
| Salvia / panel oscuro | 5.03:1 | AA texto/controles |
| #57817F / marfil | 3.91:1 | Borde de control; no texto normal |
| #923A28 / marfil | 6.63:1 | AA error |
| #FFD0C3 / panel oscuro | 9.42:1 | AAA error |

Señales de error: icono + «No se guardó» + recuperación; selección: marca + etiqueta; offline: icono + texto. Ninguna información depende solo del color. Superposición, estados hover/pressed y componentes nuevos deben recalcularse; no heredar aprobación del color base. En colores forzados respetar colores del sistema y bordes reales.

## Tipografía, rejilla y respuesta

- Fuente del sistema (`system-ui`, sans-serif), sin descarga remota. Cuerpo 18px/1.5; secundario mínimo 16px/1.5; título 28px/1.25 y subtítulo 22px/1.35; pesos 400/600/700. Unidades rem y tamaño del usuario preservado, no texto en imágenes.
- Escala de espaciado 4, 8, 12, 16, 24, 32 y 48 CSS px. Márgenes móvil 16–24px, ancho de lectura máximo 42rem. En escritorio crisis conserva una columna y contacto al final del contenido/panel lateral sin alterar orden DOM.
- Botones y controles: objetivo mínimo 48×48 CSS px y separación mínima 8px; botón primario de crisis 56px de alto. Altura es mínima: texto ampliado aumenta el control. No truncar nombres, números o instrucciones.
- Reflow a 320 CSS px sin desplazamiento horizontal; texto 200%, zoom 400%, orientación horizontal y teclado virtual no ocultan contenido ni acciones. Incluir safe-area de iOS y padding inferior equivalente a la barra fija. No bloquear orientación ni zoom con viewport.
- Temas claro/oscuro por sistema con elección manual persistida sin datos personales. Validar ambos y modo de alto contraste. Evitar blanco deslumbrante y superficies totalmente negras como únicos recursos para transmitir calma.

## Componentes y contrato de estados

| Componente | Anatomía y conducta | Estados exigidos |
|---|---|---|
| Botón | Verbo + objeto, icono opcional con nombre oculto si decorativo; una acción primaria por bloque | Normal, hover, pressed, foco, ocupado con texto, no disponible con motivo |
| Tarjeta de habilidad | Nombre, objetivo de una línea, acción «Abrir» | Pública, seleccionada, personalizada bloqueada |
| Paso guiado | Título, 1–3 frases, «Siguiente», «Anterior», «Cambiar habilidad» | Primero, intermedio, último, pausa opcional |
| Contacto | Nombre, rol, teléfono visible; acciones llamar/preparar mensaje separadas | Preferido, alternativo, dato inválido, bloqueado |
| Campo | Etiqueta persistente, ayuda y error vinculados; ejemplo fuera del valor | Vacío, modificado, válido, inválido, guardando, guardado, fallo |
| Aviso | Texto breve y acción pertinente; nunca solo toast | Offline, bloqueo próximo, error local, catálogo pendiente |
| Diálogo | Encabezado, consecuencia, cancelar y confirmar explícitos | Descartar, borrar, sustituir respaldo; cierre por Escape salvo operación atómica |
| Intensidad | Opcional, escala 0–10 con etiquetas «0: sin intensidad percibida / 10: máxima intensidad que percibo» y «Prefiero omitir» | Sin respuesta distinguible de cero; teclado y lector accesibles |

Temporizadores opcionales muestran tiempo como texto; no emiten voz en cada segundo, no condicionan avance y no hacen sonido/vibración por defecto. Registro de resultados es opcional al terminar; cerrar no pierde acceso a guía.

## Interacción accesible

Semántica HTML nativa; landmarks, salto al contenido, `lang=es-CO`, encabezados jerárquicos y nombres accesibles coincidentes con etiqueta visible. Tabulación sigue lectura; foco visible con anillo mínimo de 3px, separación de 2px y contraste ≥3:1 frente a superficie adyacente. Para botón petróleo sobre marfil, anillo petróleo separado por marfil; no dibujar anillo indistinguible sobre el botón. Barra fija nunca tapa foco.

Pantalla nueva mueve foco a título con anuncio de nombre; actualización de guardado usa región `status` discreta y error usa aviso anunciado una vez. No anunciar cada pulsación. Diálogos contienen foco, tienen nombre y devuelven foco al cerrar. Campos erróneos enlazan mensaje con `aria-describedby`; al enviar formulario inválido se enfoca resumen enlazado. Sin gestos exclusivos: deslizar/arrastrar siempre tiene botones equivalentes. Teclado completo, dictado y lector de pantalla admitidos.

Movimiento opcional 120–180ms de opacidad; `prefers-reduced-motion` elimina transiciones y desplazamiento suave. Sin parpadeo, fondos animados, autoavance ni confeti. Sonidos y vibración fuera del MVP.

## Voz y microcopy

| Situación | Texto propuesto |
|---|---|
| Entrada crisis | «Necesito apoyo ahora» |
| Primera instrucción | «Haz una pausa. Puedes seguir un paso a la vez.» |
| Plan vacío | «Puedes empezar sin tener un plan.» |
| Bloqueado | «Tu plan está bloqueado. Puedes seguir con estos pasos.» |
| Guardado confirmado | «Guardado en este dispositivo.» |
| Fallo | «No se guardó. Mantén esta pantalla abierta y vuelve a intentarlo.» |
| Offline | «Sin conexión. Puedes seguir usando lo guardado.» |
| Emergencias sin catálogo | «Aún no hay una línea verificada para esta región. Si hay peligro inmediato, busca ayuda presencial en un servicio de urgencias o pide a alguien cercano que te acompañe.» |
| Pérdida de frase | «No podemos recuperar tu frase. Puedes seguir usando las guías públicas o restaurar una copia si recuerdas su frase.» |

Evitar «Cálmate», «todo estará bien», «estás a salvo», diagnósticos, culpa por no completar, resultados garantizados o afirmar que alguien recibió un mensaje. El nombre de habilidad «Cálmate con los cinco sentidos» se preserva como término de catálogo, sin usarlo como orden a la persona. Contenido clínico final: [marco clínico](03-dbt-clinical-framework.md).
