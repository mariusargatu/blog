import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { postUrl } from '../../lib/url'

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
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
