# Snapshot DNS público de jnegrete.dev — 2026-07-16

Estado observado vía DNS público (resolver 1.1.1.1) ANTES de cualquier cambio manual en Cloudflare. La zona autoritativa vive en Cloudflare (`duke.ns.cloudflare.com`, `hazel.ns.cloudflare.com`). Este snapshot es lo visible públicamente; el export completo de la zona debe hacerse desde el dashboard de Cloudflare (DNS → Records → Export) antes de editar.

## Web (apex y www)
- `jnegrete.dev` → A proxied por Cloudflare (respuesta pública: `172.67.205.234`, `104.21.15.114` — IPs del proxy, el origen real está oculto tras la nube naranja)
- `www.jnegrete.dev` → mismo estado proxied
- Ambos verificados y funcionando contra el proyecto Vercel `portfolio-jnegretedev` (verificación http-01, TLS OK)
- **Recomendación vigente de Vercel para este proyecto** (leída de `vercel domains verify` el 2026-07-16):
  - `CNAME @ → 7282ffc60f80f4a8.vercel-dns-017.com.` con **proxy desactivado** (DNS only)
  - `CNAME www → 7282ffc60f80f4a8.vercel-dns-017.com.` con **proxy desactivado**
  - Alternativas rank-2: A `76.76.21.21` / CNAME `cname.vercel-dns.com`

## Correo (Zoho — ya configurado previamente)
- MX: `mx.zoho.com` (10), `mx2.zoho.com` (20), `mx3.zoho.com` (50) ✓
- TXT SPF: `v=spf1 include:zohomail.com ~all` (único SPF) ✓
- TXT verificación: `zoho-verification=zb26088957.zmverify.zoho.com` ✓
- DKIM: selector `zmail._domainkey` publicado (`v=DKIM1; k=rsa; p=MIGf...`) ✓
- DMARC: **NO existe** `_dmarc.jnegrete.dev` — pendiente de crear

## Pendiente (acción del usuario en Cloudflare)
1. Export de la zona completa como respaldo (antes de editar).
2. Cambiar apex y `www` al CNAME recomendado por Vercel en modo DNS only (hoy funciona proxied, pero Vercel lo desaconseja: caché/TLS pueden fallar en renovaciones).
3. Crear TXT `_dmarc` → `v=DMARC1; p=none; rua=mailto:contacto@jnegrete.dev; fo=1`.
