import type { CollectionEntry } from 'astro:content'

type Post = CollectionEntry<'blog'>

export interface Series {
  name: string
  blurb: string
}

/**
 * Series registry: the display blurb for each series, keyed by `name`.
 * Everything else (membership, part order, parent category) is derived from
 * post frontmatter so there is a single source of truth and nothing can drift.
 * A post's `series.name` must match one of these `name` values.
 */
export const SERIES: Series[] = [
  {
    name: 'Evals Are Checks, Not Tests',
    blurb:
      'A hands-on series on testing GenAI like real software — where eval dashboards stop and classical testing discipline takes over.',
  },
]

/** Registry blurb for a series, or '' when none is registered. */
export function seriesBlurb(name: string): string {
  return SERIES.find((s) => s.name === name)?.blurb ?? ''
}

/** Members of a series, sorted by their 1-based part order ascending. */
export function postsInSeries(posts: Post[], name: string): Post[] {
  return posts
    .filter((p) => p.data.series?.name === name)
    .sort((a, b) => (a.data.series?.order ?? 0) - (b.data.series?.order ?? 0))
}

/** The parent category (topic) of a series, taken from its members. */
export function categoryOfSeries(posts: Post[], name: string): string | undefined {
  return posts.find((p) => p.data.series?.name === name)?.data.topic
}

/** Most recent pubDate among a series' members (newest-first sort key). */
function latestPubDate(posts: Post[], name: string): number {
  return postsInSeries(posts, name).reduce(
    (max, p) => Math.max(max, p.data.pubDate.getTime()),
    0,
  )
}

/** Distinct series names across all posts, newest series first. */
export function allSeriesNames(posts: Post[]): string[] {
  const names = [
    ...new Set(
      posts
        .map((p) => p.data.series?.name)
        .filter((n): n is string => Boolean(n)),
    ),
  ]
  return names.sort((a, b) => latestPubDate(posts, b) - latestPubDate(posts, a))
}

/** Distinct series names within one category, newest series first. */
export function seriesNamesInCategory(posts: Post[], category: string): string[] {
  const inCategory = posts.filter((p) => p.data.topic === category)
  return allSeriesNames(inCategory)
}
