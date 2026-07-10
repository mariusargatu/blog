# mariusargatu.com

Source for my personal site and blog — long-form technical writing on software
testing, with a focus on AI / LLM evaluation. Built with [Astro](https://astro.build/)
as a static site.

Live at **https://www.mariusargatu.com/blog**.

## Stack

- **Astro** (static output) with **MDX** for article authoring
- **Tailwind CSS v4** wired through PostCSS (`@tailwindcss/postcss`)
- **Pagefind** for fully static client-side search
- `@astrojs/rss` + `@astrojs/sitemap` for feed and sitemap
- `astro-icon` with Material Symbols
- Self-hosted variable fonts via Fontsource

## Structure

```text
src/
├── components/        UI + per-article MDX explainer components
├── content/blog/      one folder per post: <slug>/index.mdx (+ co-located images)
├── content.config.ts  Zod-validated frontmatter schema
├── layouts/           Base / Article / Docs layouts
├── lib/               categories, TOC, reading-time, url helpers
├── pages/             routes (home, about, blog/*, rss, 404, ...)
├── scripts/           progressive-enhancement client scripts
└── styles/            global tokens + base styles
public/                favicon, robots.txt, static assets
```

Posts live at `src/content/blog/<slug>/index.mdx`. Frontmatter is validated by
Zod at build time — a missing or malformed field fails the build instead of
shipping broken metadata.

## Commands

Run from the project root:

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Dev server at `localhost:4321`              |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview the production build locally        |
| `npm run check`   | Run `astro check` (type / content checks)   |

Requires Node `>=22.12.0` (see `.nvmrc`).

## Deploy

Hosted on **Cloudflare Pages** via Git integration — every push to the default
branch triggers a build and deploy. Build settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: read from `.nvmrc`

`public/_redirects` is picked up by Cloudflare Pages at the platform level. The
custom domain is configured in the Pages project (Custom domains).

## License

No license. The code and writing in this repository are published for reading
only — all rights reserved. Reuse is not granted.
