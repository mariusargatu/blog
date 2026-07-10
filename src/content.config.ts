import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'

/**
 * Blog posts: one folder per post under src/content/blog/<slug>/index.mdx,
 * with an optional co-located cover image. Frontmatter is validated by Zod —
 * a bad/missing field fails the build instead of shipping broken metadata.
 *
 * `pubDate` is author-controlled: set any past date to backdate a post and it
 * sorts into history correctly. `updatedDate` keeps "edited" distinct from
 * "published".
 */
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
    // Folder-per-post: `<slug>/index.mdx` -> id `<slug>` (drops `/index`),
    // while flat `<slug>.mdx` still works.
    generateId: ({ entry }) => entry.replace(/(\/index)?\.(md|mdx)$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      description: z.string().max(320),
      kicker: z.string().default('ENGINEERING'),
      // Primary grouping on the homepage. Keep to a small, stable set.
      topic: z.string().default('General'),
      author: z.string().default('Marius Argatu'),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      // In-article hero (rendered at the top of the post).
      coverImage: image().optional(),
      coverImageAlt: z.string().optional(),
      // Social share card for og:image / twitter:image ONLY. Use this for cards
      // that bake in the title so the article body doesn't duplicate the H1.
      // Falls back to coverImage when unset.
      ogImage: image().optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      // Optional ordered series membership. The series lives under the post's
      // `topic` category; `order` is the 1-based part number within the series.
      series: z
        .object({
          name: z.string(),
          order: z.number().int().positive(),
          // Optional git tag in the series' companion repo that freezes this
          // part's code. Builds the per-part "GitHub Code" link to /tree/<code>.
          code: z.string().optional(),
        })
        .optional(),
      // Optional FAQ pairs: rendered visibly in-article and emitted as FAQPage
      // JSON-LD. Keep the visible copy in sync with these strings.
      faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
      // Optional one-line CTA bridge shown above the hire card at the article's
      // end, tailored to what this specific post just argued.
      ctaNote: z.string().optional(),
    }),
})

export const collections = { blog }
