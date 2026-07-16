// One-off generator for public/og.png, public/favicon.svg, and the PNG
// favicon fallbacks. Uses `sharp` (already an Astro dependency) to
// rasterize hand-written SVG — no external services, no network calls.
//
// Re-run with: node scripts/generate-og.mjs

import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const BG = '#141416';
const ACCENT = '#ff5c35';
const TEXT = '#ececea';
const MUTED = '#9a9a96';
const BORDER = '#2e2e30';

// ---------------------------------------------------------------------
// OG image: 1200x630
// ---------------------------------------------------------------------
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1.4" fill="${ACCENT}" opacity="0.16" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}" />
  <rect width="1200" height="630" fill="url(#dots)" />
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="${BORDER}" stroke-width="2" />

  <!-- top wordmark -->
  <text x="64" y="80" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="20"
        letter-spacing="3" fill="${TEXT}" font-weight="600">JNEGRETE.DEV</text>
  <circle cx="1120" cy="72" r="6" fill="${ACCENT}" />
  <text x="940" y="80" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="15"
        letter-spacing="2" fill="${MUTED}" text-anchor="end">MEDELLIN · REMOTE</text>

  <!-- name -->
  <text x="64" y="330" font-family="'Archivo', Arial, sans-serif" font-size="112" font-weight="700"
        letter-spacing="-3" fill="${TEXT}">JHONIER</text>
  <text x="64" y="440" font-family="'Archivo', Arial, sans-serif" font-size="112" font-weight="700"
        letter-spacing="-3" fill="${TEXT}">NEGRETE<tspan fill="${ACCENT}">.</tspan></text>

  <!-- tagline -->
  <text x="64" y="500" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="24"
        fill="${MUTED}">AI Transformation Lead | Enterprise AI Agents &amp; Governance</text>

  <!-- baseline rule + coords -->
  <line x1="64" y1="548" x2="1136" y2="548" stroke="${BORDER}" stroke-width="2" />
  <text x="64" y="588" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="16"
        letter-spacing="2" fill="${MUTED}">LAT 6.2442&#176; N · LON 75.5812&#176; W</text>
  <text x="1136" y="588" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="16"
        letter-spacing="2" fill="${ACCENT}" text-anchor="end">LLMS &#183; RAG &#183; AGENTS &#183; EVALS</text>
</svg>
`.trim();

// ---------------------------------------------------------------------
// Favicon / apple-touch-icon: a compact "J." mark on the site's dark bg
// ---------------------------------------------------------------------
function markSvg(size) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="${BG}" />
  <rect x="1.5" y="1.5" width="61" height="61" rx="9" fill="none" stroke="${BORDER}" stroke-width="2" />
  <text x="32" y="44" font-family="'Archivo', Arial, sans-serif" font-size="38" font-weight="700"
        fill="${TEXT}" text-anchor="middle">J<tspan fill="${ACCENT}">.</tspan></text>
</svg>
`.trim();
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  // OG image
  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(publicDir, 'og.png'));

  // Favicon (SVG, modern browsers) + PNG fallbacks
  const favicon64 = markSvg(64);
  await writeFile(path.join(publicDir, 'favicon.svg'), favicon64.replace('width="64" height="64"', 'width="64" height="64"'));

  await sharp(Buffer.from(markSvg(32))).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(Buffer.from(markSvg(180))).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Generated: public/og.png, public/favicon.svg, public/favicon-32x32.png, public/apple-touch-icon.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
