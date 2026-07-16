# Correo del dominio: Zoho Mail + Cloudflare DNS

Guía para dejar `contacto@jnegrete.dev` operativo. El dominio se compró en Vercel, pero **la zona DNS autoritativa está en Cloudflare** — todos los registros de esta guía se crean en Cloudflare (dash.cloudflare.com → jnegrete.dev → DNS → Records).

> ⚠️ Los hosts MX, el include SPF y el selector DKIM **varían según el data center de tu cuenta Zoho**. No copies valores genéricos de internet: cada valor se lee de TU consola de Zoho (Admin Console → Domains → jnegrete.dev). Los valores de ejemplo de abajo son los más comunes (zoho.com), pero manda lo que diga tu consola.

## Orden de ejecución

### 1. Verificación del dominio
- Zoho Admin Console → Domains → Add/Verify `jnegrete.dev` → método **TXT**.
- Zoho te da un valor tipo `zoho-verification=zbXXXXXXXX.zmverify.zoho.com`.
- En Cloudflare: crear registro **TXT**, Name `@`, Content el valor exacto. (Los TXT/MX no tienen nube naranja/gris — siempre son DNS-only.)
- Volver a Zoho y pulsar Verify.

### 2. Crear el buzón
- Admin Console → Users → crear el usuario/buzón **contacto@jnegrete.dev** (o añadirlo como alias de tu usuario admin si prefieres un solo buzón).

### 3. MX (correo entrante)
- Leer los 3 hosts MX en Admin Console → Domains → jnegrete.dev → Email Configuration → MX.
- Valores habituales (confirma en tu consola):

  | Type | Name | Mail server | Priority |
  |------|------|-------------|----------|
  | MX | @ | mx.zoho.com | 10 |
  | MX | @ | mx2.zoho.com | 20 |
  | MX | @ | mx3.zoho.com | 50 |

- **Antes de crear**: revisar que no exista otro MX en la zona; si existe y no lo reconoces, anótalo antes de borrarlo (respaldo en `docs/dns-backup-*.txt`).

### 4. SPF (autoriza a Zoho a enviar por tu dominio)
- Debe existir **exactamente un** registro TXT que empiece por `v=spf1` en `@`.
- Si Zoho es tu único emisor (recomendado empezar así): `v=spf1 include:zohomail.com -all` (o el include exacto que muestre tu consola, p. ej. `include:zoho.com` según DC).
- Si ya hay un SPF de otro servicio, **fusionar** los include en un solo registro, nunca crear dos.

### 5. DKIM (firma criptográfica)
- Admin Console → Domains → jnegrete.dev → Email Configuration → **DKIM** → Add selector (Zoho propone uno, p. ej. `zmail1`; el nombre lo defines tú ahí).
- Zoho genera el valor TXT. En Cloudflare: **TXT**, Name `<selector>._domainkey`, Content el valor completo `v=DKIM1; k=rsa; p=...`.
- Volver a Zoho y pulsar Verify en el selector.

### 6. DMARC (política anti-spoofing — después de que SPF y DKIM verifiquen)
- En Cloudflare: **TXT**, Name `_dmarc`, Content:
  `v=DMARC1; p=none; rua=mailto:contacto@jnegrete.dev; fo=1`
- Empezar con `p=none` (solo reportes). Tras 2–4 semanas revisando los reportes (llegan a contacto@), endurecer a `p=quarantine` y luego `p=reject`.

## Validación

1. **mxtoolbox.com**: buscar `jnegrete.dev` → MX Lookup, SPF Lookup, DMARC Lookup, DKIM Lookup (con el selector).
2. **Entrante**: enviar desde Gmail a `contacto@jnegrete.dev` → debe llegar al webmail de Zoho (mail.zoho.com).
3. **Saliente**: enviar desde Zoho a tu Gmail → en Gmail: ⋮ → "Mostrar original" → verificar `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`.

## Qué NO tocar

- Los registros A/CNAME del apex y `www` que apuntan a Vercel (sitio web) — el correo no los usa.
- Cualquier otro TXT/CNAME existente no relacionado (verificaciones de otros servicios).
- Propagación: los cambios en Cloudflare aplican en segundos-minutos; Zoho puede tardar unos minutos en re-verificar.
