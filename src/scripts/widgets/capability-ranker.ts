// CapabilityRanker widget: set each capability's consequence and FLIP-animate
// the list re-ranking, lighting the top three with the patterns they need.
  const root = document.querySelector<HTMLElement>('[data-cr]')
  if (root) {
    const list = root.querySelector<HTMLElement>('[data-cr-list]')!
    const rows = [...root.querySelectorAll<HTMLElement>('[data-cr-row]')]
    const status = root.querySelector<HTMLElement>('[data-cr-status]')!
    const weight: Record<string, number> = { high: 0, med: 1, low: 2 }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const recompute = (announce = false) => {
      // FLIP, First: record each row's current position before reordering.
      const first = new Map(rows.map((r) => [r, r.getBoundingClientRect().top]))

      const ranked = rows
        .map((el, i) => ({ el, i, c: el.dataset.consequence! }))
        .sort((a, b) => weight[a.c] - weight[b.c] || a.i - b.i)

      ranked.forEach((r, rank) => {
        // Reorder the DOM (not CSS `order`), so keyboard tab order and the
        // screen-reader reading order match the visible rank.
        list.appendChild(r.el)
        const isTop = rank < 3
        r.el.classList.toggle('is-top', isTop)
        r.el.classList.toggle('is-low', !isTop)
        const rankEl = r.el.querySelector<HTMLElement>('[data-cr-rank]')!
        rankEl.textContent = String(rank + 1).padStart(2, '0')
      })

      if (announce) {
        const top3 = ranked
          .slice(0, 3)
          .map((r) => r.el.querySelector('p')!.textContent!.trim())
        status.textContent = `Re-ranked. Testing starts with: ${top3.join('; ')}.`
      }

      if (reduce) return
      // Last + Invert + Play: glide each row from its old slot to the new one.
      rows.forEach((r) => {
        const dy = first.get(r)! - r.getBoundingClientRect().top
        if (!dy) return
        r.style.transition = 'none'
        r.style.transform = `translateY(${dy}px)`
        requestAnimationFrame(() => {
          r.style.transition = 'transform var(--dur-3) var(--ease-out-quint)'
          r.style.transform = ''
        })
      })
    }

    rows.forEach((row) => {
      const btns = [...row.querySelectorAll<HTMLButtonElement>('[data-cr-lvl]')]
      btns.forEach((b) =>
        b.addEventListener('click', () => {
          row.dataset.consequence = b.dataset.crLvl
          btns.forEach((x) => {
            x.classList.toggle('cr-lvl-on', x === b)
            x.setAttribute('aria-pressed', String(x === b))
          })
          recompute(true)
        }),
      )
    })

    list.style.display = 'flex'
    list.style.flexDirection = 'column'
    recompute()
  }

export {}
