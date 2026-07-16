# jnegrete.dev — Portfolio

Portfolio bilingüe (ES/EN) de Jhonier Negrete. **Astro 5** estático, desplegado en **Vercel** en [jnegrete.dev](https://jnegrete.dev).

## Editar contenido (sin tocar componentes)

Todo el contenido vive en archivos de datos tipados. Edita, commitea y push a `main` — Vercel despliega solo.

| Qué quieres cambiar | Archivo |
|---|---|
| Nombre, tagline, **disponibilidad**, email, links, bio, foto | `src/data/profile.ts` |
| Proyectos (título, descripción, stack, links, año) | `src/data/projects.ts` |
| Experiencia / timeline / educación / capability stack | `src/data/experience.ts` |
| Servicios (oferta freelance) | `src/data/services.ts` |
| Skills del marquee de la home | `src/data/skills.ts` |
| Textos de interfaz (botones, labels, títulos de página) | `src/i18n/ui.ts` |
| Rutas/slugs por idioma | `src/i18n/routes.ts` |
| CV descargable | reemplaza `public/cv.pdf` |

Cada texto visible tiene campos `es` y `en` juntos — edita ambos en el mismo objeto.

### Publicar un post del blog

Crea `src/content/blog/mi-post.md` (uno por idioma):

```markdown
---
title: "Título del post"
date: 2026-08-01
lang: es            # es | en
tags: ["Agents", "Evals"]
description: "Resumen corto que aparece en el listado."
translationKey: mi-post   # opcional: enlaza la versión ES y EN
---

Contenido en Markdown…
```

El listado, la página del post (`/blog/mi-post/`) y el feed RSS se generan solos. Sin posts, el blog muestra "próximamente".

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
