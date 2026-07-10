/**
 * Reveal-on-scroll: adds `.is-visible` to `[data-reveal]` elements the first
 * time they enter the viewport, then stops observing them. When the user
 * prefers reduced motion the CSS keeps elements visible, so this is a no-op
 * enhancement either way.
 */
export function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (els.length === 0) return

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          obs.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.1 },
  )

  els.forEach((el) => observer.observe(el))
}
