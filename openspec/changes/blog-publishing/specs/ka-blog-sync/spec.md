# ka-blog-sync

## ADDED Requirements

### Requirement: Fuente inmutable y disparo incremental
`bip-blog-sync` SHALL consumir `/v1/audit-events` de KA con cursor persistido, filtrar escrituras bajo `building-in-public/05-publicaciones/blog/`, y leer el contenido por `GET /revisions/{content_hash}/content`. El SSE `/stream` MAY usarse solo para acortar la espera. Un ciclo interrumpido SHALL reanudarse desde el cursor sin duplicar efectos.

#### Scenario: Edición durante el ciclo
- **WHEN** el owner reescribe el post después de que el sync tomó el evento
- **THEN** el PR contiene exactamente la revisión del hash anotado en su cuerpo, y el siguiente ciclo produce una actualización del mismo PR

### Requirement: Gates y validación previa al PR
Solo SHALL publicarse un fichero plano `<slug>.md` con `canal` que incluya `blog` y `estado_editorial` `approved` (alta) o `published` (actualización). El sync SHALL mapear el frontmatter (tabla del design), copiar binarios referenciados por `/files/download` a `src/content/blog/<slug>/`, y validar **construyendo** (`astro check && astro build`) en un checkout limpio. Si falla, MUST NOT abrir PR y SHALL escribir el motivo en `06-feedback/<slug>.md`.

#### Scenario: Falta el resumen
- **WHEN** el fichero aprobado no tiene `resumen`
- **THEN** no hay rama ni PR y `06-feedback/<slug>.md` explica el campo y el rango

### Requirement: Un PR por slug, nunca `main`
La rama SHALL ser `content/<slug>`; si ya existe un PR abierto para esa rama, SHALL actualizarse con `push --force-with-lease`; MUST NOT usar `--force` ni empujar a una rama que no case `^content/[a-z0-9-]+$`. `date` SHALL congelarse en la primera publicación. El sync MUST NOT borrar ni despublicar.

#### Scenario: Reedición de un post publicado
- **WHEN** el post ya está en `main` y llega una revisión nueva con `estado_editorial: published`
- **THEN** se actualiza el PR de `content/<slug>` con `updated` nuevo y la misma `date`

### Requirement: Estado de vuelta sin tocar el post
Tras detectar el merge y verificar en producción (200, canonical, `BlogPosting`), el sync SHALL escribir `05-publicaciones/blog/<slug>.publicacion.md` (URL, PR, fecha, hash) por PUT con `expected_sha256`, y si la configuración lo habilita, `bip_url`, `bip_pr_url`, `bip_published_at` en NET. MUST NOT modificar el post fuente.

#### Scenario: Merge detectado
- **WHEN** el PR de `content/<slug>` se mergea y `https://jnegrete.dev/blog/<slug>/` responde 200 con `BlogPosting`
- **THEN** aparece el fichero hermano con la URL y el hash, y el post fuente conserva su `sha256`

### Requirement: Configuración en runtime y observabilidad
El sync SHALL leer `building-in-public/00-sistema/publicacion-blog.config.yml` en cada ciclo (`habilitado`, `dry_run`, `auto_pr`, `intervalo_s`, `requiere_estado`, `escribir_en_net`), validarlo con esquema estricto y, si no parsea, conservar el último válido y escribir el error en `06-feedback/_sync.md`. SHALL registrar cada ciclo en el journal de systemd con slug, hash, rama, PR y resultado; timeouts explícitos en toda espera de red.

#### Scenario: Config rota
- **WHEN** el YAML de configuración tiene un valor no permitido
- **THEN** el sync sigue con la configuración anterior, lo anuncia en `06-feedback/_sync.md` y en el journal, y no abre PRs nuevos si `habilitado` era `false`
