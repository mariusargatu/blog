// Trial spread: toggles between the single-run and ten-run views, recomputing the
// per-item pass rate and swapping the aria-live caption for each mode.
  const root = document.querySelector<HTMLElement>('[data-ts]')
  if (root) {
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-ts-mode]')]
    const items = [...root.querySelectorAll<HTMLElement>('[data-ts-item]')]
    const captionEl = root.querySelector<HTMLElement>('[data-ts-caption]')!

    const captions: Record<string, string> = {
      one: 'One run each, and both look like a pass. The coin flip is invisible. A single green run is a landmine labelled safe.',
      ten: 'Ten runs, and the second item shows its hand: 7 of 10. It clears pass@k (it can do the task) but fails pass^k (it cannot do it reliably). Money shaped behaviour is judged on pass^k, because "usually charges the right card" should frighten anyone who reads it slowly.',
    }

    const render = (mode: string) => {
      const ten = mode === 'ten'
      root.classList.toggle('show-ten', ten)
      items.forEach((it) => {
        const cells = [...it.querySelectorAll<HTMLElement>('.ts-cell')]
        const rateEl = it.querySelector<HTMLElement>('[data-ts-rate]')!
        const passes = cells.filter((c) => c.dataset.pass === '1').length
        rateEl.textContent = ten ? `${passes}/${cells.length}` : '1/1'
      })
      captionEl.textContent = captions[mode]
      toggles.forEach((t) => {
        const on = t.dataset.tsMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.tsMode!)))
    render('one')
  }

export {}
