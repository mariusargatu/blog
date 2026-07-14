// LLM-as-judge bias widget: two responses say the same thing; flipping any bias
// toggle flips the "objective" judge's verdict from A to B.
  const root = document.querySelector<HTMLElement>('[data-jb]')
  if (root) {
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-jb-toggle]')]
    const cardA = root.querySelector<HTMLElement>('[data-jb-card="A"]')!
    const cardB = root.querySelector<HTMLElement>('[data-jb-card="B"]')!
    const verdict = root.querySelector<HTMLElement>('[data-jb-verdict]')!
    const active = new Set<string>()

    const labels: Record<string, string> = {
      position: 'position',
      verbosity: 'verbosity',
      self: 'self-preference',
    }

    const update = () => {
      const biasOn = active.size > 0
      cardA.classList.toggle('is-winner', !biasOn)
      cardB.classList.toggle('is-winner', biasOn)
      if (!biasOn) {
        verdict.innerHTML =
          'Verdict: <span class="text-primary">A wins</span>: the concise, correct answer. No bias active.'
      } else {
        const why = [...active].map((k) => labels[k]).join(' + ')
        verdict.innerHTML = `Verdict: <span class="text-secondary">B wins</span>, flipped by <span class="text-secondary">${why}</span>, not by being more correct.`
      }
    }

    toggles.forEach((t) =>
      t.addEventListener('click', () => {
        const k = t.dataset.jbToggle!
        if (active.has(k)) active.delete(k)
        else active.add(k)
        t.classList.toggle('on', active.has(k))
        t.setAttribute('aria-pressed', String(active.has(k)))
        update()
      }),
    )
    update()
  }

export {}
