import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/routes';
import { series, type PlannedPiece, type SeriesDefinition } from '../data/series';
import { includeDrafts } from './build-flags';

export type BlogEntry = CollectionEntry<'blog'>;

function sourceName(entry: BlogEntry): string {
  return entry.filePath ?? `src/content/blog/${entry.id}.mdx`;
}

function collectSeriesPosts(posts: BlogEntry[], seriesId: string, lang: Lang): BlogEntry[] {
  const matching = posts.filter((entry) => entry.data.series === seriesId);
  const byOrder = new Map<number, BlogEntry>();

  for (const entry of matching) {
    const order = entry.data.seriesOrder;
    if (order === undefined) continue;
    const existing = byOrder.get(order);
    if (existing) {
      throw new Error(
        `Blog series-order rule: "${sourceName(existing)}" and "${sourceName(entry)}" both declare lang="${lang}", series="${seriesId}", seriesOrder=${order}.`,
      );
    }
    byOrder.set(order, entry);
  }

  return matching.sort(
    (a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0) || a.data.date.valueOf() - b.data.date.valueOf(),
  );
}

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
  return collectSeriesPosts(posts, seriesId, lang);
}

export interface SeriesWithPosts {
  id: string;
  definition: SeriesDefinition;
  posts: BlogEntry[];
  baseGuide?: BlogEntry;
  planned: PlannedPiece[];
}

export interface TagWithCount {
  tag: string;
  count: number;
}

function assertRoutableTag(tag: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tag)) {
    throw new Error(`Blog tag "${tag}" violates the routable-tag rule: expected lowercase kebab-case.`);
  }
}

const warnedPlannedDuplicates = new Set<string>();

function availablePlanned(id: string, definition: SeriesDefinition, lang: Lang, posts: BlogEntry[]): PlannedPiece[] {
  const publishedTitles = new Set(posts.map((post) => post.data.title.trim().toLocaleLowerCase(lang)));
  return (definition.planned?.[lang] ?? []).filter((piece) => {
    if (!publishedTitles.has(piece.title.trim().toLocaleLowerCase(lang))) return true;
    const warningKey = `${lang}:${id}:${piece.title.toLocaleLowerCase(lang)}`;
    if (!warnedPlannedDuplicates.has(warningKey)) {
      console.warn(
        `Blog planned-title rule: series "${id}" (${lang}) drops planned piece "${piece.title}" because a published post has the same title.`,
      );
      warnedPlannedDuplicates.add(warningKey);
    }
    return false;
  });
}

export async function getSeriesWithPosts(lang: Lang): Promise<SeriesWithPosts[]> {
  const posts = await getPublishedPosts(lang);
  const groups: SeriesWithPosts[] = [];

  for (const [id, definition] of Object.entries(series)) {
    const seriesPosts = collectSeriesPosts(posts, id, lang);
    if (seriesPosts.length === 0) continue;

    const baseGuideSlug = definition.baseGuideSlug?.[lang];
    const baseGuide = posts.find((entry) => entry.id === baseGuideSlug);
    if (baseGuideSlug && !baseGuide) {
      throw new Error(
        `Blog series "${id}" declares baseGuideSlug.${lang}="${baseGuideSlug}", but no published ${lang} post has that slug.`,
      );
    }
    if (baseGuide?.data.series === id) {
      throw new Error(
        `Blog base-guide rule: "${sourceName(baseGuide)}" is baseGuideSlug.${lang} for series "${id}" and also declares that series; a base guide must not also be a numbered piece.`,
      );
    }
    groups.push({
      id,
      definition,
      posts: seriesPosts.filter((post) => post.id !== baseGuideSlug),
      baseGuide,
      planned: availablePlanned(id, definition, lang, baseGuide ? [...seriesPosts, baseGuide] : seriesPosts),
    });
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
