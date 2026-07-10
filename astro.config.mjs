// @ts-check
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs'

const SITE = 'https://www.mariusargatu.com'

// Build a slug -> lastmod (ISO) map from blog frontmatter so the sitemap carries
// accurate <lastmod> dates. Per post: updatedDate ?? pubDate. Read at config
// load (Node build context), parsed with a light regex (no extra dep).
const BLOG_DIR = path.resolve('./src/content/blog')
function readPostLastmod() {
  const map = {}
  let latest = 0
  for (const entry of readdirSync(BLOG_DIR, { withFileTypes: true })) {
    const file = entry.isDirectory()
      ? path.join(BLOG_DIR, entry.name, 'index.mdx')
      : /\.(md|mdx)$/.test(entry.name)
        ? path.join(BLOG_DIR, entry.name)
        : null
    if (!file) continue
    const slug = entry.isDirectory() ? entry.name : entry.name.replace(/\.(md|mdx)$/, '')
    let src
    try {
      src = readFileSync(file, 'utf8')
    } catch {
      continue
    }
    const fm = src.match(/^---\n([\s\S]*?)\n---/)
    if (!fm) continue
    const raw =
      fm[1].match(/^updatedDate:\s*(.+)$/m)?.[1] ?? fm[1].match(/^pubDate:\s*(.+)$/m)?.[1]
    if (!raw) continue
    const t = new Date(raw.trim()).getTime()
    if (Number.isNaN(t)) continue
    map[slug] = new Date(t).toISOString()
    if (t > latest) latest = t
  }
  return { map, latest: latest ? new Date(latest).toISOString() : undefined }
}
const { map: POST_LASTMOD, latest: SITE_LASTMOD } = readPostLastmod()

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // No `base`: the build is served at the domain root. Personal pages live at
  // the root (/about, /philosophy); the blog (home, posts, categories, archive)
  // is namespaced under /blog/* by its route folder. The bare / redirects to
  // /blog via public/_redirects (Cloudflare Pages, a real 301).
  output: 'static',
  // Tailwind v4 is wired via postcss.config.mjs (@tailwindcss/postcss).
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      // Light theme to match the Blueprint/drafting re-skin; the `pre`
      // background is overridden to the `code-bg` token in global.css.
      theme: 'github-light',
      wrap: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      // Posts carry their own updatedDate/pubDate; other pages get the most
      // recent post date as the site's last content change.
      serialize(item) {
        const slug = new URL(item.url).pathname.match(/^\/blog\/([^/]+)\/$/)?.[1]
        const lastmod = (slug && POST_LASTMOD[slug]) || SITE_LASTMOD
        if (lastmod) item.lastmod = lastmod
        return item
      },
    }),
    // @iconify-json/material-symbols is installed, so `material-symbols:*`
    // names resolve directly — no include list needed.
    icon(),
    // MUST be last: indexes the produced dist/ after every other integration.
    pagefind(),
  ],
})
