import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/routes';
import { series, type SeriesDefinition } from '../data/series';
import { includeDrafts } from './build-flags';

export type BlogEntry = CollectionEntry<'blog'>;

export async function getPublishedPosts(lang: Lang): Promise<BlogEntry[]> {
  const posts = await getCollection('blog', (entry) => entry.data.lang === lang);
  return posts
    .filter((entry) => includeDrafts() || !entry.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPostBySlug(slug: string, lang: Lang): Promise<BlogEntry | undefined> {
  const posts = await getPublishedPosts(lang);
  return posts.find((entry) => entry.id === slug);
}

export async function getSeriesPosts(seriesId: string, lang: Lang): Promise<BlogEntry[]> {
  const posts = await getPublishedPosts(lang);
  return posts
    .filter((entry) => entry.data.series === seriesId)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export interface SeriesWithPosts {
  id: string;
  definition: SeriesDefinition;
  posts: BlogEntry[];
  baseGuide?: BlogEntry;
}

export interface TagWithCount {
  tag: string;
  count: number;
}

function assertRoutableTag(tag: string): void {
  if (/\s/.test(tag)) {
    throw new Error(`Blog tag "${tag}" cannot contain spaces because tags are used verbatim in topic URLs.`);
  }
}

export async function getSeriesWithPosts(lang: Lang): Promise<SeriesWithPosts[]> {
  const posts = await getPublishedPosts(lang);
  const groups: SeriesWithPosts[] = [];

  for (const [id, definition] of Object.entries(series)) {
    const seriesPosts = posts
      .filter((entry) => entry.data.series === id)
      .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
    if (seriesPosts.length === 0) continue;

    const baseGuideSlug = definition.baseGuideSlug?.[lang];
    const baseGuide = posts.find((entry) => entry.id === baseGuideSlug);
    if (baseGuideSlug && !baseGuide) {
      throw new Error(
        `Blog series "${id}" declares baseGuideSlug.${lang}="${baseGuideSlug}", but no published ${lang} post has that slug.`,
      );
    }
    groups.push({ id, definition, posts: seriesPosts, baseGuide });
  }

  return groups;
}

export async function getTagsWithCounts(lang: Lang): Promise<TagWithCount[]> {
  const counts = new Map<string, number>();
  for (const post of await getPublishedPosts(lang)) {
    for (const tag of post.data.tags) {
      assertRoutableTag(tag);
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string, lang: Lang): Promise<BlogEntry[]> {
  assertRoutableTag(tag);
  return (await getPublishedPosts(lang)).filter((entry) => entry.data.tags.includes(tag));
}

export async function getTranslation(entry: BlogEntry): Promise<BlogEntry | undefined> {
  if (!entry.data.translationKey) return undefined;
  const targetLang: Lang = entry.data.lang === 'es' ? 'en' : 'es';
  const posts = await getPublishedPosts(targetLang);
  return posts.find((candidate) => candidate.data.translationKey === entry.data.translationKey);
}

export function readingMinutes(body: string | undefined): number {
  const wordCount = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(wordCount / 200));
}
