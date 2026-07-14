// Stakes escalator: counts up only tiers with a real numeric value (the $812
// ruling) on scroll into view, leaving the illustrative range tiers untouched.
  const root = document.querySelector<HTMLElement>('[data-stakes]')
  if (root) {
    const fmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
    // Only count up tiers with a real numeric value (the $812 ruling). The
    // "plausible" range tiers ($1M-5M, $10M-100M+) keep their text untouched, so
    // the widget never animates invented dollars as if they were measured.
    const nums = [...root.querySelectorAll<HTMLElement>('[data-stk-num]')].filter(
      (n) => Number(n.dataset.value) > 0,
    )
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce) nums.forEach((n) => (n.textContent = fmt.format(0)))

    const countUp = (el: HTMLElement, to: number) => {
      if (reduce) {
        el.textContent = fmt.format(to)
        return
      }
      const dur = 1100
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        el.textContent = fmt.format(Math.round(to * eased))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            obs.disconnect()
            root.classList.add('in-view')
            nums.forEach((n) => countUp(n, Number(n.dataset.value)))
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(root)
  }

export {}
