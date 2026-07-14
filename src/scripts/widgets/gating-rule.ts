// Gating-rule toggle: gate on the point (0.81 ships) vs the Wilson lower bound
// (0.722 holds), with the reading marker sliding between the two.
  const root = document.querySelector<HTMLElement>('[data-gr]')
  if (root) {
    const THRESHOLD = 0.8
    const POINT = 0.81
    const LO = 0.722
    const D0 = 0.65
    const SPAN = 1.0 - D0
    const pos = (x: number) => ((x - D0) / SPAN) * 100

    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-gr-mode]')]
    const readEl = root.querySelector<HTMLElement>('[data-gr-read]')!
    const verdictEl = root.querySelector<HTMLElement>('[data-gr-verdict]')!
    const captionEl = root.querySelector<HTMLElement>('[data-gr-caption]')!

    const captions: Record<string, string> = {
      point:
        'Gate on the point: 0.81 clears the 0.80 bar, so it ships. That is shipping on the best guess, with an honest floor sitting far below the line.',
      floor:
        'Gate on the lower bound: the floor is 0.722, below the 0.80 bar, so the release holds. "We cannot tell yet" fails closed, which is the only safe direction for a number that might be noise. This is the committed verdict, not an illustration.',
    }

    const render = (mode: string) => {
      const checked = mode === 'point' ? POINT : LO
      const pass = checked >= THRESHOLD
      readEl.style.left = `${pos(checked)}%`
      root.dataset.pass = String(pass)
      verdictEl.textContent = pass ? 'ship' : 'hold'
      captionEl.textContent = captions[mode]
      toggles.forEach((t) => {
        const on = t.dataset.grMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.grMode!)))
    render('point')
  }

export {}
