// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs'

const SITE = 'https://www.mariusargatu.com'

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
    sitemap(),
    // @iconify-json/material-symbols is installed, so `material-symbols:*`
    // names resolve directly — no include list needed.
    icon(),
    // MUST be last: indexes the produced dist/ after every other integration.
    pagefind(),
  ],
})
