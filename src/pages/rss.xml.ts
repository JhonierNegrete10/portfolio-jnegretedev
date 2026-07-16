import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { profile } from '../data/profile';
import { getUi } from '../i18n/ui';
import { blogPostPath } from '../i18n/routes';

/**
 * ES RSS feed (task 3.7 / design.md Decision 4). Valid feed even with zero
 * posts — the blog collection ships empty at launch, no fake entries.
 */
export async function GET(context: APIContext) {
  const t = getUi('es');
  const posts = await getCollection('blog', (entry) => entry.data.lang === 'es');
  const sorted = [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${profile.name} — Blog`,
    description: t.meta.home.description,
    site: context.site ?? 'https://jnegrete.dev',
    items: sorted.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: blogPostPath('es', entry.id),
      categories: entry.data.tags,
    })),
    customData: '<language>es</language>',
  });
}
