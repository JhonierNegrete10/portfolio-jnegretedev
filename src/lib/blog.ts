import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/routes";

export type BlogEntry = CollectionEntry<"blog">;

function includesDrafts(): boolean {
  return !import.meta.env.PROD || import.meta.env.BLOG_INCLUDE_DRAFTS === "1";
}

export async function getPublishedPosts(lang: Lang): Promise<BlogEntry[]> {
  const posts = await getCollection(
    "blog",
    (entry) => entry.data.lang === lang,
  );
  return posts
    .filter((entry) => includesDrafts() || !entry.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPostBySlug(
  slug: string,
  lang: Lang,
): Promise<BlogEntry | undefined> {
  const posts = await getPublishedPosts(lang);
  return posts.find((entry) => entry.id === slug);
}

export async function getSeriesPosts(
  seriesId: string,
  lang: Lang,
): Promise<BlogEntry[]> {
  const posts = await getPublishedPosts(lang);
  return posts
    .filter((entry) => entry.data.series === seriesId)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export async function getTranslation(
  entry: BlogEntry,
): Promise<BlogEntry | undefined> {
  if (!entry.data.translationKey) return undefined;
  const targetLang: Lang = entry.data.lang === "es" ? "en" : "es";
  const posts = await getPublishedPosts(targetLang);
  return posts.find(
    (candidate) => candidate.data.translationKey === entry.data.translationKey,
  );
}

export function readingMinutes(body: string | undefined): number {
  const wordCount = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return Math.max(1, Math.round(wordCount / 200));
}
