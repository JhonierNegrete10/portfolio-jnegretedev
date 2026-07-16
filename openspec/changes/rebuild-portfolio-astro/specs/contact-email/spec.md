# contact-email

## ADDED Requirements

### Requirement: DNS de Zoho Mail en Cloudflare con valores exactos de la consola
El DNS de `jnegrete.dev` (zona Cloudflare) SHALL incluir los registros requeridos por Zoho Mail copiados **exactamente de la Zoho Admin Console del usuario** — los hosts MX, el include SPF y el selector DKIM varían por data center y MUST NOT asumirse genéricos. Orden: TXT de verificación de dominio → creación del buzón `contacto@jnegrete.dev` → MX → SPF → DKIM. SHALL existir un único registro SPF (inventariando emisores existentes antes de fusionar; si Zoho es el único emisor, usar `-all`).

#### Scenario: Correo entrante
- **WHEN** se envía un email a `contacto@jnegrete.dev` desde un proveedor externo
- **THEN** llega al buzón de Zoho Mail

#### Scenario: Correo saliente autenticado
- **WHEN** se envía un email desde `contacto@jnegrete.dev` a Gmail
- **THEN** las cabeceras muestran SPF=pass y DKIM=pass

#### Scenario: SPF único
- **WHEN** se inspeccionan los TXT del apex
- **THEN** existe exactamente un registro que empieza por `v=spf1`

### Requirement: Política DMARC
El dominio SHALL publicar un registro DMARC en `_dmarc.jnegrete.dev`, iniciando con `p=none` y `rua` apuntando a un buzón real (`contacto@jnegrete.dev`), con endurecimiento posterior a `quarantine`/`reject` tras revisar reportes. La validación final MUST exigir SPF=pass, DKIM=pass y DMARC=pass.

#### Scenario: DMARC publicado
- **WHEN** se consulta el TXT de `_dmarc.jnegrete.dev`
- **THEN** responde una política DMARC válida con `rua` a un buzón real

#### Scenario: Alineación completa
- **WHEN** se envía un correo de prueba a Gmail y se inspeccionan las cabeceras de autenticación
- **THEN** SPF, DKIM y DMARC aparecen en pass

### Requirement: Registros no relacionados preservados
Los cambios DNS de correo MUST NOT alterar registros ajenos al correo y al sitio; el estado previo de la zona MUST quedar respaldado, distinguiendo preservación de registros no relacionados del reemplazo deliberado aprobado (apex/`www` hacia Vercel).

#### Scenario: DNS previo preservado
- **WHEN** se aplican los registros de Zoho
- **THEN** los registros no relacionados de la zona siguen intactos y hay un respaldo documentado del estado anterior

### Requirement: Email del dominio publicado en el sitio
El sitio SHALL mostrar `contacto@jnegrete.dev` (confirmado por el usuario) como texto visible y enlace `mailto:` en la sección Contacto y en el footer, reemplazando los enlaces "email protected" del export original. MUST NOT publicarse un fallback de otro dominio (p. ej. Gmail).

#### Scenario: Mailto funcional
- **WHEN** un visitante pulsa la dirección en Contacto
- **THEN** se abre su cliente de correo con destinatario `contacto@jnegrete.dev`

#### Scenario: Guía de configuración
- **WHEN** el usuario necesita los pasos de Zoho/Cloudflare
- **THEN** existe `docs/zoho-dns.md` con el orden exacto, dónde leer cada valor en la Admin Console, cómo aplicarlo en Cloudflare y cómo validar (mxtoolbox / cabeceras Gmail)
