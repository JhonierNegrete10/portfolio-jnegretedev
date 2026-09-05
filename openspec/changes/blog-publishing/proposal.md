# Proposal: blog-publishing

## Why

El blog de jnegrete.dev existe pero es mínimo (colección con seis campos, listado y detalle) y el
owner va a empezar a publicar tutoriales técnicos (serie "Kernel Agents") que edita con un agente en
Kernel Agents (KA). Hoy no hay forma de que un post aprobado llegue al repo, no hay estructura de
navegación (series, tags, anterior/siguiente, índice), el SEO de artículo está ausente (sin
`BlogPosting`, `og:type=article`, `lastmod`, OG por post, RSS completo) y un frontmatter incompleto
tumba el build entero. `main` no tiene protección de rama.

Plan completo y decisiones del owner: Hub `e/qk7jht`; maquetas A/B/C: Hub `e/4zqdrg`.

## What Changes

- **Modelo de contenido**: schema ampliado (`updated`, `series`, `seriesOrder`, `draft`, `cover`,
  `canonical`, `prerequisites`, `limits`), ficheros planos, MDX, código con `astro-expressive-code`,
  imágenes por `astro:assets`.
- **Navegación**: hubs de serie (`/blog/serie/<serie>/`), páginas de tema (`/blog/tema/<tag>/`),
  anterior/siguiente dentro de la serie, índice del artículo, migas, paginación, bloques obligatorios
  (anterior o guía base, un único siguiente paso, límites/prerequisitos/última actualización). Layout
  según la maqueta que elija el owner.
- **SEO**: JSON-LD `BlogPosting` + `BreadcrumbList`, OG de artículo, imagen OG por post generada en
  build, `lastmod` en sitemap, RSS con contenido completo y autodescubrimiento, `noindex` en temas con
  un solo post, verificación del artefacto en CI.
- **Puente KA → repo (`bip-blog-sync`)**: proceso determinista en novo que lee revisiones por hash
  de la API de KA, valida construyendo, abre o actualiza un PR por slug; la aprobación es el merge.
  Estado de publicación a NET y a un fichero hermano en el workspace. Configuración en runtime desde
  un fichero del workspace.
- **Protección de `main`**: PR obligatorio + CI verde; denylist de `main` en el sync.

## Capabilities

### New Capabilities
- `blog-content-model`: schema, validación y convención de ficheros del blog.
- `blog-navigation`: series, temas, anterior/siguiente, índice, migas, paginación y bloques obligatorios.
- `blog-seo`: metadatos de artículo, OG por post, sitemap, RSS y verificación del artefacto.
- `ka-blog-sync`: contrato del puente desde el workspace de KA hasta un PR en GitHub.

### Modified Capabilities
- `portfolio-site` (de `rebuild-portfolio-astro`): el blog deja de ser "colección vacía + próximamente".

## Non-goals

- Publicar en LinkedIn/X/Medium (lo hace el BIP Publisher por navegador; fuera de este change).
- Buscador y artículos relacionados (cuando haya volumen).
- Umami u otra analítica adicional (decisión del owner, change aparte).
- Autenticación en KA (decisión permanente del owner: no habrá).
