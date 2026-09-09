# blog-content-model

## ADDED Requirements

### Requirement: Schema completo del post
La colección `blog` SHALL aceptar `.md` y `.mdx` con frontmatter: `title` (string), `description` (80–160 caracteres), `date`, `lang` (`es`|`en`), `tags` (1–6, minúsculas), y opcionales `updated`, `series`, `seriesOrder` (entero ≥1), `translationKey`, `draft` (default `false`), `cover` (imagen con `alt` obligatorio), `canonical` (URL), `prerequisites` (lista), `limits` (lista), `nextStep` (`{label, href}`). `series` sin `seriesOrder` o viceversa MUST fallar la validación.

#### Scenario: Post válido con serie
- **WHEN** existe `src/content/blog/permisos-y-herramientas.md` con `series: kernel-agents` y `seriesOrder: 1`
- **THEN** `astro check && astro build` pasan y la página `/blog/permisos-y-herramientas/` se genera

#### Scenario: Descripción fuera de rango
- **WHEN** un post tiene `description` de 30 caracteres
- **THEN** el build falla citando el fichero y el campo

### Requirement: Ficheros planos y slug estable
Los posts SHALL vivir directamente en `src/content/blog/` (sin subcarpetas con `.md`); el slug SHALL ser el nombre de fichero y cumplir `^[a-z0-9]+(-[a-z0-9]+)*$`. Las imágenes de un post SHALL vivir en `src/content/blog/<slug>/`.

#### Scenario: Subcarpeta con post
- **WHEN** aparece `src/content/blog/es/x.md`
- **THEN** el build falla con un mensaje que nombra el fichero y la regla, no con `Missing parameter: slug`

### Requirement: Borradores fuera de producción
Un post con `draft: true` SHALL construirse en previews y MUST NOT aparecer en producción (páginas, índices, sitemap, RSS, OG).

#### Scenario: Draft en producción
- **WHEN** se construye con `import.meta.env.PROD` y un post tiene `draft: true`
- **THEN** ni su URL, ni el sitemap, ni el RSS lo incluyen

### Requirement: MDX y código
El blog SHALL soportar MDX con componentes (`Callout`, `Steps`) y bloques de código con tema, números de línea, marcas de diff y etiqueta de fichero mediante `astro-expressive-code`; las imágenes SHALL optimizarse por `astro:assets`.

#### Scenario: Bloque con título
- **WHEN** un post contiene ```` ```yaml title="workspace-policy.yaml" ````
- **THEN** el HTML generado muestra la etiqueta del fichero y el código resaltado
