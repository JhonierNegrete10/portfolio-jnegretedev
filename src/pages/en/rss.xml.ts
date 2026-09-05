import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { profile } from '../../data/profile';
import { getUi } from '../../i18n/ui';
import { blogPostPath } from '../../i18n/routes';
import { getPublishedPosts } from '../../lib/blog';
import { createRssContainer, renderRssContent } from '../../lib/blog-rss';

/**
 * EN RSS feed (task 3.7 / design.md Decision 4). Valid feed even with zero
 * posts — the blog collection ships empty at launch, no fake entries.
 */
export async function GET(context: APIContext) {
  const t = getUi('en');
  const posts = await getPublishedPosts('en');
  const container = await createRssContainer();
  const site = context.site ?? new URL('https://jnegrete.dev');
  const items = await Promise.all(
    posts.map(async (entry) => {
      const postUrl = new URL(blogPostPath('en', entry.id), site).toString();
      return {
        title: entry.data.title,
        description: entry.data.description,
        pubDate: entry.data.date,
        link: postUrl,
        categories: entry.data.tags,
        content: await renderRssContent(container, entry, postUrl),
      };
    }),
  );

  return rss({
    title: `${profile.name} — Blog`,
    description: t.meta.home.description,
    site,
    items,
    customData: '<language>en-us</language>',
  });
}
