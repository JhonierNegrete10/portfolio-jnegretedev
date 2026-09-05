import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { getPublishedPosts, type BlogEntry } from '../../lib/blog';
import { getSeries } from '../../data/series';

const BG = '#141416';
const ACCENT = '#ff5c35';
const TEXT = '#ececea';
const MUTED = '#9a9a96';
const BORDER = '#2e2e30';

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    };
    return entities[character];
  });
}

function wrapTitle(title: string): string[] {
  const words = title.trim().split(/\s+/);
  const lines: string[] = [];

  for (const word of words) {
    const current = lines.at(-1);
    if (!current || (current.length + word.length + 1 > 30 && lines.length < 3)) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  }

  if (lines.length > 3) {
    const remainder = lines.splice(2).join(' ');
    lines[2] = `${remainder.slice(0, 29).trimEnd()}…`;
  } else if (lines[2]?.length > 34) {
    lines[2] = `${lines[2].slice(0, 33).trimEnd()}…`;
  }

  return lines.slice(0, 3);
}

export async function getStaticPaths() {
  const entries = [...(await getPublishedPosts('es')), ...(await getPublishedPosts('en'))].filter(
    (entry) => !entry.data.cover,
  );

  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute<{ entry: BlogEntry }> = async ({ props }) => {
  const { entry } = props;
  const lines = wrapTitle(entry.data.title);
  const seriesLabel = entry.data.series ? getSeries(entry.data.series).title[entry.data.lang] : 'BLOG';
  const date = entry.data.date.toISOString().slice(0, 10);
  const title = lines
    .map(
      (line, index) =>
        `<text x="64" y="${230 + index * 90}" font-family="'Archivo', Arial, sans-serif" font-size="76" font-weight="700" letter-spacing="-2" fill="${TEXT}">${escapeXml(line)}</text>`,
    )
    .join('\n');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1.4" fill="${ACCENT}" opacity="0.16" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}" />
  <rect width="1200" height="630" fill="url(#dots)" />
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="${BORDER}" stroke-width="2" />
  <text x="64" y="80" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="20" letter-spacing="3" fill="${TEXT}" font-weight="600">JNEGRETE.DEV</text>
  <circle cx="1120" cy="72" r="6" fill="${ACCENT}" />
  <text x="64" y="140" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="18" letter-spacing="2" fill="${ACCENT}">${escapeXml(seriesLabel.toUpperCase())}</text>
  ${title}
  <line x1="64" y1="548" x2="1136" y2="548" stroke="${BORDER}" stroke-width="2" />
  <text x="64" y="588" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="17" letter-spacing="2" fill="${MUTED}">${date}</text>
  <text x="1136" y="588" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="17" letter-spacing="2" fill="${ACCENT}" text-anchor="end">BLOG · ${entry.data.lang.toUpperCase()}</text>
</svg>`.trim();

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
