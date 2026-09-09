# blog-navigation

## ADDED Requirements

### Requirement: Hubs de serie y páginas de tema
El sitio SHALL generar `/blog/serie/<serie>/` (EN `/en/blog/series/<serie>/`) listando las piezas en orden de `seriesOrder`, y `/blog/tema/<tag>/` (EN `/en/blog/topic/<tag>/`) por cada tag usado. Las rutas SHALL registrarse en `src/i18n/routes.ts`. Una serie SHALL tener título y descripción en `src/data/series.ts` (ES/EN); una pieza con `series` no declarada MUST fallar el build.

#### Scenario: Hub de serie
- **WHEN** hay tres posts con `series: kernel-agents`
- **THEN** `/blog/serie/kernel-agents/` los lista en orden 1, 2, 3 con su estado (publicado) y enlaza a la guía base si existe

### Requirement: Bloques obligatorios del tutorial
Toda página de post SHALL renderizar: (1) enlace a la pieza anterior de la serie o a la guía base; (2) exactamente un enlace "Siguiente paso práctico" (de `nextStep` o del siguiente de la serie; si no hay ninguno, al hub de la serie); (3) bloque "Límites y prerequisitos" con `prerequisites`, `limits` y "Última actualización: <updated ?? date>"; (4) migas Blog › Serie › Título con la URL canónica.

#### Scenario: Última pieza de la serie
- **WHEN** el post es el último de su serie y no declara `nextStep`
- **THEN** el único enlace de siguiente paso apunta al hub de la serie

### Requirement: Índice del artículo y lectura
La página de post SHALL mostrar un índice generado de los `h2`/`h3` y el tiempo de lectura; el índice del blog SHALL paginar de 10 en 10 y mostrar tiempo de lectura y serie por fila.

#### Scenario: Post con cinco secciones
- **WHEN** el cuerpo tiene cinco `h2`
- **THEN** el índice tiene cinco entradas con anclas que existen en el DOM

### Requirement: Layout elegido por el owner
El layout de índice y post SHALL corresponder a la maqueta elegida por el owner (Hub `e/4zqdrg`, A/B/C) y verificarse con una captura con un post real a 1440 y 390 px sin scroll horizontal.

#### Scenario: Móvil
- **WHEN** se renderiza un post con bloques de código largos a 390 px
- **THEN** `document.documentElement.scrollWidth` es 390 y el código se desplaza dentro de su bloque
