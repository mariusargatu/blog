/**
 * Adds `.in-view` to `[data-inview]` elements the first time they enter the
 * viewport, so components can trigger CSS entrance animations on scroll.
 * Under reduced-motion (or no IntersectionObserver) it adds the class
 * immediately, so the final state shows without animation.
 */
export function initInView(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-inview]')
  if (els.length === 0) return

  const reduce =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in-view'))
    return
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in-view')
          obs.unobserve(e.target)
        }
      }
    },
    { threshold: 0.25 },
  )
  els.forEach((el) => io.observe(el))
}
