// Grounded-is-not-true source toggle: the same question answered from the
// catalog page vs the account record, with Grounded/True verdicts and outcome.
  type Src = {
    answer: string
    grounded: boolean
    groundedWhy: string
    trueVal: boolean
    trueWhy: string
    outcome: string
    outcomeSafe: boolean
  }
  const root = document.querySelector<HTMLElement>('[data-gt]')
  if (root) {
    const sources: Record<string, Src> = JSON.parse(root.dataset.sources || '{}')
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-gt-src]')]
    const answer = root.querySelector<HTMLElement>('[data-gt-answer]')!
    const cards = {
      grounded: root.querySelector<HTMLElement>('[data-gt-card="grounded"]')!,
      true: root.querySelector<HTMLElement>('[data-gt-card="true"]')!,
    }
    const marks = {
      grounded: root.querySelector<HTMLElement>('[data-gt-mark="grounded"]')!,
      true: root.querySelector<HTMLElement>('[data-gt-mark="true"]')!,
    }
    const whys = {
      grounded: root.querySelector<HTMLElement>('[data-gt-why="grounded"]')!,
      true: root.querySelector<HTMLElement>('[data-gt-why="true"]')!,
    }
    const outcome = root.querySelector<HTMLElement>('[data-gt-outcome]')!
    const outcomeText = root.querySelector<HTMLElement>('[data-gt-outcome-text]')!

    const setCard = (el: HTMLElement, mark: HTMLElement, ok: boolean) => {
      el.classList.toggle('ok', ok)
      el.classList.toggle('bad', !ok)
      mark.textContent = ok ? '✓ yes' : '✗ no'
    }

    const apply = (key: string) => {
      const s = sources[key]
      if (!s) return
      answer.textContent = s.answer
      setCard(cards.grounded, marks.grounded, s.grounded)
      setCard(cards.true, marks.true, s.trueVal)
      whys.grounded.textContent = s.groundedWhy
      whys.true.textContent = s.trueWhy
      outcomeText.textContent = s.outcome
      outcome.classList.toggle('safe', s.outcomeSafe)
      outcome.classList.toggle('harm', !s.outcomeSafe)
    }

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('gt-tab-on')
          t.setAttribute('aria-pressed', 'false')
        })
        tab.classList.add('gt-tab-on')
        tab.setAttribute('aria-pressed', 'true')
        apply(tab.dataset.gtSrc!)
      }),
    )

    apply(tabs[0]?.dataset.gtSrc || 'catalog')
  }

export {}
