import { getCollection, type CollectionEntry } from 'astro:content'
import { BLOG_PUBLISHED } from './blog-published.mjs'

/**
 * Re-exported from `blog-published.mjs`, which the Astro config also reads.
 * Flip it there to bring the writing back — every route reads its posts through
 * `publishedPosts()`, so nothing else needs to change.
 */
export { BLOG_PUBLISHED }

/**
 * Every post that should be built, newest-first order left to the caller.
 * Drafts are excluded in production only, so they remain previewable in dev.
 */
export async function publishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  if (!BLOG_PUBLISHED) return []
  return getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  )
}
