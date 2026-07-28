# Sentry fit evaluation — portfolio-jnegretedev (Astro 5, static)

Status: **evaluated — NOT installing Sentry now (documented recommendation).**
Date: 2026-07-28 · Owner: WS-B3 (Fábrica → Clientes)

## TL;DR

This site is **100% static, prerendered HTML** deployed to Vercel with **no adapter,
no SSR, no API routes, and zero UI-framework islands**. `@sentry/astro`'s real value is
server-side (SSR/endpoint/request error capture + tracing) — and there is **no server
surface here to instrument**. Installing it would run **browser-only**, adding a
multi-KB browser SDK + a large dependency subtree onto an otherwise near-zero-JS site,
to catch errors in ~250 lines of non-critical presentational vanilla JS. **Not worth it
today.** Recommendation below covers when/how to revisit.

## Facts (from the current codebase)

- **Astro `^5.18.2`**, `output` defaults to **`static`**; no `@astrojs/vercel` adapter.
  Deploy is a static build (`vercel.json` → `"framework": "astro"`).
- Integrations: only `@astrojs/sitemap`. No server endpoints (`src/pages/api/` absent),
  no `APIRoute`/`new Response(...)`. `rss.xml.ts` (es/en) is prerendered at build.
- **No islands / hydration:** no React/Vue/Svelte/Solid, zero `client:` directives.
  Client JS is two hand-written Astro `<script>` blocks: a mobile-menu toggle
  (`Topbar.astro`) and an animated `<canvas>` globe (`Globe.astro`).
- Existing telemetry: Vercel Web Analytics + Speed Insights (inline stubs). No error
  tracking of any kind today.

## Why not install now

1. **No server surface** = the primary Sentry catchment (SSR/endpoint/request errors,
   backend tracing) does not exist here. Server-side Sentry would instrument nothing.
2. **Cost/benefit is inverted for a static portfolio:** `@sentry/astro` pulls a large
   dep tree and ships a browser SDK bundle onto a site whose entire runtime JS is a menu
   toggle and a decorative canvas animation. That is a real bundle-size / performance
   regression on a site whose selling point is being fast and clean.
3. **Low blast radius:** a JS error in the globe/menu degrades a cosmetic element; it does
   not break content, checkout, or data. There is no user/business flow to protect.
4. **This is a portfolio, not a product** — no customers depend on runtime correctness the
   way they do in the ERPs (where Sentry WAS installed in this workstream).

## Recommendation

- **Do not add `@sentry/astro` now.** Avoids the PR #2 (`package.json`) conflict entirely
  since we touch no dependencies.
- **Revisit only if** the site gains a server surface — e.g. a contact form backed by an
  Astro endpoint/serverless function, the `@astrojs/vercel` adapter for SSR, or embedded
  interactive islands with real logic. At that point install `@sentry/astro` and
  instrument the **server** side first (that's where it pays off), mirroring the DSN-by-env,
  `tracesSampleRate: 0.1`, `sendDefaultPii: false` conventions used for the ERPs in WS-B3.
- **If browser-error visibility is ever wanted before that** (cheapest option, no build
  dependency): gate Sentry's Loader `<script>` snippet behind a `PUBLIC_SENTRY_DSN` env
  in `Head.astro` so it only loads when the DSN is set — no npm dependency, no bundle
  weight when unset. Still likely overkill for the current JS footprint.

## If it is ever installed (conventions to follow)

- Create a Sentry project `portfolio-jnegretedev` (platform: Astro) in sentry.io.
- Env vars (Vercel dashboard, Production + Preview): `PUBLIC_SENTRY_DSN` (browser),
  optional `SENTRY_ENVIRONMENT`, and — only for source-map upload — `SENTRY_ORG`,
  `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`. Never hardcode the DSN. Keep `tracesSampleRate`
  at `0.1` and `sendDefaultPii: false`.
