# Design: blog-publishing

## Context

- Astro 5.18 estático, bilingüe, Vercel despliega `main`. Colección `blog` con loader `glob` sobre
  `src/content/blog/**/[^_]*.md`; `entry.id` = ruta relativa sin extensión, y las rutas `[slug]` no
  son rest params → **un post en subcarpeta rompe el build**. Sin `description` el build falla.
- KA: workspace global en novo, API sin auth. `PUT /files/content` no crea `WorkspaceWriteOp`
  (no aparece en `/writes` ni `/files/history`). `GET /revisions/{content_hash}/content` devuelve
  contenido inmutable; `/v1/audit-events` es el feed con cursor; el SSE no tiene resume.
- Evaluación adversarial de alternativas (Hub `e/qk7jht`): puente = sync determinista + PR.

## Decisions

1. **URLs planas y estables.** `/blog/<slug>/` y `/en/blog/<slug>/` no cambian. La serie no va en la
   URL. Hubs en `/blog/serie/<serie>/`, temas en `/blog/tema/<tag>/` (EN: `/en/blog/series/`,
   `/en/blog/topic/`), registrados en `src/i18n/routes.ts`.
2. **Loader `glob` con patrón plano** `*.{md,mdx}` (sin `**`), y una comprobación en build que falla
   con mensaje claro si aparece una subcarpeta con contenido. Imágenes de un post en
   `src/content/blog/<slug>/` (carpeta hermana permitida, sin `.md` dentro).
3. **`draft`** se filtra en producción (`import.meta.env.PROD`) y se construye en preview.
4. **Fecha de actualización** = `updated ?? date`; alimenta `lastmod`, `article:modified_time`,
   `dateModified` y el bloque "Última actualización".
5. **Bloques obligatorios como componentes del layout, no como texto del autor**: `SeriesNav`
   (anterior o guía base), `NextStep` (un enlace, viene de `nextStep` en frontmatter o del siguiente
   de la serie), `LimitsBox` (`prerequisites`, `limits`, `updated`), `Breadcrumbs`.
6. **OG por post** generado en build con `sharp` (mismo estilo que `scripts/generate-og.mjs`) vía
   endpoint estático `src/pages/og/[slug].png.ts`; sin servicios externos.
7. **RSS** con `content` renderizado (`@astrojs/rss` + `sanitize-html`/`markdown-it` ya recomendados
   por Astro) y `<link rel="alternate" type="application/rss+xml">` por idioma en `Head`.
8. **Sitemap**: `lastmod` solo donde es veraz. Posts: `updated ?? date`; índices del blog: máximo de sus
   posts; páginas estáticas: sin `lastmod` (la hora del build cambiaría en cada deploy y Google descuenta
   los `lastmod` poco fiables). Lo implementa `integrations/blog-sitemap.mjs`, que lee el frontmatter
   con `gray-matter` en `astro:config:setup`.
9. **`bip-blog-sync` vive en este repo** (`tools/bip-blog-sync/`, Python 3.12 stdlib + PyYAML), con
   su unidad systemd de usuario y timer; así un cambio de schema y su mapeo van en el mismo PR. Valida
   **construyendo** (`astro check && astro build` en un checkout limpio) en vez de duplicar el zod.
10. **Configuración en runtime** del sync: `building-in-public/00-sistema/publicacion-blog.config.yml`
    en el workspace, leída en cada ciclo, validada con esquema estricto; si no parsea se conserva el
    último valor válido y se escribe el error en `06-feedback/_sync.md`. Sin secretos ahí. Credencial
    de GitHub: token fine-grained limitado al repo, en `~/.config/bip-blog-sync/token` de `jnm`
    (modo 600), o GitHub App si el owner lo elige.
11. **Estado de vuelta**: NET (`bip_url`, `bip_pr_url`, `bip_published_at`, si el owner los añade) y
    fichero hermano `05-publicaciones/blog/<slug>.publicacion.md` escrito por PUT con
    `expected_sha256`. Nunca se toca el post fuente.
12. **Seguridad de `main`**: ruleset en GitHub (PR + check `CI` obligatorio) y el sync rechaza
    cualquier rama destino que no case `^content/[a-z0-9-]+$`.

## Risks

- El owner puede elegir una maqueta distinta de la recomendada: `blog-navigation` describe
  comportamiento, no layout; el layout se implementa después de su elección.
- `astro-expressive-code` añade dependencias; se fija versión y se mide el tamaño del build.
- El sync corre en novo: si novo cae, no se publica (pero nada se pierde: el workspace y el PR son
  reanudables).

## Migration

Ninguna: la colección está vacía en producción. El primer contenido real entra por el propio sync
en un PR de prueba (preview), no directo a `main`.
