// Metric routing widget: filter the metrics table by lane (all / rule / judge) and update
// the caption to describe how each lane is graded and whether it gates hard or is only tracked.
  const root = document.querySelector<HTMLElement>('[data-mr]')
  if (root) {
    const lanes = [...root.querySelectorAll<HTMLButtonElement>('[data-mr-lane]')]
    const rows = [...root.querySelectorAll<HTMLElement>('.mr-row')]
    const caption = root.querySelector<HTMLElement>('[data-mr-caption]')!
    const total = rows.length

    const captions: Record<string, (n: number) => string> = {
      all: () =>
        'Two axes decide every row: what it compares against, and who judges it. Push the costly, checkable checks to <span class="text-primary">rules that gate hard</span>; reserve the model judge for what no rule can reach.',
      rule: (n) =>
        `Showing ${n} of ${total}. The <span class="text-primary">rule</span> lane: scope, arguments, authorization, confirmation, correctness against the oracle. Deterministic, auditable, the same verdict forever, and they <span class="text-primary">gate hard, fail closed</span>.`,
      judge: (n) =>
        `Showing ${n} of ${total}. The judge lane: faithfulness, relevancy, helpfulness, tone. No schema fits them, so a calibrated model scores them, tracked with intervals, never a hard merge gate.`,
    }

    const render = (active: string) => {
      let shown = 0
      rows.forEach((r) => {
        const hide = active !== 'all' && r.dataset.lane !== active
        r.classList.toggle('is-hidden', hide)
        if (!hide) shown++
      })
      lanes.forEach((l) => {
        const on = l.dataset.mrLane === active
        l.classList.toggle('on', on)
        l.classList.toggle('text-text-muted', !on)
        l.setAttribute('aria-pressed', String(on))
      })
      caption.innerHTML = captions[active](shown)
    }

    lanes.forEach((l) => l.addEventListener('click', () => render(l.dataset.mrLane!)))
    render('all')
  }

export {}
