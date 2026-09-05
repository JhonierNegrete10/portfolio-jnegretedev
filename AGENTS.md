# AGENTS.md

This file describes **common mistakes** and **confusion points** that agents might
encounter as they work in this project.

## Plataforma (transversal — leer si aplica)
Este repo forma parte de una fábrica multi-proyecto. Si tu tarea toca email, dominios/DNS, n8n, Sentry, Vercel, deploy de backend o variables de entorno, lee ANTES: /srv/agents/control-plane/coolify_homelab/PLATFORM.md
Recursos que este repo consume:
- Hosting en Vercel → dominio `jnegrete.dev` (gestionado en Cloudflare, PLATFORM.md §2). **Cloudflare está en modo proxy** delante del dominio: `robots.txt` lo sobreescribe Cloudflare (bloquea bots de IA) y *Email Obfuscation* genera los 404 `/cdn-cgi/l/email-protection` que reporta Search Console. Son toggles del owner, no código.
- Vercel Web Analytics y Speed Insights: habilitados y con datos. **El conector MCP de Vercel dice "Web Analytics not found"; es falso** — usa la API REST `v1/query/web-analytics/visits/count`.
- Sentry: no instrumentado a propósito (sitio estático; ver `docs/observability/sentry-evaluation.md`).
- Sin email/backend propio: sitio estático Astro 5 bilingüe.

## Quick index

### Blog (change `blog-publishing`, ver `openspec/changes/blog-publishing/`)
- **Un post con frontmatter inválido tumba el build entero**, no solo ese post (`description` 80–160, `tags` 1–6 en minúsculas, `series` ⇔ `seriesOrder`, `updated >= date`). Valida antes de subir contenido: `npm run build`.
- **Ficheros planos y slug único entre idiomas.** `src/content/blog/sub/x.md` rompe el build (regla flat-content) y `x.md` + `x.mdx` con distinto `lang` fallan con la regla unique-slug — antes el loader descartaba uno **en silencio**. Las imágenes de un post van en `src/content/blog/<slug>/`.
- **Drafts:** `draft: true` no se construye en producción. Para previsualizarlos, `BLOG_INCLUDE_DRAFTS=1 npm run build` como **variable del proceso**, nunca en un `.env`: `astro build` carga `.env` en `process.env` y publicaría el draft; el verificador (`npm run verify:blog`) lo detecta y falla.
- **El artefacto se inspecciona, no solo compila:** `npm run verify:blog` recorre `dist/` (canonical, `BlogPosting` + `BreadcrumbList`, `og:image` existente, hreflang recíproco, `lastmod` solo en URLs del blog, RSS con contenido real). CI lo corre dos veces: build de producción y build con drafts.
- **`lastmod` solo donde es veraz:** posts (`updated ?? date`) e índices del blog; las páginas estáticas no llevan `lastmod` a propósito (la hora del build cambiaría en cada deploy).
- **JSON-LD de serie:** `isPartOf` y la miga de serie se emiten solo con `seriesHubPagesPublished = true` en `src/data/series.ts`; se activa cuando existan las páginas `/blog/serie/<id>/` (tarea 2.1). Una serie usada en un post debe estar declarada ahí.
- **RSS:** el contenido completo se renderiza con el Container API; los bloques de `astro-expressive-code` se convierten a `<pre><code>` con texto plano y marcas `+ `/`- `; los enlaces relativos se resuelven contra la URL del post.
- **Acceso a posts:** siempre por `src/lib/blog.ts` (`getPublishedPosts`, `getSeriesPosts`, `getTranslation`), nunca `getCollection('blog')` directo — es donde vive el filtro de drafts.
- **Publicar desde Kernel Agents:** el post aprobado llega por un PR de la rama `content/<slug>` que abre `bip-blog-sync` (tarea 3.x); la aprobación es el merge. No se escribe en `main` directamente.

### Estilo y herramientas
- **`.prettierrc` (singleQuote, printWidth 120) refleja el estilo real del repo.** El hook global de pre-commit pasa Prettier con el binario de `node_modules`; sin esa config reformateó 13 ficheros con comillas dobles y 80 columnas. No lo borres.
- Rutas por idioma solo vía `src/i18n/routes.ts` (`blogPostPath`, `blogSeriesPath`, `blogTopicPath`, `rssPath`); nunca concatenar `/en` a un slug ES.
