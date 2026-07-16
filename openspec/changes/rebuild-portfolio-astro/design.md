# Design: rebuild-portfolio-astro

> Revisado por Codex (gpt-5.6-sol, reasoning high) el 2026-07-16; este documento incorpora los 16 hallazgos del review (3 BLOCKER, 9 MAJOR, 3 MINOR, 1 NIT).

## Context

El directorio contiene solo un export HTML de un builder propietario (`Portafolio 5a - Sitio.dc.html`, ~44 KB) con toda la UI inline y la lógica/i18n en un script `DCLogic` no ejecutable localmente (falta `support.js`). El diseño visual es bueno y se conserva: dark `#141416`, acento naranja `#ff5c35`, tipografías IBM Plex Mono + Archivo, layout de grid con bordes `#2e2e30`, marquee de skills, globo canvas animado, 6 secciones (Index, Proyectos, Servicios, Sobre mí, Blog, Contacto) y toggle ES/EN.

El contenido actual es placeholder ficticio. La fuente de verdad del contenido real es el CV 2026 "Jhonier Negrete - AI Transformation Lead" (`D:\Documentos\cvs\Jhonier Negrete - AI Transformation Lead.pdf` — **debe copiarse al repo como primer paso**, tanto a `public/cv.pdf` como fuente de verdad para el contenido) más el GitHub público verificado (ScrapyTube, Delta-Robot, tts-fastapi-app/TTSFlow, iot-weather-control, Kafka-fastapi). LinkedIn no es scrapeable (HTTP 999); el CV cubre esa información.

Datos del CV (extraídos y verificados en esta sesión): AI Engineer en GBM Colombia may-2024–presente (agentificación con LangChain/LangGraph, gobernanza Bifrost/LiteLLM, evals Langfuse/Phoenix); Junior Engineering Analyst INTECOL nov-2022–mar-2024 (YOLO video-surveillance, TOF 3D); Backend Engineer MEMBO jul–oct-2022 (OCR 10k+ PDFs, Elasticsearch); founder FiniaERP.com y NextEraTech.top (2026); Especialización en IA EIA 2024 (capstone TTSFlow); Bootcamp DATAPATH; Ing. Mecatrónica EIA 2017–2022; ES nativo / EN profesional.

Externos: dominio `jnegrete.dev` comprado en Vercel, pero **la zona DNS autoritativa está en Cloudflare** (nameservers de Cloudflare). Zoho Mail es únicamente el proveedor de correo. Vercel MCP disponible (team `jhoniernegrete-eiaeducos-projects`, sin proyecto de portfolio aún). GitHub CLI autenticado como `JhonierNegrete10`. Node v24.14.0 local.

Decisiones ya confirmadas por el usuario (2026-07-16): email publicado `contacto@jnegrete.dev`; Servicios se mantiene como **oferta freelance real** orientada a captar clientes compatible con su empleo; retrato = composición gráfica (no foto); RSS sí se implementa.

## Goals / Non-Goals

**Goals:**
- Sitio Astro 5.x estático, bilingüe, mismo diseño visual, contenido 100% real trazable al CV/GitHub, en producción en `https://jnegrete.dev`.
- Contenido editable desde archivos TS tipados + Markdown sin tocar componentes.
- Push a `main` → deploy automático en Vercel.
- `contacto@jnegrete.dev` operativo (Zoho) con SPF, DKIM y DMARC en pass, publicado en el sitio.
- Servicios como oferta freelance atractiva y honesta (consultoría/implementación de IA: agentificación, RAG, evals, gobernanza LLM).

**Non-Goals:**
- CMS con UI de administración; backend/formulario de contacto con servidor.
- Contenido inventado: ni posts, ni métricas, ni proyectos que no salgan del CV/GitHub.
- Analytics, comentarios, newsletter (futuro).

## Decisions

1. **Astro 5.x fijado, estático, sin adaptador.** `astro@^5` explícito en package.json (no `create astro@latest` a ciegas: hoy puede instalar una major posterior), `package-lock.json` comprometido, `engines.node >= 20`, verificación `npx astro --version` en tareas. Vercel sirve Astro estático sin adaptador; **no** se usa `@astrojs/vercel`. Integraciones: `@astrojs/sitemap` (con config i18n), `@astrojs/rss`, `@astrojs/check` para typecheck. El scaffold debe ser **no destructivo**: la raíz ya contiene `openspec/`, `reference/`, `.claude/` — scaffold en el sitio con `--template minimal` cuidando no sobreescribir.

