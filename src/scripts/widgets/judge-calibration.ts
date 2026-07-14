// Judge calibration widget: toggle the rubric (naive vs corrected) and watch the same
// judge's kappa, interval floor, and per-case agreement move across the 0.60 automation bar.
  const root = document.querySelector<HTMLElement>('[data-jc]')
  if (root) {
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-jc-rubric]')]
    const rows = [...root.querySelectorAll<HTMLElement>('.jc-row')]
    const kappaEl = root.querySelector<HTMLElement>('[data-jc-kappa]')!
    const rawEl = root.querySelector<HTMLElement>('[data-jc-raw]')!
    const verdictEl = root.querySelector<HTMLElement>('[data-jc-verdict]')!
    const fillEl = root.querySelector<HTMLElement>('[data-jc-fill]')!
    const floorEl = root.querySelector<HTMLElement>('[data-jc-floor]')!
    const floorValEl = root.querySelector<HTMLElement>('[data-jc-floor-val]')!
    const captionEl = root.querySelector<HTMLElement>('[data-jc-caption]')!

    type Rubric = 'naive' | 'corrected'
    const stats: Record<Rubric, { kappa: number; floor: number; raw: string; licensed: boolean }> = {
      naive: { kappa: 0.21, floor: -0.15, raw: '61%', licensed: false },
      corrected: { kappa: 0.85, floor: 0.66, raw: '93%', licensed: true },
    }
    const caption = (r: Rubric, agree: number) =>
      r === 'naive'
        ? `Naive helpfulness rubric: Cohen's κ 0.21, not licensed (bar 0.60) — even its 95% interval floor, −0.15, sits far below the bar. Agrees with the humans on ${agree} of 28 cases; it <span class="text-error">passes the grounded-but-false answers</span> and <span class="text-error">fails the terse-but-true</span> ones.`
        : `Account-truth rubric: same judge, one rubric edit. Cohen's κ 0.85, and licensing reads the interval floor, 0.66, which clears the 0.60 bar. Agreement rises to ${agree} of 28; the grounded-but-false answers now <span class="text-primary">fail</span> and the terse-but-true ones <span class="text-primary">pass</span>.`

    let first = true
    const render = (rubric: Rubric) => {
      const s = stats[rubric]
      kappaEl.textContent = s.kappa.toFixed(2)
      rawEl.textContent = s.raw
      verdictEl.textContent = s.licensed ? 'licensed' : 'not licensed'
      verdictEl.classList.toggle('is-licensed', s.licensed)
      fillEl.style.transform = `scaleX(${s.kappa})`
      fillEl.classList.toggle('is-licensed', s.licensed)
      // the floor caret: park it at the interval's lower bound (clamped to the 0..1 track) and
      // color it by whether that floor, not the point, clears the bar
      floorValEl.textContent = s.floor.toFixed(2).replace('-', '−')
      floorEl.style.left = `${Math.max(0, Math.min(1, s.floor)) * 100}%`
      floorEl.classList.toggle('is-licensed', s.licensed)
      let agree = 0
      rows.forEach((r) => {
        const human = r.dataset.human!
        const judge = (rubric === 'naive' ? r.dataset.naive : r.dataset.corrected)!
        const mark = r.querySelector<HTMLElement>('[data-jc-judge]')!
        const prev = mark.textContent
        const next = judge === '1' ? '✓' : '✗'
        mark.textContent = next
        const ok = human === judge
        if (ok) agree++
        mark.classList.toggle('is-agree', ok)
        mark.classList.toggle('is-miss', !ok)
        // pulse the rows whose verdict actually changed, so the eye lands on what the rubric moved
        if (!first && prev !== next) {
          r.classList.remove('changed')
          void r.offsetWidth // restart the animation
          r.classList.add('changed')
        }
      })
      captionEl.innerHTML = caption(rubric, agree)
      toggles.forEach((t) => {
        const on = t.dataset.jcRubric === rubric
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
      first = false
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.jcRubric as Rubric)))
    render('naive')
  }

export {}
