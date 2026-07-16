# Tasks: rebuild-portfolio-astro

## 1. Prerrequisitos de contenido y scaffold

- [x] 1.1 Copiar el CV original (`D:\Documentos\cvs\Jhonier Negrete - AI Transformation Lead.pdf`) al repo como `public/cv.pdf` (fuente de verdad presente en el repo)
- [x] 1.2 Mover `Portafolio 5a - Sitio.dc.html` a `reference/` como referencia de diseño; borrar `task-codex-spec-review.txt`
- [x] 1.3 `git init` + scaffold no destructivo de Astro **pineado a `astro@^5`** con TypeScript (`engines.node >= 20`, `package-lock.json` comprometido); verificar `npx astro --version` reporta 5.x
- [x] 1.4 Configurar `astro.config.mjs`: `site: 'https://jnegrete.dev'`, `trailingSlash: 'always'`, `build.format: 'directory'`, i18n (`locales: ['es','en']`, `defaultLocale: 'es'`, `prefixDefaultLocale: false`), integraciones `@astrojs/sitemap` (con config i18n/alternates) y `@astrojs/check`
- [x] 1.5 Fuentes self-hosted con @fontsource (IBM Plex Mono 400/500/600, Archivo 400/500/600/700) y tokens globales (colores #141416/#ff5c35/#2e2e30/#ececea, keyframes marquee/pulse/gridDrift/orbit/spinSlow)
- [x] 1.6 Crear `docs/content-sources.md`: matriz `dato publicado → página/sección → fuente exacta` (CV/GitHub/decisión usuario) — base para toda la capa de datos
- [x] 1.7 Primer commit

## 2. Capa de datos y i18n

- [x] 2.1 `src/i18n/ui.ts` (strings UI ES/EN) y `src/i18n/routes.ts` con la matriz de slugs (`/proyectos/↔/en/projects/`, `/servicios/↔/en/services/`, `/sobre-mi/↔/en/about/`, `/contacto/↔/en/contact/`, blog) y helper del toggle (post sin traducción → índice del blog del otro idioma)
- [x] 2.2 `src/data/profile.ts`: nombre, tagline (AI Transformation Lead | Enterprise AI Agents & Governance), ubicación, disponibilidad, **email `contacto@jnegrete.dev`**, links GitHub/LinkedIn, coordenadas Medellín
- [x] 2.3 `src/data/projects.ts` bilingüe con proyectos reales y datos verificables (stack, año, rol, links — sin KPIs inventados): orquestación de agentes/gobernanza LLM en GBM (términos del CV público), FiniaERP, NextEraTech, TTSFlow, visión artificial INTECOL (YOLO), ScrapyTube + Delta-Robot (OSS)
- [x] 2.4 `src/data/experience.ts` (timeline real: GBM may-2024–hoy, INTECOL nov-2022–mar-2024, MEMBO jul–oct-2022, Especialización IA EIA 2024, DATAPATH, Mecatrónica EIA) y `src/data/services.ts` (oferta freelance confirmada: diagnóstico IA, implementación agentes/RAG con evals, gobernanza LLM — redacción atractiva para captar clientes, cada capacidad respaldada por el CV, sin comprometer el empleo actual)
- [x] 2.5 Content collection `blog`: schema Zod (`title`, `date`, `lang`, `tags`, `description`, `translationKey?`); registrar cada dato en `docs/content-sources.md`

## 3. Componentes y páginas

- [x] 3.1 Layout base: topbar sticky con nav activa (mapping de rutas i18n), indicador disponibilidad, toggle de idioma por slug, menú móvil (<1060px), footer con `contacto@jnegrete.dev` y sociales
- [x] 3.2 Componente `<Head>` SEO: title/description por página e idioma, canonical absoluto, hreflang ES/EN + x-default, OG (`og:locale` es_CO/en_US, imagen 1200×630 en `public/og.png`), favicon + apple-touch-icon
- [ ] 3.3 Home (ES y EN): hero + globo canvas vanilla (prefers-reduced-motion → estático; pausar rAF fuera de vista; `role="img"` + label), marquee skills, tabla de proyectos, cards de servicios
- [ ] 3.4 Página Proyectos (ES/EN): grid de detalle con stack, año, rol y links verificables
- [ ] 3.5 Página Servicios (ES/EN): oferta freelance (diagnóstico → implementación con evals → gobernanza/operación) con CTA a contacto
- [ ] 3.6 Página Sobre mí (ES/EN): bio del professional summary del CV, composición gráfica en lugar del retrato (sin placeholder), datos base/idiomas/status, timeline, capability stack del CV
- [ ] 3.7 Blog (ES/EN): listado desde collection + estado vacío "próximamente"; **páginas de detalle** con `getStaticPaths()` por idioma, render Markdown, metadata individual y retorno; feeds RSS `/rss.xml` y `/en/rss.xml` con @astrojs/rss, botón RSS enlazando al feed del idioma
- [ ] 3.8 Página Contacto (ES/EN): `contacto@jnegrete.dev` como mailto visible, links LinkedIn/GitHub/CV
- [ ] 3.9 Página 404 con diseño del sitio, noindex y enlaces de recuperación; `robots.txt` referenciando el sitemap

## 4. QA local

- [ ] 4.1 `astro check` + `astro build` sin errores; enumerar rutas de `dist/` y verificar la matriz completa de URLs ES/EN + `/cv.pdf` + `404.html` + feeds + sitemap
- [ ] 4.2 Gate anti-placeholder: búsqueda en `dist/` de frases/métricas del export original ("92%", "1.2k", "300+", "−75%", títulos de posts ficticios, "[ retrato") — cero coincidencias
- [ ] 4.3 Verificar sitemap con alternates hreflang y canonicals correctos por página
- [ ] 4.4 QA responsive y accesibilidad: 1440×900 y 390×844, menú móvil, navegación por teclado, contraste, reduced-motion
- [ ] 4.5 Matriz de aceptación visual: screenshots por sección × idioma comparados contra `reference/` + checklist de tokens

## 5. Repositorio y deploy

- [ ] 5.1 Crear repo `JhonierNegrete10/portfolio-jnegretedev` (`gh repo create --source . --push`)
- [ ] 5.2 Crear proyecto Vercel conectado al repo GitHub (framework Astro, estático sin adaptador) y verificar deployment READY
- [ ] 5.3 Respaldar (export) la zona DNS de Cloudflare de jnegrete.dev y documentar diff previsto (preservados vs reemplazados: apex/`www`; revisar CAA)
- [ ] 5.4 Añadir `jnegrete.dev` y `www.jnegrete.dev` al proyecto Vercel y **leer los valores DNS exactos que Vercel indique** (`vercel domains inspect`/dashboard)
- [ ] 5.5 Aplicar exactamente esos registros en Cloudflare en modo DNS only (nube gris) y configurar redirect `www → apex` (308) en Vercel
- [ ] 5.6 Verificar: dominio válido en Vercel, TLS activo, `curl -sI` de ambos hosts (200 apex, 308 www), redirección de trailing slash
- [ ] 5.7 Push de prueba para confirmar deploy automático en `main`

## 6. Email Zoho Mail (guiado con el usuario)

- [ ] 6.1 Crear `docs/zoho-dns.md`: orden exacto (verificación TXT → buzón → MX → SPF → DKIM → DMARC), dónde leer cada valor en la Zoho Admin Console, cómo aplicarlo en Cloudflare y cómo validar
- [ ] 6.2 Con el usuario: leer de la Admin Console los valores reales (TXT verificación, hosts MX, include SPF, selector+valor DKIM — varían por data center; NO usar genéricos) y aplicarlos en Cloudflare; asegurar SPF único (inventariar emisores; `-all` si Zoho es el único)
- [ ] 6.3 Confirmar/crear el buzón `contacto@jnegrete.dev` en Zoho
- [ ] 6.4 Publicar DMARC `_dmarc` con `p=none; rua=mailto:contacto@jnegrete.dev` (endurecer después según reportes)
- [ ] 6.5 Test end-to-end: recibir correo externo y enviar a Gmail verificando SPF=pass, DKIM=pass, DMARC=pass en cabeceras

## 7. Cierre

- [ ] 7.1 Revisión visual final contra `reference/` (desktop/móvil, ambos idiomas) y revisión del usuario a los textos de Servicios antes del deploy final
- [ ] 7.2 README: cómo editar datos (`src/data/`), publicar un post, cambiar disponibilidad/email, preview local y flujo de deploy
- [ ] 7.3 Verificación final en producción: jnegrete.dev completo, gate anti-placeholder sobre producción, `openspec validate`