2. **i18n por rutas estáticas con estructura de páginas explícita.** Config: `i18n: { locales: ['es','en'], defaultLocale: 'es', routing: { prefixDefaultLocale: false } }`. La config solo da la lógica de routing — las páginas EN se crean físicamente en `src/pages/en/`. Matriz de rutas definitiva:

   | ES (default, `/`) | EN (`/en/`) |
   |---|---|
   | `/` | `/en/` |
   | `/proyectos/` | `/en/projects/` |
   | `/servicios/` | `/en/services/` |
   | `/sobre-mi/` | `/en/about/` |
   | `/blog/` | `/en/blog/` |
   | `/contacto/` | `/en/contact/` |
   | `/blog/<slug>/` | `/en/blog/<slug>/` |

   Helper `src/i18n/routes.ts` con el mapping de slugs por página (no concatenación ingenua de `/en`); el toggle de idioma usa ese mapping. Si un post no tiene traducción, el toggle lleva al índice del blog del otro idioma (comportamiento definido, no roto). Strings de UI en `src/i18n/ui.ts`.

3. **Modelo de contenido.** `src/data/profile.ts` (nombre, tagline, ubicación, disponibilidad, `email: 'contacto@jnegrete.dev'`, links, coordenadas), `src/data/projects.ts`, `src/data/experience.ts`, `src/data/services.ts` — arrays TS tipados con campos `{es, en}` juntos por texto. **Excepción explícita: el blog** — un archivo Markdown por post y por idioma en `src/content/blog/`, frontmatter con `lang` y `translationKey` opcional para enlazar traducciones. Trazabilidad: `docs/content-sources.md` con la matriz `dato publicado → página/sección → fuente exacta (CV/GitHub/decisión del usuario)`; ningún claim sin fila en la matriz.

4. **Blog completo, no solo listado.** Content collection con schema Zod (`title`, `date`, `lang`, `tags`, `description`, `translationKey?`). Páginas de detalle vía ruta dinámica con `getStaticPaths()` por idioma (`src/pages/blog/[slug].astro` y `src/pages/en/blog/[slug].astro`), render del Markdown, metadata individual, link de retorno. Lista vacía → estado "próximamente". Feed RSS `/rss.xml` (ES) y `/en/rss.xml` (EN) con `@astrojs/rss`; el botón RSS del diseño enlaza al feed del idioma activo.

5. **Proyectos y servicios reales.** Proyectos: plataforma de orquestación de agentes / gobernanza LLM en GBM (términos del CV público, sin clientes ni cifras internas), FiniaERP, NextEraTech, TTSFlow, visión artificial INTECOL (YOLO), ScrapyTube + Delta-Robot como OSS. Tarjetas con datos verificables (stack, año, rol, enlaces a repos/sitios) — sin KPIs inventados. Servicios (oferta freelance confirmada): posicionamiento "llevo la agentificación enterprise que hago a diario a tu empresa" — diagnóstico de oportunidades IA, implementación de agentes/RAG con evals desde el día uno, gobernanza LLM; textos redactados para atraer clientes pero cada capacidad respaldada por el CV. CTA: email de contacto.

6. **SEO bilingüe completo.** Componente `<Head>` con: title/description por página e idioma, canonical absoluto por página, `hreflang` alternates ES/EN + `x-default` (apuntando a ES), OG tags con `og:locale` (`es_CO`/`en_US`), **OG image real 1200×630** generada con la identidad del sitio (estática en `public/og.png`), favicon + `apple-touch-icon`. Sitemap con `@astrojs/sitemap` configurando `i18n: { defaultLocale: 'es', locales: {...} }` para alternates; test del contenido del sitemap, no solo su existencia. `robots.txt` apuntando al sitemap. Política de URLs: `trailingSlash: 'always'` + `build.format: 'directory'`, enlaces internos siempre con slash final; verificar que la variante sin slash recibe 301 en Vercel sin URLs duplicadas.

7. **Páginas de sistema.** `src/pages/404.astro` con el diseño del sitio, bilingüe-neutral, `noindex`, enlaces de recuperación a Home ES/EN (Astro emite `404.html`, que Vercel sirve automáticamente en estático).

8. **Dominio: valores DNS reales, nunca hardcodeados.** Secuencia obligatoria: (1) crear proyecto Vercel conectado al repo; (2) añadir `jnegrete.dev` y `www.jnegrete.dev` al proyecto; (3) **leer los valores exactos que Vercel indique** (`vercel domains inspect` / dashboard) — no asumir `76.76.21.21` ni `cname.vercel-dns.com`; (4) aplicar exactamente esos registros en Cloudflare en modo **DNS only (nube gris)** para apex y `www` (A/AAAA/CNAME son los únicos tipos con proxy conmutable); (5) configurar la redirección `www → apex` (308) **en Vercel**, no con Redirect Rules de Cloudflare (requieren proxy naranja, incompatible con DNS-only); (6) verificar estado del dominio en Vercel, TLS y `curl -sI` de ambos hosts. Antes de tocar nada: export/respaldo completo de la zona Cloudflare, con diff aprobado que distinga registros preservados vs reemplazados deliberadamente (A/AAAA/CNAME conflictivos del apex y `www`), y revisión de CAA que pueda bloquear la emisión del certificado.

