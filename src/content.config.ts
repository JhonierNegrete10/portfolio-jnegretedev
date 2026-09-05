import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { series } from './data/series';

const BLOG_DIRECTORY = fileURLToPath(new URL('./content/blog/', import.meta.url));

function assertFlatBlogContent(directory: string, relativeDirectory = ''): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      assertFlatBlogContent(absolutePath, relativePath);
      continue;
    }

    if (relativeDirectory && /\.mdx?$/i.test(entry.name)) {
      throw new Error(
        `Blog content file "src/content/blog/${relativePath}" violates the flat-content rule: .md and .mdx posts must live directly in src/content/blog/. Subdirectories may contain images only.`,
      );
    }
  }
}

assertFlatBlogContent(BLOG_DIRECTORY);

/**
 * Blog posts: one Markdown file per post per language in src/content/blog/.
 * Underscore-prefixed fixtures are excluded by the loader. Draft entries stay
 * available for explicit local preview builds without entering production.
 */
const blog = defineCollection({
  loader: glob({
    pattern: ['*.{md,mdx}', '!_*.{md,mdx}'],
    base: './src/content/blog',
    generateId: ({ entry }) => {
      const slug = entry.replace(/\.mdx?$/, '');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(
          `Blog content file "src/content/blog/${entry}" has invalid slug "${slug}": filenames must match ^[a-z0-9]+(-[a-z0-9]+)*$.`,
        );
      }
      return slug;
    },
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().trim().min(1, 'title must not be empty'),
        description: z
          .string()
          .min(80, 'description must contain at least 80 characters')
          .max(160, 'description must contain at most 160 characters'),
        date: z.coerce.date(),
        lang: z.enum(['es', 'en']),
        tags: z
          .array(
            z
              .string()
              .trim()
              .min(1, 'tags must not contain empty strings')
              .refine((tag) => tag === tag.toLowerCase(), 'tags must contain lowercase strings'),
          )
          .min(1, 'tags must contain at least one item')
          .max(6, 'tags must contain at most six items')
          .refine((tags) => new Set(tags).size === tags.length, 'tags must not contain duplicates'),
        updated: z.coerce.date().optional(),
        series: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'series must be kebab-case')
          .optional(),
        seriesOrder: z.number().int().min(1).optional(),
        translationKey: z.string().min(1).optional(),
        draft: z.boolean().default(false),
        cover: z
          .object({
            src: image(),
            alt: z.string().trim().min(1, 'cover.alt must not be empty'),
          })
          .optional(),
        canonical: z.string().url().optional(),
        prerequisites: z.array(z.string()).optional(),
        limits: z.array(z.string()).optional(),
        nextStep: z.object({ label: z.string().min(1), href: z.string().min(1) }).optional(),
      })
      .refine((data) => (data.series === undefined) === (data.seriesOrder === undefined), {
        message: 'series and seriesOrder must both be present or both be absent',
        path: ['series'],
      })
      .refine((data) => data.series === undefined || Object.hasOwn(series, data.series), {
        message: 'series must reference an id declared in src/data/series.ts',
        path: ['series'],
      }),
});

export const collections = { blog };
