// propose → confirm → execute gate. Toggles what the orchestrator runs on
// confirm: the latest model output (a second roll of the dice) vs the stored
// pending action (idempotent). No-ops on pages without the widget.
const root = document.querySelector<HTMLElement>('[data-ce]')
if (root) {
  const executed: Record<string, { call: string; match: boolean }> = {
    latest: { call: 'change_plan → plan_id "plan_legacy_value"', match: false },
    stored: { call: 'change_plan → plan_id "plan_current_fast"', match: true },
  }
  const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-ce-mode]')]
  const callEl = root.querySelector<HTMLElement>('[data-ce-call]')!
  const matchEl = root.querySelector<HTMLElement>('[data-ce-match]')!
  const verdictEl = root.querySelector<HTMLElement>('[data-ce-verdict]')!

  const captions: Record<string, string> = {
    latest:
      'Execute the latest model output and the confirmation is a second roll of the dice: the agent proposed one plan, collected a yes, and generated another on the fresh turn. The customer agreed to a thing that did not happen.',
    stored:
      'Resume from the checkpoint and execute the stored pending action: the yes means yes to the exact thing proposed and saved. Where you put that checkpoint boundary is the definition of idempotency for the whole system.',
  }

  const render = (mode: string) => {
    const e = executed[mode]
    root.dataset.safe = String(e.match)
    callEl.textContent = e.call
    matchEl.textContent = e.match
      ? 'matches what the customer saw'
      : 'differs from what the customer saw'
    verdictEl.textContent = captions[mode]
    toggles.forEach((t) => {
      const on = t.dataset.ceMode === mode
      t.classList.toggle('on', on)
      t.setAttribute('aria-pressed', String(on))
    })
  }

  toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.ceMode!)))
  render('latest')
}

export {}
