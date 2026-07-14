// Faithful-is-not-true toggle: flips the suite between "faithfulness only" and
// "+ correctness", showing the same answer signed off green vs caught red.
  const root = document.querySelector<HTMLElement>('[data-ft]')
  if (root) {
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-ft-mode]')]
    const verdictEl = root.querySelector<HTMLElement>('[data-ft-verdict]')!

    const captions: Record<string, string> = {
      faith:
        'A suite that grades faithfulness only signs this answer off: 1.0, green, next case. The false answer ships, and the correctness axis that would have caught it was never run.',
      both:
        'A suite that grades faithfulness and correctness fails the answer: correctness against the oracle catches what faithfulness signed off. Faithful to the wrong document is still wrong.',
    }

    const render = (mode: string) => {
      const both = mode === 'both'
      // "signed off green, wrong" when faithfulness-only; "caught" when both.
      root.dataset.pass = both ? 'true' : 'false'
      root.classList.toggle('show-faith', !both)
      verdictEl.textContent = captions[mode]
      toggles.forEach((t) => {
        const on = t.dataset.ftMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.ftMode!)))
    render('faith')
  }

export {}
