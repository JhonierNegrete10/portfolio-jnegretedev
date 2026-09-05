import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

function isoDate(value, filePath, field) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    throw new Error(`Invalid blog ${field} in "${filePath}": expected a valid date.`);
  }
  return parsed.toISOString();
}

export default function blogSitemap({ site, routes }) {
  const lastmodByUrl = new Map();
  const latestPostByLanguage = new Map();
  const alternatesByUrl = new Map();

  function addAlternates(esPath, enPath) {
    const links = [
      { lang: 'es-CO', url: `${site}${esPath}` },
      { lang: 'en-US', url: `${site}${enPath}` },
      { lang: 'x-default', url: `${site}${esPath}` },
    ];
    alternatesByUrl.set(`${site}${esPath}`, links);
    alternatesByUrl.set(`${site}${enPath}`, links);
  }

  return {
    integration: {
      name: 'blog-sitemap-metadata',
      hooks: {
        'astro:config:setup': ({ config }) => {
          lastmodByUrl.clear();
          latestPostByLanguage.clear();
          alternatesByUrl.clear();
          for (const pair of Object.values(routes)) addAlternates(pair.es, pair.en);

          const blogDirectory = fileURLToPath(new URL('src/content/blog/', config.root));
          const translations = new Map();
          const includeDrafts = process.env.BLOG_INCLUDE_DRAFTS === '1';

          for (const name of readdirSync(blogDirectory)) {
            if (name.startsWith('_') || !/\.mdx?$/.test(name)) continue;
            const filePath = path.join(blogDirectory, name);
            const { data } = matter(readFileSync(filePath, 'utf8'));
            if (data.draft === true && !includeDrafts) continue;
            if (data.lang !== 'es' && data.lang !== 'en') continue;

            const slug = name.replace(/\.mdx?$/, '');
            const url = `${site}${routes.blog[data.lang]}${slug}/`;
            const lastmod = isoDate(
              data.updated ?? data.date,
              `src/content/blog/${name}`,
              data.updated ? 'updated' : 'date',
            );
            lastmodByUrl.set(url, lastmod);
            const latest = latestPostByLanguage.get(data.lang);
            if (!latest || lastmod > latest) latestPostByLanguage.set(data.lang, lastmod);

            if (typeof data.translationKey === 'string' && data.translationKey) {
              const pair = translations.get(data.translationKey) ?? {};
              pair[data.lang] = slug;
              translations.set(data.translationKey, pair);
            }
          }

          for (const pair of translations.values()) {
            if (pair.es && pair.en) {
              addAlternates(`${routes.blog.es}${pair.es}/`, `${routes.blog.en}${pair.en}/`);
            }
          }
        },
      },
    },
    serialize(item) {
      const postLastmod = lastmodByUrl.get(item.url);
      const pathname = new URL(item.url).pathname;
      const hubLanguage =
        pathname === routes.blog.es ||
        pathname.startsWith(`${routes.blog.es}serie/`) ||
        pathname.startsWith(`${routes.blog.es}tema/`)
          ? 'es'
          : pathname === routes.blog.en ||
              pathname.startsWith(`${routes.blog.en}series/`) ||
              pathname.startsWith(`${routes.blog.en}topic/`)
            ? 'en'
            : undefined;
      const lastmod = postLastmod ?? (hubLanguage ? latestPostByLanguage.get(hubLanguage) : undefined);
      if (lastmod) item.lastmod = lastmod;
      else delete item.lastmod;
      const links = alternatesByUrl.get(item.url);
      if (links) item.links = links;
      return item;
    },
  };
}
