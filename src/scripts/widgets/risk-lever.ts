// Risk lever widget: drag the range slider to set how much authority the LLM holds and watch
// the blast radius, tier color, required-rigor bar, and note scale with it.
  const root = document.querySelector<HTMLElement>('[data-rl]')
  if (root) {
    root.classList.add('is-interactive')
    const range = root.querySelector<HTMLInputElement>('[data-rl-range]')!
    const blast = root.querySelector<HTMLElement>('[data-rl-blast]')!
    const blastLabel = root.querySelector<HTMLElement>('[data-rl-blast-label]')!
    const rigor = root.querySelector<HTMLElement>('[data-rl-rigor]')!
    const bar = root.querySelector<HTMLElement>('[data-rl-bar]')!
    const note = root.querySelector<HTMLElement>('[data-rl-note]')!

    const tiers = [
      {
        max: 25,
        key: 'low',
        name: 'Low',
        note: 'LLM only presents facts pulled from a canonical source. Consistency is mechanical; evals + monitoring mostly suffice.',
      },
      {
        max: 50,
        key: 'med',
        name: 'Medium',
        note: 'LLM shapes answers from retrieved context. Add output validation and an independent source-of-truth check.',
      },
      {
        max: 75,
        key: 'high',
        name: 'High',
        note: 'LLM is largely authoritative. Independent truth, output validators, and adversarial regression are non-negotiable.',
      },
      {
        max: 101,
        key: 'max',
        name: 'Maximum',
        note: 'LLM is the authoritative source: every claim needs the full program (independent truth, output validation, adversarial + trajectory tests).',
      },
    ]

    const update = () => {
      const v = Number(range.value)
      const t = tiers.find((x) => v < x.max)!
      root.dataset.tier = t.key
      blast.style.setProperty('--s', String((40 + v * 1.1) / 160))
      blastLabel.textContent = t.name
      rigor.textContent = t.name
      bar.style.transform = `scaleX(${v / 100})`
      note.textContent = t.note
      // Announce the derived tier to screen readers instead of the raw 0-100.
      range.setAttribute('aria-valuetext', `${v} percent, ${t.name} rigor`)
    }
    const hint = root.querySelector<HTMLElement>('[data-rl-hint]')
    range.addEventListener(
      'input',
      () => hint?.classList.add('is-hidden'),
      { once: true },
    )
    range.addEventListener('input', update)
    update()
  }

export {}
