/**
 * Master switch for the blog, in plain JS so both the site (`src/lib/publishing.ts`)
 * and the build config (`astro.config.mjs`, for the sitemap) can read it.
 *
 * false — `/blog` shows the coming-soon notice and no post, archive, category
 * or series page is built. The MDX in `src/content/blog` stays untouched.
 * true  — the blog builds as before.
 */
export const BLOG_PUBLISHED = false
