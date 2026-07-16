# deployment-pipeline

## ADDED Requirements

### Requirement: Repositorio GitHub
El proyecto SHALL versionarse en git con un repositorio en GitHub bajo la cuenta `JhonierNegrete10`, con `.gitignore` apropiado para Astro/Node, `package-lock.json` comprometido y el HTML original preservado en `reference/`.

#### Scenario: Repo creado y conectado
- **WHEN** se completa la configuración
- **THEN** `git remote -v` apunta al repo GitHub del usuario y `main` está pusheado

### Requirement: Deploy continuo en Vercel
El repositorio SHALL estar conectado a un proyecto Vercel con framework preset Astro (estático, sin adaptador), de forma que cada push a `main` produzca un deploy de producción automático.

#### Scenario: Deploy automático
- **WHEN** se hace push de un commit a `main`
- **THEN** Vercel construye y publica una nueva versión de producción sin intervención manual

#### Scenario: Build de producción sano
- **WHEN** Vercel ejecuta el build
- **THEN** termina sin errores y el deployment queda en estado READY

### Requirement: Dominio jnegrete.dev con DNS en Cloudflare
El proyecto Vercel SHALL tener asignados `jnegrete.dev` y `www.jnegrete.dev`. Los registros DNS SHALL crearse en la zona Cloudflare **con los valores exactos que Vercel indique para este proyecto** (leídos vía `vercel domains inspect`/dashboard tras añadir los dominios — nunca valores genéricos asumidos), en modo DNS only (nube gris) para apex y `www`. La redirección `www → apex` SHALL configurarse en Vercel (308), no con reglas proxied de Cloudflare. Antes de cualquier cambio, la zona Cloudflare MUST respaldarse (export) y el diff de registros (preservados vs reemplazados deliberadamente, incluyendo revisión de CAA) MUST documentarse.

#### Scenario: Dominio activo
- **WHEN** un visitante abre `https://jnegrete.dev`
- **THEN** ve el portfolio en producción con certificado TLS válido y el dominio en estado válido en Vercel

#### Scenario: Redirección www
- **WHEN** un visitante abre `https://www.jnegrete.dev`
- **THEN** recibe redirección permanente (308) a `https://jnegrete.dev`

#### Scenario: Zona respaldada
- **WHEN** se aplican cambios DNS
- **THEN** existe un export previo de la zona y un diff documentado de qué se preservó y qué se reemplazó deliberadamente
