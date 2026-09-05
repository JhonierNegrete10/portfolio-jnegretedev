import type { Lang } from "../i18n/routes";

export interface ArticleMetadata {
  publishedTime: Date;
  modifiedTime: Date;
  tags: string[];
  ogImage: string;
  canonicalOverride?: string;
}

export interface StructuredBlogPost {
  url: string;
  canonical: string;
  title: string;
  description: string;
  publishedTime: Date;
  modifiedTime: Date;
  lang: Lang;
  tags: string[];
  image: string;
  series?: { id: string; name: string };
}
