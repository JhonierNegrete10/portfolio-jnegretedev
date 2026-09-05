# Tasks: blog-publishing

## 0. Base y seguridad
- [ ] 0.1 Ruleset en `main`: PR obligatorio + check `CI` requerido (gh api). Verificar con `gh api repos/.../rules/branches/main`
- [ ] 0.2 Confirmar en Vercel que los PRs generan preview (ya observado en PR #1–#3)

## 1. PR (a): modelo de contenido + SEO (no depende de la maqueta)
- [x] 1.1 Schema ampliado en `src/content.config.ts` (campos, rangos, `series`⇔`seriesOrder`), loader plano `*.{md,mdx}`, guardia de subcarpetas con mensaje claro
- [x] 1.2 `@astrojs/mdx` + `astro-expressive-code` (tema acorde a tokens, números de línea, diff, título); componentes `Callout`, `Steps`
- [x] 1.3 `src/data/series.ts` (ES/EN) y validación de serie declarada
- [x] 1.4 `Head.astro`: variante artículo (`og:type`, `article:*`, canonical override, RSS autodiscovery); `StructuredData.astro`: `BlogPosting` + `BreadcrumbList`
- [x] 1.5 OG por post: `src/pages/og/[slug].png.ts` con `sharp`, estilo de `scripts/generate-og.mjs`
- [x] 1.6 Integración `integrations/blog-sitemap.mjs` para `lastmod`; RSS con `content:encoded` en ambos idiomas
- [x] 1.7 Filtro `draft` en producción en todas las consultas (`src/lib/blog.ts` como única función de acceso)
- [x] 1.8 `scripts/verify-blog-artifact.mjs` + paso en `.github/workflows/ci.yml`
- [x] 1.9 Post de prueba `_ejemplo-kernel-agents.mdx` (prefijo `_`, no publicado) para ejercitar todo en preview; build + verify en verde; inspección del artefacto (HTML, sitemap, RSS, OG)

## 2. PR (b): pantallas según maqueta elegida
- [ ] 2.1 Rutas en `routes.ts` (serie/tema ES-EN) y páginas hub/tema con `noindex` cuando 1 post
- [ ] 2.2 Página de post: `Breadcrumbs`, `SeriesNav`, `NextStep`, `LimitsBox`, índice, lectura, según maqueta
- [ ] 2.3 Índice del blog: paginación, serie por fila, filtros/chips según maqueta; EN en paridad
- [ ] 2.4 Capturas con post real a 1440/390 (sin scroll horizontal) → revisión de legibilidad; "después" al Hub

## 3. PR (c): `tools/bip-blog-sync/`
- [ ] 3.1 Cliente KA (audit-events con cursor, revisions, download, PUT con `expected_sha256`), timeouts explícitos
- [ ] 3.2 Mapeo de frontmatter + validación de slug/idioma/colisiones; copia de binarios y reescritura de rutas
- [ ] 3.3 Checkout limpio + `astro check && astro build`; feedback a `06-feedback/<slug>.md` si falla
- [ ] 3.4 Rama `content/<slug>`, PR create/update con `gh`, `--force-with-lease`, denylist de destino
- [ ] 3.5 Detección de merge + verificación en producción + fichero hermano `.publicacion.md` (+ NET si habilitado)
- [ ] 3.6 Config runtime desde el workspace con esquema estricto; unidad systemd de usuario + timer; journal
- [ ] 3.7 Arnés de idempotencia: correr dos veces el mismo evento no duplica PR ni commits; interrumpir a mitad y reanudar
- [ ] 3.8 Prueba de extremo a extremo con un post real de la serie en preview (nunca `main`); documentación en `docs/blog-publishing.md` y en `building-in-public/00-sistema/`

## 4. Ship
- [ ] 4.1 Merge del owner; verificación en producción del artefacto (sitemap `lastmod`, JSON-LD, OG, RSS, hreflang)
- [ ] 4.2 Primer PR de contenido real esperando merge; `AGENTS.md` del repo con los gotchas (subcarpetas, description, PUT sin historial)
