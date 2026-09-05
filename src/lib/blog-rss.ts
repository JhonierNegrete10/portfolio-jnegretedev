import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { render } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import type { BlogEntry } from './blog';

function decodeHtmlEntities(value: string): string {
  const namedEntities: Record<string, string> = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: '\u00a0',
    quot: '"',
  };
  return value.replace(/&(#(?:x[\da-f]+|\d+)|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    if (code.startsWith('#')) return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    return namedEntities[code.toLowerCase()] ?? entity;
  });
}

function textContent(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, ''));
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function plainExpressiveCode(html: string): string {
  // Expressive Code stores the raw code in data-code="..." with only quotes escaped, so a
  // literal "</figure>" inside a code block would end the figure match early. Strip the
  // attribute first (its value cannot contain a double quote by construction).
  const withoutDataCode = html.replace(/\sdata-code="[^"]*"/gi, '');
  return withoutDataCode.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, (figure) => {
    const caption = figure.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1];
    const title = caption ? textContent(caption).trim() : '';
    const lineStarts = [...figure.matchAll(/<div\b[^>]*class=["']([^"']*\bec-line\b[^"']*)["'][^>]*>/gi)];
    if (lineStarts.length === 0) return figure;
    const lines = lineStarts.map((line, index) => {
      const start = (line.index ?? 0) + line[0].length;
      const end = lineStarts[index + 1]?.index ?? figure.length;
      const lineHtml = figure.slice(start, end);
      const codeHtml =
        lineHtml.match(/<div\b[^>]*class=["'][^"']*\bcode\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? '';
      const classes = line[1].split(/\s+/);
      const marker = classes.includes('del') ? '- ' : classes.includes('ins') ? '+ ' : '';
      return `${marker}${textContent(codeHtml)}`.trimEnd();
    });
    const titleHtml = title ? `<p><strong>${escapeHtml(title)}</strong></p>` : '';
    return `${titleHtml}<pre><code>${escapeHtml(lines.join('\n'))}</code></pre>`;
  });
}

function sanitizeOptions(postUrl: string): sanitizeHtml.IOptions {
  return {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'a',
      'ul',
      'ol',
      'li',
      'pre',
      'code',
      'blockquote',
      'aside',
      'hr',
      'del',
      'ins',
      'strong',
      'em',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'figure',
      'figcaption',
      'span',
      'br',
    ],
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt'],
    },
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: absolutizeAttribute(attribs, 'href', postUrl),
      }),
      img: (_tagName, attribs) => ({
        tagName: 'img',
        attribs: absolutizeAttribute(attribs, 'src', postUrl),
      }),
    },
  };
}

function absolutizeAttribute(
  attribs: Record<string, string>,
  name: 'href' | 'src',
  postUrl: string,
): Record<string, string> {
  const value = attribs[name];
  if (!value) return attribs;
  try {
    return { ...attribs, [name]: new URL(value, postUrl).href };
  } catch (error) {
    throw new Error(
      `RSS post URL "${postUrl}" violates the absolute ${name} rule: cannot resolve "${value}": ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function createRssContainer(): Promise<AstroContainer> {
  const renderers = await loadRenderers([getMDXRenderer()]);
  return AstroContainer.create({ renderers });
}

export async function renderRssContent(container: AstroContainer, entry: BlogEntry, postUrl: string): Promise<string> {
  const { Content } = await render(entry);
  const html = await container.renderToString(Content);
  return sanitizeHtml(plainExpressiveCode(html), sanitizeOptions(postUrl));
}
