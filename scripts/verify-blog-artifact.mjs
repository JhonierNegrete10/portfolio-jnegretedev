import { createRequire } from 'node:module';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const loadCommonJs = createRequire(import.meta.url);
const sax = loadCommonJs('sax');
const projectRoot = path.resolve(import.meta.dirname, '..');
const distDirectory = path.join(projectRoot, 'dist');
const siteOrigin = 'https://jnegrete.dev';
const failures = [];
const excludedDrafts = [];

function fail(url, rule, detail) {
  failures.push(`${url} — ${rule}: ${detail}`);
}

function attributes(tag) {
  const result = new Map();
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) {
    result.set(match[1].toLowerCase(), match[3]);
  }
  return result;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => ({
    raw: match[0],
    attrs: attributes(match[0]),
  }));
}

function assertWellFormedXml(xml, url) {
  const parser = sax.parser(true);
  let parseError;
  parser.onerror = (error) => {
    parseError = error;
    parser.resume();
  };
  parser.write(xml).close();
  if (parseError) fail(url, 'valid XML', parseError.message);
}

function sourcePosts() {
  const contentDirectory = path.join(projectRoot, 'src', 'content', 'blog');
  const includeDrafts = process.env.BLOG_INCLUDE_DRAFTS === '1';
  const posts = [];

  for (const entry of readdirSync(contentDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith('_') || !/\.mdx?$/.test(entry.name)) continue;
    const sourcePath = path.join(contentDirectory, entry.name);
    const { data } = matter(readFileSync(sourcePath, 'utf8'));
    if (data.lang !== 'es' && data.lang !== 'en') continue;
    const slug = entry.name.replace(/\.mdx?$/, '');
    const url = data.lang === 'en' ? `/en/blog/${slug}/` : `/blog/${slug}/`;
    const htmlPath = path.join(distDirectory, url.replace(/^\//, ''), 'index.html');
    const post = { url, htmlPath, lang: data.lang, data, slug };
    if (data.draft === true && !includeDrafts) {
      excludedDrafts.push(post);
      continue;
    }
    posts.push(post);
  }

  return posts;
}

/**
 * A draft that reaches dist/ without BLOG_INCLUDE_DRAFTS=1 is a leak: `astro build`
 * loads `.env` files into process.env, so a stray `.env` with the flag builds the
 * draft while this script (run outside Astro) sees no flag. Fail loudly.
 */
function verifyNoDraftLeak() {
  for (const draft of excludedDrafts) {
    const leaks = [];
    if (existsSync(draft.htmlPath)) leaks.push(path.relative(projectRoot, draft.htmlPath));
    const ogPath = path.join(distDirectory, 'og', `${draft.slug}.png`);
    if (existsSync(ogPath)) leaks.push(path.relative(projectRoot, ogPath));
    for (const file of ['sitemap-0.xml', 'rss.xml', path.join('en', 'rss.xml')]) {
      const filePath = path.join(distDirectory, file);
      if (existsSync(filePath) && readFileSync(filePath, 'utf8').includes(draft.url)) leaks.push(file);
    }
    if (leaks.length) {
      fail(
        draft.url,
        'draft not in production build',
        `draft: true but present in ${leaks.join(', ')} while BLOG_INCLUDE_DRAFTS is not "1" — check for a .env file setting the flag`,
      );
    }
  }
}

function postArtifacts(posts) {
  return posts.filter((post) => {
    if (existsSync(post.htmlPath)) return true;
    fail(post.url, 'post page exists', `missing page ${path.relative(projectRoot, post.htmlPath)}`);
    return false;
  });
}

function jsonLdNodes(value) {
  if (Array.isArray(value)) return value.flatMap(jsonLdNodes);
  if (!value || typeof value !== 'object') return [];
  const nodes = value['@type'] ? [value] : [];
  return Array.isArray(value['@graph']) ? [...nodes, ...value['@graph'].flatMap(jsonLdNodes)] : nodes;
}

function hasJsonLdType(node, type) {
  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
  return types.includes(type);
}

function sitePagePath(itemUrl) {
  const parsed = new URL(itemUrl);
  if (parsed.origin !== siteOrigin) return undefined;
  return path.join(distDirectory, decodeURIComponent(parsed.pathname).replace(/^\//, ''), 'index.html');
}

function verifyPost({ url, htmlPath }) {
  const html = readFileSync(htmlPath, 'utf8');
  const canonicalLinks = tags(html, 'link').filter((tag) => tag.attrs.get('rel')?.split(/\s+/).includes('canonical'));
  if (canonicalLinks.length !== 1) {
    fail(url, 'canonical', `expected exactly one canonical link, found ${canonicalLinks.length}`);
  } else {
    const href = canonicalLinks[0].attrs.get('href') ?? '';
    try {
      new URL(href);
    } catch (error) {
      fail(url, 'canonical absolute URL', error instanceof Error ? error.message : String(error));
    }
  }

  const jsonLdScripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(
    (match) => attributes(match[1]).get('type') === 'application/ld+json',
  );
  const postingScripts = jsonLdScripts.filter((match) => match[2].includes('BlogPosting'));
  const nodes = [];
  for (const script of jsonLdScripts) {
    try {
      nodes.push(...jsonLdNodes(JSON.parse(script[2])));
    } catch (error) {
      fail(url, 'valid JSON-LD', error instanceof Error ? error.message : String(error));
    }
  }
  if (postingScripts.length !== 1) {
    fail(url, 'BlogPosting JSON-LD', `expected exactly one matching script, found ${postingScripts.length}`);
  }

  const breadcrumbs = nodes.filter((node) => hasJsonLdType(node, 'BreadcrumbList'));
  if (breadcrumbs.length !== 1) {
    fail(url, 'BreadcrumbList JSON-LD', `expected exactly one node, found ${breadcrumbs.length}`);
  } else {
    const items = breadcrumbs[0].itemListElement;
    if (!Array.isArray(items)) {
      fail(url, 'BreadcrumbList contiguous positions', 'itemListElement must be an array');
    } else {
      const positions = items.map((item) => item?.position);
      const expectedPositions = items.map((_, index) => index + 1);
      if (positions.some((position, index) => position !== expectedPositions[index])) {
        fail(
          url,
          'BreadcrumbList contiguous positions',
          `expected ${expectedPositions.join(', ')}, found ${positions.join(', ')}`,
        );
      }

      for (const [index, item] of items.entries()) {
        if (typeof item?.item !== 'string' || !item.item) {
          fail(url, 'BreadcrumbList item URL', `item ${index + 1} has no URL`);
          continue;
        }
        try {
          const localPath = sitePagePath(item.item);
          if (localPath && !existsSync(localPath)) {
            fail(
              url,
              'BreadcrumbList local item exists',
              `item ${item.item} is missing ${path.relative(projectRoot, localPath)}`,
            );
          }
        } catch (error) {
          fail(
            url,
            'BreadcrumbList item URL',
            `item ${item.item}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  }

  const ogTypes = tags(html, 'meta').filter((tag) => tag.attrs.get('property') === 'og:type');
  if (ogTypes.length !== 1 || ogTypes[0].attrs.get('content') !== 'article') {
    fail(url, 'og:type=article', `found ${ogTypes.map((tag) => tag.attrs.get('content')).join(', ') || 'none'}`);
  }

  const ogImages = tags(html, 'meta').filter((tag) => tag.attrs.get('property') === 'og:image');
  if (ogImages.length !== 1 || !ogImages[0].attrs.get('content')) {
    fail(url, 'og:image', `expected exactly one non-empty value, found ${ogImages.length}`);
  } else {
    const source = ogImages[0].attrs.get('content');
    try {
      const imageUrl = new URL(source, siteOrigin);
      if (imageUrl.origin === siteOrigin) {
        const localPath = path.join(distDirectory, decodeURIComponent(imageUrl.pathname).replace(/^\//, ''));
        if (!existsSync(localPath)) fail(url, 'local og:image exists', `missing ${imageUrl.pathname}`);
      }
    } catch (error) {
      fail(url, 'valid og:image URL', error instanceof Error ? error.message : String(error));
    }
  }
}

function translatedPairs(posts) {
  const pairs = new Map();
  for (const { data, lang, slug } of posts) {
    if (!data.translationKey || (data.lang !== 'es' && data.lang !== 'en')) continue;
    const pair = pairs.get(data.translationKey) ?? {};
    pair[lang] = slug;
    pairs.set(data.translationKey, pair);
  }
  return [...pairs.values()].filter((pair) => pair.es && pair.en);
}

function verifyReciprocalHreflang(pair) {
  const es = {
    url: `/blog/${pair.es}/`,
    file: path.join(distDirectory, 'blog', pair.es, 'index.html'),
    lang: 'en',
    expected: `${siteOrigin}/en/blog/${pair.en}/`,
  };
  const en = {
    url: `/en/blog/${pair.en}/`,
    file: path.join(distDirectory, 'en', 'blog', pair.en, 'index.html'),
    lang: 'es',
    expected: `${siteOrigin}/blog/${pair.es}/`,
  };
  if (!existsSync(es.file) || !existsSync(en.file)) return;

  for (const side of [es, en]) {
    const alternates = tags(readFileSync(side.file, 'utf8'), 'link').filter((tag) =>
      tag.attrs.get('rel')?.split(/\s+/).includes('alternate'),
    );
    const actual = alternates.find((tag) => tag.attrs.get('hreflang') === side.lang)?.attrs.get('href');
    if (actual !== side.expected)
      fail(side.url, 'reciprocal hreflang', `expected ${side.expected}, found ${actual ?? 'none'}`);
  }
}

if (!existsSync(distDirectory)) {
  console.error('dist/ — build artifact: directory does not exist; run npm run build first.');
  process.exit(1);
}

const expectedPosts = sourcePosts();
if (process.env.BLOG_INCLUDE_DRAFTS === '1' && expectedPosts.length === 0) {
  fail(
    'src/content/blog/',
    'BLOG_INCLUDE_DRAFTS harness posts',
    'expected at least one post when BLOG_INCLUDE_DRAFTS=1, found zero',
  );
}
const posts = postArtifacts(expectedPosts);
verifyNoDraftLeak();
const postLanguages = new Set(expectedPosts.map(({ lang }) => lang));
for (const post of posts) verifyPost(post);
for (const pair of translatedPairs(expectedPosts)) verifyReciprocalHreflang(pair);

const sitemapPath = path.join(distDirectory, 'sitemap-0.xml');
if (!existsSync(sitemapPath)) {
  fail('/sitemap-0.xml', 'sitemap exists', 'file is missing');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  assertWellFormedXml(sitemap, '/sitemap-0.xml');
  const urlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  for (const [index, match] of urlBlocks.entries()) {
    const location = match[1].match(/<loc>(.*?)<\/loc>/)?.[1] ?? `entry ${index + 1}`;
    const hasLastmod = /<lastmod>[^<]+<\/lastmod>/.test(match[1]);
    let pathname;
    try {
      pathname = new URL(location, siteOrigin).pathname;
    } catch (error) {
      fail(location, 'sitemap location', error instanceof Error ? error.message : String(error));
      continue;
    }
    const language = pathname.startsWith('/en/blog/') ? 'en' : pathname.startsWith('/blog/') ? 'es' : undefined;
    if (language && postLanguages.has(language) && !hasLastmod) {
      fail(location, 'sitemap lastmod', 'element is missing or empty');
    } else if (!language && hasLastmod) {
      fail(location, 'sitemap lastmod', 'element must be absent for non-blog URLs');
    }
  }
}

for (const feed of ['/rss.xml', '/en/rss.xml']) {
  const feedPath = path.join(distDirectory, feed.replace(/^\//, ''));
  if (!existsSync(feedPath)) {
    fail(feed, 'RSS exists', 'file is missing');
    continue;
  }
  const xml = readFileSync(feedPath, 'utf8');
  assertWellFormedXml(xml, feed);
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const [index, item] of items.entries()) {
    const content = item[1].match(/<content(?::encoded)?\b[^>]*>([\s\S]*?)<\/content(?::encoded)?>/i)?.[1];
    if (content === undefined) {
      fail(`${feed}#item-${index + 1}`, 'RSS full content', 'content:encoded/content is missing');
      continue;
    }
    const withoutCdata = content.match(/^\s*<!\[CDATA\[([\s\S]*)\]\]>\s*$/)?.[1] ?? content;
    const unescaped = withoutCdata
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_entity, value) => String.fromCodePoint(Number(value)))
      .replace(/&#x([\da-f]+);/gi, (_entity, value) => String.fromCodePoint(Number.parseInt(value, 16)))
      .replace(/&amp;/g, '&');
    if (unescaped.trim().length < 200) {
      fail(
        `${feed}#item-${index + 1}`,
        'RSS full content length',
        `expected at least 200 characters after unescaping, found ${unescaped.trim().length}`,
      );
    }
    if (!/<(?:h2|p)\b/i.test(unescaped)) {
      fail(`${feed}#item-${index + 1}`, 'RSS full content markup', 'expected at least one <h2> or <p> element');
    }
  }
}

console.log(`Blog artifact posts verified: ${posts.length}.`);

if (failures.length) {
  console.error(`Blog artifact verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Blog artifact verified: ${posts.length} post(s), sitemap lastmod complete, 2 RSS feed(s) valid.`);
