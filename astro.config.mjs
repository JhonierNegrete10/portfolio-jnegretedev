import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { routes } from './src/i18n/routes.ts';

const SITE = 'https://jnegrete.dev';

// hreflang alternates per absolute URL, built from the slug matrix in
// src/i18n/routes.ts. The sitemap integration's own `i18n` option only pairs
// same-slug URLs, which misses translated slugs (/proyectos/ vs /en/projects/),
// so the alternates are emitted here instead.
const alternatesByUrl = new Map();
for (const pair of Object.values(routes)) {
  const links = [
    { lang: 'es-CO', url: `${SITE}${pair.es}` },
    { lang: 'en-US', url: `${SITE}${pair.en}` },
    { lang: 'x-default', url: `${SITE}${pair.es}` },
  ];
  alternatesByUrl.set(`${SITE}${pair.es}`, links);
  alternatesByUrl.set(`${SITE}${pair.en}`, links);
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      serialize(item) {
        const links = alternatesByUrl.get(item.url);
        if (links) item.links = links;
        return item;
      },
    }),
  ],
});
