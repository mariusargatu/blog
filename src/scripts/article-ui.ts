import { computeProgress } from '../lib/reading-progress'

/**
 * Reading-progress bar: writes the scroll fraction into the `--read-progress`
 * CSS custom property (the bar scales via transform in base.css). rAF-throttled
 * so scroll handling stays cheap.
 */
export function initReadingProgress(bar: HTMLElement): void {
  let ticking = false

  const update = () => {
    const doc = document.documentElement
    const progress = computeProgress(
      doc.scrollTop || document.body.scrollTop,
      doc.scrollHeight,
      doc.clientHeight,
    )
    bar.style.setProperty('--read-progress', String(progress))
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
}

/**
 * TOC active-link sync: marks the link for the heading currently in view with
 * `aria-current="true"` so it can be highlighted. Uses one IntersectionObserver
 * over the article's headings.
 */
export function initTocSync(
  links: NodeListOf<HTMLAnchorElement> | HTMLAnchorElement[],
): void {
  const linkList = Array.from(links)
  if (linkList.length === 0) return

  const byId = new Map<string, HTMLAnchorElement>()
  const targets: HTMLElement[] = []

  for (const link of linkList) {
    const id = decodeURIComponent(link.hash.replace(/^#/, ''))
    const el = id ? document.getElementById(id) : null
    if (el) {
      byId.set(id, link)
      targets.push(el)
    }
  }
  if (targets.length === 0) return

  const setActive = (id: string) => {
    for (const link of linkList) link.removeAttribute('aria-current')
    byId.get(id)?.setAttribute('aria-current', 'true')
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible?.target.id) setActive(visible.target.id)
    },
    { rootMargin: '0px 0px -70% 0px', threshold: 0 },
  )

  targets.forEach((t) => observer.observe(t))
}
