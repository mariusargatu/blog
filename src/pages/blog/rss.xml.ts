import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { postUrl } from '../../lib/url'
import { publishedPosts } from '../../lib/publishing'

export async function GET(context: APIContext) {
  // While the blog is unpublished this emits a valid, empty feed: subscribers
  // keep their subscription and simply see nothing new.
  const posts = (await publishedPosts()).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  )

  return rss({
    title: 'Marius Argatu · Blog',
    description:
      'Long-form technical writing on software testing, with a focus on AI and LLM evaluation.',
    site: context.site ?? 'https://www.mariusargatu.com',
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: postUrl(p.id),
      categories: p.data.tags,
    })),
  })
}