9. **Zoho Mail: valores de la Admin Console, no genéricos + DMARC.** Los hosts MX, el include de SPF y el selector DKIM **pueden variar por data center** — se copian exactamente de la Zoho Admin Console del usuario (el selector no es necesariamente `zmail`). Orden: verificación de dominio (TXT) → buzón `contacto@jnegrete.dev` → MX → SPF (un único registro SPF; inventariar emisores existentes antes de fusionar; si Zoho es el único emisor, usar `-all`) → DKIM → **DMARC** (`_dmarc` TXT, empezar `p=none; rua=mailto:contacto@jnegrete.dev`, endurecer a `quarantine/reject` tras revisar reportes). MX/TXT en Cloudflare son siempre no-proxy (no hay decisión de nube ahí). Validación final: enviar/recibir con Gmail y exigir `SPF=pass`, `DKIM=pass`, `DMARC=pass` en las cabeceras. Todo documentado en `docs/zoho-dns.md`; los cambios en Cloudflare/Zoho los ejecuta el usuario guiado (o vía API con token si lo provee).

10. **Assets y fidelidad visual.** CV → `public/cv.pdf`. Fuentes self-hosted con `@fontsource` (IBM Plex Mono 400/500/600, Archivo 400/500/600/700). Globo canvas portado como script vanilla en componente Astro con: `prefers-reduced-motion` respetado (estático si reduce), `IntersectionObserver`/`visibilitychange` para pausar `requestAnimationFrame` fuera de vista, y fallback accesible (`role="img"` + label). Retrato: composición gráfica coherente (patrón grid/orbital con las coordenadas de Medellín) — el placeholder `[ retrato — foto aquí ]` no puede publicarse; intercambiable por foto editando `profile.ts`. Criterio de aceptación visual: matriz de screenshots por sección × idioma en 1440×900 y 390×844 comparados contra `reference/`, checklist de tokens (colores, tipografías, bordes, animaciones marquee/pulse/gridDrift/orbit).

## Risks / Trade-offs

- [Cloudflare proxy (naranja) sobre apex/`www` rompe TLS/verificación de Vercel] → Registros del sitio en DNS only; validar con `curl -sI` tras propagación.
- [MX/SPF/DKIM genéricos rompen o dejan correo a medias] → Prohibido aplicar valores no leídos de la Admin Console de Zoho; SPF único; DMARC en `p=none` primero.
- [Registros existentes de la zona pisados por error] → Export previo de la zona + diff aprobado preservados/reemplazados; revisar CAA.
- [Contenido GBM confidencial] → Solo términos del CV público; sin clientes ni cifras internas.
- [Deriva visual en la migración] → Matriz de aceptación visual (viewports/screenshots/checklist) contra `reference/`.
- [Placeholder ficticio sobreviviendo] → Búsqueda automatizada de frases/métricas del export original (`92%`, `1.2k`, `300+`, `−75%`, "consultoría e implementación...placeholder", posts ficticios) como gate de QA.
- [`create astro` instala major posterior a 5] → Versión pineada + `npx astro --version` verificado en tareas.
- [Servicios freelance vs empleo en GBM] → Textos revisados por el usuario antes del deploy final; sin promesas de disponibilidad que comprometan su rol actual.

## Migration Plan

1. Copiar CV al repo, mover HTML del builder a `reference/`, scaffold Astro 5 pineado, git init, primer commit.
2. Matriz de fuentes de contenido + capa de datos i18n; luego layout/páginas; `astro check` + `astro build` + QA local.
3. `gh repo create JhonierNegrete10/portfolio-jnegretedev` + push `main`.
4. Proyecto Vercel conectado al repo → añadir dominios → leer valores DNS de Vercel → aplicarlos en Cloudflare (DNS only) → redirect `www→apex` en Vercel → verificar TLS/308.
5. Zoho: verificación → buzón → MX → SPF → DKIM → DMARC (valores exactos de la consola; guiado con el usuario) → test SPF/DKIM/DMARC pass.
6. Rollback: re-apuntar el dominio al deployment anterior desde Vercel; restaurar zona Cloudflare desde el export respaldado.

## Open Questions

- ¿El buzón `contacto@jnegrete.dev` ya existe en Zoho o hay que crearlo al verificar el dominio? → Se resuelve con el usuario en la fase 5 (no bloquea fases 1–4; el email ya está decidido y puede ir en `profile.ts` desde el inicio).
- Nombre del repo: default `portfolio-jnegretedev` (confirmar en el momento de crear si el usuario prefiere otro).
