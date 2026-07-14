// @ts-check
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
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

// Emit dist/_headers (Cloudflare) with a strict CSP. Astro inlines a few small
// scripts from shared layout components; their hashes are computed from the
// built HTML so the policy never drifts out of sync when those components
// change. Runs at build:done over the final dist/ (after every integration).
// Cloudflare rejects any single line in `_headers` over this many characters
// (error code 100324). The CSP line is the only one that can grow, so we guard
// it at build time — a loud local failure beats a silent production rejection.
const CF_HEADER_LINE_LIMIT = 2000

function securityHeaders() {
  // Capture the opening tag's attributes (group 1) alongside the body (group 2)
  // so we can skip non-executable blocks below.
  const INLINE_SCRIPT = /<script((?![^>]*\bsrc=)[^>]*)>([\s\S]*?)<\/script>/g
  // CSP `script-src` only governs scripts the browser executes. A `type` that
  // is absent or a JS/module type is executable; anything else (notably
  // application/ld+json schema blocks, importmaps, speculationrules) is data
  // and is exempt — hashing it just bloats the header until it breaches the
  // Cloudflare line limit.
  const EXECUTABLE_TYPE = /^(?:text\/javascript|application\/javascript|module)$/i
  const isExecutable = (attrs) => {
    const type = attrs.match(/\btype\s*=\s*["']([^"']*)["']/i)
    return !type || EXECUTABLE_TYPE.test(type[1].trim())
  }
  function collectHashes(dir, hashes) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) collectHashes(full, hashes)
      else if (entry.name.endsWith('.html')) {
        const html = readFileSync(full, 'utf8')
        for (const m of html.matchAll(INLINE_SCRIPT)) {
          if (!isExecutable(m[1])) continue
          const digest = createHash('sha256').update(m[2], 'utf8').digest('base64')
          hashes.add(`'sha256-${digest}'`)
        }
      }
    }
    return hashes
  }
  return {
    name: 'security-headers',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const out = fileURLToPath(dir)
        const scriptHashes = [...collectHashes(out, new Set())].sort()
        // Cloudflare Web Analytics beacon is the only cross-origin script.
        const csp = [
          "default-src 'self'",
          `script-src 'self' https://static.cloudflareinsights.com ${scriptHashes.join(' ')}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self' https://cloudflareinsights.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
        ].join('; ')
        const headers = [
          '/*',
          `  Content-Security-Policy: ${csp}`,
          '  X-Content-Type-Options: nosniff',
          '  Referrer-Policy: strict-origin-when-cross-origin',
          '  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
          '  Permissions-Policy: geolocation=(), camera=(), microphone=()',
          '',
        ].join('\n')
        const overLimit = headers
          .split('\n')
          .find((line) => line.length > CF_HEADER_LINE_LIMIT)
        if (overLimit) {
          throw new Error(
            `_headers line exceeds Cloudflare's ${CF_HEADER_LINE_LIMIT}-char limit ` +
              `(${overLimit.length} chars). The CSP hash list has grown too large — ` +
              `externalize inline scripts so 'self' covers them, or trim the policy.\n` +
              `Offending line starts: ${overLimit.slice(0, 80)}…`,
          )
        }
        writeFileSync(path.join(out, '_headers'), headers)
      },
    },
  }
}

// https://astro.build/config
export default defineConfig({
  site: SITE,
  // No `base`: the build is served at the domain root. Personal pages live at
  // the root (/about, /philosophy); the blog (home, posts, categories, archive)
  // is namespaced under /blog/* by its route folder. The bare / redirects to
  // /blog via public/_redirects (Cloudflare Pages, a real 301).
  output: 'static',
  // The site root has no page of its own. This build-time redirect emits a
  // static `/index.html` so `/` resolves to the blog in dev, `astro preview`,
  // and any host. In production, Cloudflare's `dist/_redirects` (a real 301)
  // is evaluated first; this is the universal fallback for everywhere else.
  redirects: { '/': '/blog/' },
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
    // After pagefind so the CSP hashes cover the final emitted HTML.
    securityHeaders(),
  ],
})
