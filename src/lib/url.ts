// Base-aware URL helpers. import.meta.env.BASE_URL is the site base (here "/",
// no base), so links work without hardcoding the origin. Personal pages live
// at the root (/about, /philosophy); the blog is namespaced under /blog/*.

const BASE = import.meta.env.BASE_URL

/** Prefix a path with the site base, collapsing duplicate slashes. */
export function withBase(path = ''): string {
  return `${BASE}/${path}`.replace(/\/{2,}/g, '/')
}

/** The blog landing page (the site's primary entry; / redirects here). */
export function homeUrl(): string {
  return withBase('blog/')
}

/** The blog RSS feed. */
export function rssUrl(): string {
  return withBase('blog/rss.xml')
}

/** Canonical URL for a blog post by its collection id (namespaced under /blog). */
export function postUrl(id: string): string {
  return withBase(`blog/${id}/`)
}

/** Slugify a display name, e.g. "GenAI" -> "genai", "LLM Apps" -> "llm-apps". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Back-compat alias for category slugs. */
export const slugifyCategory = slugify

/** URL for a category index page (namespaced under /blog). */
export function categoryUrl(name: string): string {
  return withBase(`blog/category/${slugify(name)}/`)
}

/** URL for a series index page (namespaced under /blog). */
export function seriesUrl(name: string): string {
  return withBase(`blog/series/${slugify(name)}/`)
}
