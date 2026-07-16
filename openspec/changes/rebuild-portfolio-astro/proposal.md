# Proposal: rebuild-portfolio-astro

## Why

El portfolio actual es un único archivo HTML exportado desde un builder propietario (`x-dc`/`DCLogic`) que depende de un runtime `support.js` inexistente en el repo, no es desplegable tal cual, y contiene proyectos y trayectoria **ficticios de placeholder** (métricas inventadas, timeline que no coincide con el CV real). Se necesita un sitio real en producción en `jnegrete.dev` que refleje el perfil actual de Jhonier (AI Transformation Lead — CV 2026), sea fácil de editar sin tocar markup, y sirva como carta de presentación profesional con email de contacto propio del dominio (Zoho Mail).

**Decisión: re-escribir en Astro** (no mantener el HTML actual). Razones: el HTML actual no ejecuta sin su runtime propietario; Astro genera sitio estático con cero JS por defecto (rendimiento/SEO ideales para un portfolio), tiene soporte i18n nativo, content collections para datos editables, y despliegue de primera clase en Vercel. El diseño visual actual (dark, IBM Plex Mono/Archivo, acento #ff5c35, layout tipo grid técnico) **se conserva** — solo se migra la implementación.

## What Changes

- **BREAKING**: Se descarta el HTML del builder (`Portafolio 5a - Sitio.dc.html`) como implementación; queda solo como referencia de diseño.
- Nuevo proyecto Astro con TypeScript, **fijado a la línea 5.x** (`astro@^5`, lockfile y `engines.node` comprometidos): páginas Home, Proyectos, Servicios, Sobre mí, Blog y Contacto, bilingüe ES/EN con rutas i18n (`/` es, `/en/` inglés), replicando el diseño visual existente.
- Todo el contenido (perfil, proyectos, experiencia, servicios, posts, enlaces) vive en archivos de datos/colecciones editables (`src/content/` y `src/data/`), separado del markup — el usuario edita archivos TypeScript tipados y Markdown, no componentes.
- La sección Servicios se reescribe como oferta freelance real y compatible con el empleo actual (consultoría/implementación de IA: agentificación, RAG, evals, gobernanza LLM), orientada a captar clientes y dar exposición al perfil — decisión confirmada por el usuario.
- Contenido real basado en el CV "AI Transformation Lead" (GBM Colombia, INTECOL, MEMBO, FiniaERP, NextEraTech, TTSFlow, ScrapyTube, Delta Robot) y perfil de GitHub verificado.
- Repositorio GitHub nuevo (`JhonierNegrete10/portfolio-jnegretedev` o similar), git init + push.
- Proyecto Vercel conectado al repo con dominio `jnegrete.dev` asignado.
- Email de contacto del dominio vía Zoho Mail: registros DNS (verificación, MX, SPF, DKIM, DMARC) aplicados en la **zona DNS autoritativa de Cloudflare** con los valores exactos de la consola de Zoho, y `contacto@jnegrete.dev` (confirmado por el usuario) publicado en la sección de contacto del sitio.
- CV descargable (`/cv.pdf`) enlazado desde los botones "CV.PDF" existentes en el diseño.

## Capabilities

### New Capabilities
- `portfolio-site`: Sitio Astro estático bilingüe (ES/EN) con las 6 secciones, diseño técnico dark actual, SEO básico (meta, OG, sitemap) y CV descargable.
- `content-management`: Contenido editable en archivos de datos tipados (content collections / JSON) desacoplados del markup; blog en Markdown.
- `deployment-pipeline`: Repo GitHub conectado a Vercel con deploy automático en push a `main` y dominio `jnegrete.dev` en producción.
- `contact-email`: Email del dominio operativo vía Zoho Mail (registros MX/SPF/DKIM/DMARC en la zona Cloudflare) y publicado en el sitio (mailto, footer, contacto).

### Modified Capabilities
<!-- Ninguna: no existen specs previos en openspec/specs/ -->

## Impact

- Código: proyecto Astro nuevo en la raíz del directorio (package.json, astro.config.mjs, src/, public/); el HTML del builder se mueve a `reference/`.
- Dependencias: Node.js, Astro 5.x estático **sin adaptador** (Vercel soporta Astro estático nativamente), @astrojs/sitemap, @astrojs/rss; sin frameworks UI pesados.
- Sistemas externos: GitHub (repo nuevo), Vercel (proyecto + asignación de dominio + TLS + deploy), **Cloudflare (zona DNS autoritativa de jnegrete.dev)**, Zoho Mail (verificación de dominio y buzón `contacto@jnegrete.dev`).
- Requiere credenciales/acceso del usuario: GitHub CLI autenticado (verificado: JhonierNegrete10), cuenta Vercel (MCP disponible), consola de Zoho Mail y dashboard de Cloudflare (el usuario aplica/lee los valores DKIM/verificación y registros DNS, o provee API token).
