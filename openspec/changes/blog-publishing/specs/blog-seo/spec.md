# blog-seo

## ADDED Requirements

### Requirement: Metadatos de artículo
Cada post SHALL emitir JSON-LD `BlogPosting` (`headline`, `description`, `datePublished`, `dateModified`, `inLanguage`, `author` → `#person`, `image`, `mainEntityOfPage`, `keywords`, `isPartOf` si hay serie) y `BreadcrumbList`; `og:type=article`, `article:published_time`, `article:modified_time`, `article:tag`; canonical desde `canonical` si existe, si no la URL propia.

#### Scenario: Post con canonical externa
- **WHEN** un post declara `canonical: https://otro.sitio/x`
- **THEN** `<link rel="canonical">` apunta allí y `mainEntityOfPage` también

### Requirement: Imagen OG por post
Cada post SHALL tener `og:image` propia (1200×630) generada en build en `/og/<slug>.png` con el estilo del sitio, salvo que declare `cover`, en cuyo caso se usa la portada.

#### Scenario: Post sin portada
- **WHEN** el post no declara `cover`
- **THEN** existe `dist/og/<slug>.png` y el HTML lo referencia

### Requirement: Sitemap, RSS y descubrimiento
El sitemap SHALL incluir `lastmod` por URL (`updated ?? date` en posts; fecha del build en páginas estáticas), los feeds SHALL incluir el contenido completo (`content:encoded`) y `<head>` SHALL anunciar el feed del idioma con `rel="alternate" type="application/rss+xml"`. Las páginas de tema con un solo post SHALL llevar `noindex`.

#### Scenario: lastmod
- **WHEN** un post tiene `updated: 2026-09-20`
- **THEN** su `<url>` en `sitemap-0.xml` tiene `<lastmod>2026-09-20`

### Requirement: Verificación del artefacto en CI
CI SHALL ejecutar, tras el build, `scripts/verify-blog-artifact.mjs`, que falla si algún post construido carece de canonical, `BlogPosting`, hreflang recíproco cuando hay traducción, `og:image` existente, o alguno de los cuatro bloques obligatorios; y si el sitemap tiene URLs sin `lastmod`.

#### Scenario: Post sin siguiente paso
- **WHEN** el HTML de un post no contiene el enlace de siguiente paso
- **THEN** CI falla nombrando la URL y el bloque ausente
