import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { series } from '../src/data/series.ts';
import { PAGE_SIZE } from '../src/lib/blog-constants.ts';

function isoDate(value, filePath, field) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) {
    throw new Error(`Invalid blog ${field} in "${filePath}": expected a valid date.`);
  }
  return parsed.toISOString();
}

function newest(posts) {
  return posts.reduce((latest, post) => (!latest || post.lastmod > latest ? post.lastmod : latest), undefined);
}

export default function blogSitemap({ site, routes }) {
  const lastmodByUrl = new Map();
  const alternatesByUrl = new Map();
  const noindexUrls = new Set();

  function addAlternates(esPath, enPath) {
    const links = [
      { lang: 'es-CO', url: `${site}${esPath}` },
      { lang: 'en-US', url: `${site}${enPath}` },
      { lang: 'x-default', url: `${site}${esPath}` },
    ];
    alternatesByUrl.set(`${site}${esPath}`, links);
    alternatesByUrl.set(`${site}${enPath}`, links);
  }

  function filter(page) {
    return !noindexUrls.has(page);
  }

  return {
    integration: {
      name: 'blog-sitemap-metadata',
      hooks: {
        'astro:config:setup': ({ config }) => {
          lastmodByUrl.clear();
          alternatesByUrl.clear();
          noindexUrls.clear();
          for (const pair of Object.values(routes)) addAlternates(pair.es, pair.en);

          const blogDirectory = fileURLToPath(new URL('src/content/blog/', config.root));
          const translations = new Map();
          const includeDrafts = process.env.BLOG_INCLUDE_DRAFTS === '1';
          const posts = [];

          for (const name of readdirSync(blogDirectory)) {
            if (name.startsWith('_') || !/\.mdx?$/.test(name)) continue;
            const relativePath = `src/content/blog/${name}`;
            const { data } = matter(readFileSync(path.join(blogDirectory, name), 'utf8'));
            if (data.draft === true && !includeDrafts) continue;
            if (data.lang !== 'es' && data.lang !== 'en') continue;

            const slug = name.replace(/\.mdx?$/, '');
            const lastmod = isoDate(data.updated ?? data.date, relativePath, data.updated ? 'updated' : 'date');
            const post = {
              slug,
              lang: data.lang,
              tags: Array.isArray(data.tags) ? data.tags : [],
              series: data.series,
              date: isoDate(data.date, relativePath, 'date'),
              lastmod,
            };
            posts.push(post);
            lastmodByUrl.set(`${site}${routes.blog[data.lang]}${slug}/`, lastmod);

            if (typeof data.translationKey === 'string' && data.translationKey) {
              const pair = translations.get(data.translationKey) ?? {};
              pair[data.lang] = slug;
              translations.set(data.translationKey, pair);
            }
          }

          for (const lang of ['es', 'en']) {
            const languagePosts = posts
              .filter((post) => post.lang === lang)
              .sort((a, b) => b.date.localeCompare(a.date));

            for (let offset = 0; offset < languagePosts.length; offset += PAGE_SIZE) {
              const page = offset / PAGE_SIZE + 1;
              const pagePath = page === 1 ? routes.blog[lang] : `${routes.blog[lang]}${page}/`;
              lastmodByUrl.set(`${site}${pagePath}`, newest(languagePosts.slice(offset, offset + PAGE_SIZE)));
            }

            const topicGroups = new Map();
            for (const post of languagePosts) {
              for (const tag of post.tags) {
                const tagged = topicGroups.get(tag) ?? [];
                tagged.push(post);
                topicGroups.set(tag, tagged);
              }
            }
            for (const [tag, tagged] of topicGroups) {
              const prefix = lang === 'es' ? `${routes.blog.es}tema/` : `${routes.blog.en}topic/`;
              const url = `${site}${prefix}${tag}/`;
              lastmodByUrl.set(url, newest(tagged));
              if (tagged.length === 1) noindexUrls.add(url);
            }

            for (const [seriesId, definition] of Object.entries(series)) {
              const numbered = languagePosts.filter((post) => post.series === seriesId);
              if (numbered.length === 0) continue;
              const baseSlug = definition.baseGuideSlug?.[lang];
              const baseGuide = baseSlug ? languagePosts.find((post) => post.slug === baseSlug) : undefined;
              const listed = baseGuide ? [...numbered.filter((post) => post.slug !== baseSlug), baseGuide] : numbered;
              const prefix = lang === 'es' ? `${routes.blog.es}serie/` : `${routes.blog.en}series/`;
              const url = `${site}${prefix}${seriesId}/`;
              lastmodByUrl.set(url, newest(listed));
              if (listed.length === 1) noindexUrls.add(url);
            }
          }

          for (const pair of translations.values()) {
            if (pair.es && pair.en) addAlternates(`${routes.blog.es}${pair.es}/`, `${routes.blog.en}${pair.en}/`);
          }
        },
      },
    },
    filter,
    serialize(item) {
      // astro.config already delegates serialization to this state object;
      // applying the same filter here keeps noindex URLs out without changing it.
      if (!filter(item.url)) return undefined;
      const lastmod = lastmodByUrl.get(item.url);
      if (lastmod) item.lastmod = lastmod;
      else delete item.lastmod;
      const links = alternatesByUrl.get(item.url);
      if (links) item.links = links;
      return item;
    },
  };
}
