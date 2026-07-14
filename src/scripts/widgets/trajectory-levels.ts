// Trajectory levels: toggles the same refused run between end-to-end, across-the-path,
// and at-the-node readings, updating the verdict and aria-live caption for each.
  const root = document.querySelector<HTMLElement>('[data-tl]')
  if (root) {
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-tl-mode]')]
    const verdictEl = root.querySelector<HTMLElement>('[data-tl-verdict]')!
    const captionEl = root.querySelector<HTMLElement>('[data-tl-caption]')!

    const data: Record<string, { cls: string; verdict: string; caption: string }> = {
      e2e: {
        cls: 'tl-e2e',
        verdict: 'task not completed',
        caption:
          'End to end, the session asks one thing: did the account reach the plan the customer asked for. It did not — goal_completed is false, the account never moved. A stakeholder watching only this dashboard sees a red "failed" and reaches for a bug report.',
      },
      path: {
        cls: 'tl-path',
        verdict: 'route sound',
        caption:
          'Across the path, the same run is sound: at most one write, no orphan action, it terminated, within budget — and nothing bad executed, because pre_action_guard failed the write closed before any tool ran. The refusal end to end was the system working.',
      },
      node: {
        cls: 'tl-node-view',
        verdict: 'pre_action_guard refused',
        caption:
          'At the node, the exact seam Atlas names: pre_action_guard, on the value-bounds check, refused plan_internal_zero before it could execute. Not "the agent failed" but the node, the reason, and the input and output on either side of it.',
      },
    }

    const render = (mode: string) => {
      const d = data[mode]
      root.classList.remove('tl-e2e', 'tl-path', 'tl-node-view')
      root.classList.add(d.cls)
      verdictEl.textContent = d.verdict
      captionEl.textContent = d.caption
      toggles.forEach((t) => {
        const on = t.dataset.tlMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.tlMode!)))
    render('e2e')
  }

export {}
