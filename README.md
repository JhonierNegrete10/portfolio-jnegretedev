# jnegrete.dev — Portfolio

Portfolio bilingüe (ES/EN) de Jhonier Negrete. **Astro 5** estático, desplegado en **Vercel** en [jnegrete.dev](https://jnegrete.dev).

## Editar contenido (sin tocar componentes)

Todo el contenido vive en archivos de datos tipados. Edita, commitea y push a `main` — Vercel despliega solo.

| Qué quieres cambiar                                          | Archivo                   |
| ------------------------------------------------------------ | ------------------------- |
| Nombre, tagline, **disponibilidad**, email, links, bio, foto | `src/data/profile.ts`     |
| Proyectos (título, descripción, stack, links, año)           | `src/data/projects.ts`    |
| Experiencia / timeline / educación / capability stack        | `src/data/experience.ts`  |
| Servicios (oferta freelance)                                 | `src/data/services.ts`    |
| Skills del marquee de la home                                | `src/data/skills.ts`      |
| Textos de interfaz (botones, labels, títulos de página)      | `src/i18n/ui.ts`          |
| Rutas/slugs por idioma                                       | `src/i18n/routes.ts`      |
| CV descargable                                               | reemplaza `public/cv.pdf` |

Cada texto visible tiene campos `es` y `en` juntos — edita ambos en el mismo objeto.

### Publicar un post del blog

Crea `src/content/blog/mi-post.md` o `.mdx` directamente en esa carpeta (uno por idioma, sin subcarpetas para Markdown):

```markdown
---
title: 'Título del post'
description: 'Resumen descriptivo de entre 80 y 160 caracteres que aparecerá en listados, buscadores y tarjetas sociales.'
date: 2026-08-01
updated: 2026-08-04 # opcional
lang: es # es | en
tags: [agentes, evaluacion] # 1..6, minúsculas, sin duplicados
series: kernel-agents # opcional; debe existir en src/data/series.ts
seriesOrder: 1 # obligatorio cuando hay series
translationKey: mi-post # opcional: enlaza la versión ES y EN
draft: false
canonical: https://jnegrete.dev/blog/mi-post/ # opcional
prerequisites:
  - Un entorno de pruebas
limits:
  - No sustituye una auditoría formal
nextStep:
  label: 'Aplicar la guía'
  href: '/blog/'
# cover:                    # opcional; ruta relativa optimizada por Astro
#   src: ./mi-post/cover.png
#   alt: "Descripción no vacía de la portada"
---

Contenido en Markdown…
```

`title` no puede estar vacío y el slug del fichero debe usar minúsculas y guiones. Si usas `series`, declara también `seriesOrder`; los identificadores disponibles viven en `src/data/series.ts`. Las imágenes pueden vivir en `src/content/blog/mi-post/`, pero esa subcarpeta no puede contener `.md` ni `.mdx`.

El listado, la página del post (`/blog/mi-post/`), su imagen `/og/mi-post.png`, el sitemap y el feed RSS se generan solos. En producción los posts con `draft: true` quedan fuera de páginas, índices, sitemap, RSS y OG. Para probar deliberadamente borradores en un build local:

```bash
BLOG_INCLUDE_DRAFTS=1 npm run build
BLOG_INCLUDE_DRAFTS=1 npm run verify:blog
```

`BLOG_INCLUDE_DRAFTS` se lee exclusivamente del entorno del proceso que ejecuta cada comando. No lo configures en
`.env`: Astro no carga ese archivo para este flag de build.

Sin posts publicados, el blog muestra "próximamente".

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:4321
npx astro check    # typecheck
npm run build      # build de producción en dist/
```

## Deploy

Push a `main` → deploy automático en Vercel (proyecto `portfolio-jnegretedev`). El dominio `jnegrete.dev` (DNS en Cloudflare) y `www` (redirect 308 al apex) están asignados al proyecto.

- `docs/content-sources.md` — trazabilidad de cada dato publicado a su fuente (CV/GitHub).
- `docs/zoho-dns.md` — configuración del correo `contacto@jnegrete.dev` (Zoho + Cloudflare).
- `docs/dns-snapshot-2026-07-16.md` — estado DNS previo a los cambios.
- `reference/` — HTML original del builder, solo como referencia visual.
- `openspec/` — especificación del cambio (proposal, design, specs, tasks).
