// AgentTopology widget: toggles between single-agent and multi-agent topology,
// swapping the extra coordination test surfaces and the summary line.
  const root = document.querySelector<HTMLElement>('[data-at]')
  if (root) {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-at-mode]')]
    const summary = root.querySelector<HTMLElement>('[data-at-summary]')!
    const summaryText = root.querySelector<HTMLElement>('[data-at-summary-text]')!
    const LEAN =
      'Single agent: the five surfaces above, and nothing else. No messages to spoof, no chain to amplify a bad decision.'
    const HEAVY =
      'Multi-agent: the same five surfaces, plus five coordination concerns to test, for capability one well-scoped agent already covers.'

    const apply = (mode: string) => {
      const multi = mode === 'multi'
      root.classList.toggle('multi', multi)
      summary.classList.toggle('heavy', multi)
      summary.classList.toggle('lean', !multi)
      summaryText.textContent = multi ? HEAVY : LEAN
    }

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('at-tab-on')
          t.setAttribute('aria-pressed', 'false')
        })
        tab.classList.add('at-tab-on')
        tab.setAttribute('aria-pressed', 'true')
        apply(tab.dataset.atMode!)
      }),
    )

    apply('single')
  }

export {}
