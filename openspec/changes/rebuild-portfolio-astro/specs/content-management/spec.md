# content-management

## ADDED Requirements

### Requirement: Contenido desacoplado del markup
Todo el contenido editable (perfil, disponibilidad, proyectos, experiencia, servicios, enlaces sociales, strings de UI) SHALL vivir en archivos TypeScript tipados bajo `src/data/` y `src/i18n/`, separados de los componentes; editar un dato MUST NOT requerir tocar archivos `.astro`.

#### Scenario: Editar un proyecto
- **WHEN** el usuario edita título/descripción de un proyecto en `src/data/projects.ts`
- **THEN** el cambio se refleja en Home y Proyectos en ambos idiomas tras rebuild, sin tocar componentes

#### Scenario: Cambiar disponibilidad
- **WHEN** el usuario cambia el flag de disponibilidad en `src/data/profile.ts`
- **THEN** el indicador "DISPONIBLE/AVAILABLE" cambia en topbar, sobre-mí y contacto

### Requirement: Datos bilingües en un solo lugar (excepto blog)
Cada entrada de contenido en `src/data/` SHALL contener sus textos en español e inglés juntos (campos `es`/`en`), de modo que una edición mantenga ambos idiomas sincronizados en el mismo archivo. Esta regla explícitamente NO aplica al blog, que usa un archivo Markdown por post y por idioma.

#### Scenario: Campo bilingüe
- **WHEN** el usuario edita la descripción `es` y `en` de un servicio
- **THEN** ambas versiones del sitio muestran el texto nuevo

### Requirement: Blog como content collection con páginas de detalle
Los posts SHALL ser archivos Markdown en `src/content/blog/` con frontmatter validado por Zod (`title`, `date`, `lang`, `tags`, `description`, `translationKey` opcional para enlazar traducciones). El sitio SHALL generar páginas de detalle por post vía `getStaticPaths()` por idioma (`/blog/<slug>/`, `/en/blog/<slug>/`) con render del Markdown, metadata individual y navegación de retorno; el listado SHALL renderizar solo posts existentes del idioma y mostrar estado vacío si no hay ninguno.

#### Scenario: Publicar un post
- **WHEN** el usuario añade `mi-post.md` con frontmatter válido (`lang: es`)
- **THEN** el post aparece en el listado `/blog/` y su página `/blog/mi-post/` existe con el contenido renderizado

#### Scenario: Frontmatter inválido
- **WHEN** un post tiene frontmatter que no cumple el schema
- **THEN** `astro build` falla con un error que identifica el archivo y el campo

#### Scenario: Blog vacío
- **WHEN** no hay posts para un idioma
- **THEN** la página de blog muestra un mensaje de "próximamente" en lugar de posts inventados

### Requirement: Feed RSS
El sitio SHALL generar feeds RSS con `@astrojs/rss` por idioma (`/rss.xml` para ES, `/en/rss.xml` para EN) a partir de la collection del blog, y el botón RSS del diseño SHALL enlazar al feed del idioma activo.

#### Scenario: Feed válido
- **WHEN** se solicita `/rss.xml`
- **THEN** responde XML RSS válido con los posts ES existentes (o feed vacío válido si no hay posts)

### Requirement: Matriz de fuentes de contenido
El repo SHALL incluir `docs/content-sources.md` con la matriz `dato publicado → página/sección → fuente exacta` (CV, GitHub o decisión explícita del usuario); todo claim publicado MUST tener una fila.

#### Scenario: Claim trazable
- **WHEN** se revisa cualquier afirmación del sitio (rol, fecha, proyecto, servicio)
- **THEN** existe su fila correspondiente en `docs/content-sources.md`

### Requirement: Guía de edición
El README del repo SHALL documentar cómo editar cada tipo de contenido (datos, posts, disponibilidad, email), cómo previsualizar localmente y cómo se despliega.

#### Scenario: Editar sin conocimiento previo
- **WHEN** el usuario sigue el README para cambiar un texto y publicar un post
- **THEN** puede hacerlo sin tocar componentes ni configuración
