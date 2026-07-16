import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog posts: one Markdown file per post per language in src/content/blog/.
 * This collection is intentionally empty at launch — no fake/placeholder
 * posts (design.md Non-Goals). The blog page renders a "coming soon"
 * state until real posts are added.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['es', 'en']),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    /** Links a post to its translation counterpart's slug, if one exists. */
    translationKey: z.string().optional(),
  }),
});

export const collections = { blog };
