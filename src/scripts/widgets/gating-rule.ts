// Gating-rule toggle on Atlas's real retrieval gate: gate on the point (0.3468 clears the 0.300
// bar) vs the Wilson lower bound (0.2687 does not), with the reading marker sliding between the
// two. Keep in step with GatingRule.astro and with the tail of
// `uv run python -m evals.measure_retrieval`.
  const root = document.querySelector<HTMLElement>('[data-gr]')
  if (root) {
    const THRESHOLD = 0.3
    const POINT = 0.3468
    const LO = 0.2687
    const D0 = 0.2
    const SPAN = 0.5 - D0
    const pos = (x: number) => ((x - D0) / SPAN) * 100

    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-gr-mode]')]
    const readEl = root.querySelector<HTMLElement>('[data-gr-read]')!
    const verdictEl = root.querySelector<HTMLElement>('[data-gr-verdict]')!
    const captionEl = root.querySelector<HTMLElement>('[data-gr-caption]')!

    const captions: Record<string, string> = {
      point:
        'Gate on the point: 0.3468 clears the 0.300 bar, so it ships. That is shipping on the best guess, with an honest floor sitting below the line.',
      floor:
        'Gate on the lower bound: the floor is 0.2687, below the 0.300 bar, so the gate fails closed. "We cannot tell yet" is the only safe reading of a number that might be noise. This is what `uv run python -m evals.measure_retrieval` prints today, on real data, with nothing arranged. Tighten the variance budget from 0.20 to 0.10 and the same measurement stops being a FAIL and becomes a QUARANTINE, because an interval 0.165 wide is too wide to decide anything with.',
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
