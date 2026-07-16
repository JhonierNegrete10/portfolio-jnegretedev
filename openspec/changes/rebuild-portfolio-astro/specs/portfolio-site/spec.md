# portfolio-site

## ADDED Requirements

### Requirement: Sitio estático Astro 5.x con las seis secciones
El sitio SHALL construirse con Astro fijado a la línea 5.x (`astro@^5`, lockfile comprometido, sin adaptador) generando salida estática, con las secciones Home (Index), Proyectos, Servicios, Sobre mí, Blog y Contacto, replicando el diseño visual de referencia (fondo `#141416`, acento `#ff5c35`, bordes `#2e2e30`, tipografías IBM Plex Mono y Archivo self-hosted, layout de grid técnico, marquee de skills y globo canvas animado).

#### Scenario: Versión correcta
- **WHEN** se ejecuta `npx astro --version` en el proyecto
- **THEN** reporta una versión 5.x

#### Scenario: Build estático exitoso
- **WHEN** se ejecuta `astro check && astro build`
- **THEN** ambos terminan sin errores y generan HTML estático para todas las secciones en ambos idiomas

#### Scenario: Navegación completa
- **WHEN** un visitante abre cualquier sección desde la barra de navegación
- **THEN** la sección carga con el diseño de referencia y la navegación marca la sección activa en `#ff5c35`

### Requirement: Sitio bilingüe con rutas i18n y slugs localizados
El sitio SHALL servir español como idioma por defecto sin prefijo (`/`, `/proyectos/`, `/servicios/`, `/sobre-mi/`, `/blog/`, `/contacto/`) e inglés bajo `/en/` con slugs traducidos (`/en/projects/`, `/en/services/`, `/en/about/`, `/en/blog/`, `/en/contact/`), con páginas físicas por idioma y un toggle que enlaza a la ruta equivalente usando un mapping de slugs (no concatenación de prefijo).

#### Scenario: Toggle de idioma con slug traducido
- **WHEN** un visitante en `/proyectos/` pulsa el toggle de idioma
- **THEN** navega a `/en/projects/` con el contenido traducido

#### Scenario: Idioma por defecto
- **WHEN** un visitante abre `https://jnegrete.dev/`
- **THEN** ve el sitio en español y `<html lang="es">`

#### Scenario: Post sin traducción
- **WHEN** el visitante está en un post que no tiene traducción y pulsa el toggle
- **THEN** navega al índice del blog del otro idioma (nunca a un 404)

### Requirement: Contenido real trazable al CV
El sitio SHALL mostrar únicamente información real derivada del CV "AI Transformation Lead" y del GitHub público del usuario, con trazabilidad documentada en `docs/content-sources.md` (matriz dato → sección → fuente), y MUST NOT incluir métricas, proyectos o textos del placeholder original.

#### Scenario: Timeline real
- **WHEN** un visitante abre "Sobre mí"
- **THEN** la trayectoria muestra los roles y fechas reales del CV (AI Engineer — GBM Colombia may 2024–presente; INTECOL 2022–2024; MEMBO 2022; educación EIA/DATAPATH)

#### Scenario: Gate anti-placeholder
- **WHEN** se ejecuta la búsqueda de QA sobre `dist/` con las frases y métricas del export original (p. ej. "92%", "1.2k", "300+", "−75%", títulos de posts ficticios)
- **THEN** no hay ninguna coincidencia

#### Scenario: Retrato sin placeholder
- **WHEN** un visitante abre "Sobre mí"
- **THEN** ve una composición gráfica coherente con el diseño (no el texto "[ retrato — foto aquí ]")

### Requirement: CV descargable
El sitio SHALL servir el CV actualizado como PDF en `/cv.pdf` (copiado al repo desde el original) y los botones "CV.PDF" SHALL enlazar a ese archivo.

#### Scenario: Descarga del CV
- **WHEN** un visitante pulsa "CV.PDF"
- **THEN** el navegador abre/descarga el PDF del CV "AI Transformation Lead"

### Requirement: SEO bilingüe completo
Cada página SHALL incluir title y meta description por idioma, canonical absoluto, alternates `hreflang` ES/EN más `x-default`, Open Graph con `og:locale` e imagen OG real 1200×630, favicon y `apple-touch-icon`. El sitio SHALL usar `trailingSlash: 'always'` con enlaces internos consistentes, generar sitemap con alternates i18n y servir `robots.txt` que lo referencie.

#### Scenario: Metadatos por idioma
- **WHEN** se inspecciona el HTML de una página en inglés
- **THEN** `<html lang="en">`, title/description en inglés, canonical propio, `hreflang` a la versión ES y `x-default`, y OG image absoluta

#### Scenario: Sitemap con alternates
- **WHEN** se inspecciona el contenido del sitemap generado
- **THEN** incluye las URLs de ambos idiomas con sus alternates `hreflang`

#### Scenario: URL no canónica
- **WHEN** se solicita una ruta sin trailing slash (p. ej. `/proyectos`)
- **THEN** responde 301/308 hacia la variante con slash, sin servir contenido duplicado

### Requirement: Página 404
El sitio SHALL incluir `src/pages/404.astro` con el diseño del sitio, `noindex` y enlaces de recuperación a las homes ES/EN.

#### Scenario: Ruta inexistente
- **WHEN** un visitante abre una URL que no existe en producción
- **THEN** recibe la página 404 del sitio (no la genérica de Vercel) con enlaces para volver

### Requirement: Animaciones accesibles
El globo canvas y las animaciones SHALL respetar `prefers-reduced-motion` (versión estática), pausar `requestAnimationFrame` cuando no son visibles y exponer alternativa accesible (`role="img"` con label).

#### Scenario: Reduced motion
- **WHEN** el visitante tiene `prefers-reduced-motion: reduce`
- **THEN** el globo se renderiza estático y el marquee no anima

### Requirement: Fidelidad visual verificada
La migración SHALL validarse con una matriz de aceptación visual: screenshots por sección e idioma en 1440×900 y 390×844 comparados contra el HTML de referencia, y checklist de tokens (colores, tipografías, bordes, animaciones).

#### Scenario: QA visual
- **WHEN** se completa la implementación
- **THEN** existe la matriz de screenshots y el checklist de tokens firmado en el change antes del deploy final
