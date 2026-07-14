// Intent-binding widget: picks a turn's intent, binds only the servers it needs,
// and proves a write is unreachable when its tool was never handed over.
  const root = document.querySelector<HTMLElement>('[data-ib]')
  if (root) {
    const bind: Record<string, string[]> = JSON.parse(root.dataset.bind || '{}')
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-ib-intent]')]
    const servers = [...root.querySelectorAll<HTMLElement>('[data-ib-server]')]
    const attempt = root.querySelector<HTMLButtonElement>('[data-ib-attempt]')!
    const verdict = root.querySelector<HTMLElement>('[data-ib-verdict]')!
    let current = tabs[0]?.dataset.ibIntent || 'troubleshoot'

    const apply = (intent: string) => {
      current = intent
      const bound = bind[intent] || []
      servers.forEach((s) => {
        const key = s.dataset.ibServer!
        const isBound = bound.includes(key)
        s.classList.toggle('bound', isBound)
        s.classList.toggle('unreachable', !isBound)
        const state = s.querySelector<HTMLElement>('[data-ib-state]')!
        state.textContent = isBound ? '● bound' : '○ not in toolset'
      })
      // reset the attempt verdict on each intent change
      root.classList.remove('blocked')
      verdict.textContent = 'Now try the write on this turn.'
      verdict.classList.remove('text-error', 'text-primary')
    }

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('ib-tab-on')
          t.setAttribute('aria-pressed', 'false')
        })
        tab.classList.add('ib-tab-on')
        tab.setAttribute('aria-pressed', 'true')
        apply(tab.dataset.ibIntent!)
      }),
    )

    attempt.addEventListener('click', () => {
      const allowed = (bind[current] || []).includes('actions')
      verdict.classList.remove('text-error', 'text-primary')
      if (allowed) {
        root.classList.remove('blocked')
        verdict.classList.add('text-primary')
        verdict.textContent =
          'change_plan is in the toolset for this intent. It proceeds, behind the confirmation gate.'
      } else {
        root.classList.add('blocked')
        verdict.classList.add('text-error')
        verdict.textContent =
          'Unreachable: change_plan was never on the table for this intent. Not denied, absent.'
      }
    })

    root.classList.add('is-interactive')
    apply(current)
  }

export {}
