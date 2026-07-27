// Judge selection widget: toggle the candidate family and swap in that arm's measured scores on
// the 20 case selection set. Every number is read from the component's data-arms payload, which is
// sourced in the component's own frontmatter comment. No figure is computed here.
  const root = document.querySelector<HTMLElement>('[data-jc]')
  if (root) {
    type Row = { model: string; score: number; chosen: boolean; detail: string }
    type Arm = { label: string; trials: number; note: string; rows: Row[] }
    const arms: Record<string, Arm> = JSON.parse(root.dataset.arms || '{}')

    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-jc-arm]')]
    const rows = [...root.querySelectorAll<HTMLElement>('.jc-row')]
    const captionEl = root.querySelector<HTMLElement>('[data-jc-caption]')!

    const SHARED =
      'Across all 360 calls in the sweep, 11 verdicts were wrong and <span class="text-error">10 of those 11 were a false FAIL on a PASS case</span>. The judges err in one direction, and both rejected candidates missed the same case, a correct claim carrying a wrong citation, so the over harshness is shared across families rather than being one vendor’s quirk.'

    const caption = (key: string) =>
      key === 'openai'
        ? `OpenAI arm: every case under both prompt conditions, so 40 verdicts per candidate. gpt-5.6-luna took 40 of 40 and was the cheapest of the four that tied at the top; gpt-5.4-mini took 36 of 40 and came last of the nine candidates run. ${SHARED}`
        : `Anthropic arm: one prompt condition, so 20 verdicts per candidate. claude-opus-5 took 20 of 20, the only Claude model to match luna; claude-sonnet-5 took 18 of 20. ${SHARED}`

    let first = true
    const render = (key: string) => {
      const arm = arms[key]
      if (!arm) return
      rows.forEach((row, i) => {
        const data = arm.rows[i]
        if (!data) return
        const modelEl = row.querySelector<HTMLElement>('[data-jc-model]')!
        const detailEl = row.querySelector<HTMLElement>('[data-jc-detail]')!
        const scoreEl = row.querySelector<HTMLElement>('[data-jc-score]')!
        const tagEl = row.querySelector<HTMLElement>('[data-jc-tag]')!
        const next = `${data.score}/${arm.trials}`
        const moved = scoreEl.textContent !== next
        modelEl.textContent = data.model
        detailEl.textContent = data.detail
        scoreEl.textContent = next
        scoreEl.dataset.chosen = String(data.chosen)
        tagEl.textContent = data.chosen ? 'chosen' : 'rejected'
        // pulse only the rows the toggle actually moved, so the eye lands on the change
        if (!first && moved) {
          row.classList.remove('changed')
          void row.offsetWidth // restart the animation
          row.classList.add('changed')
        }
      })
      captionEl.innerHTML = caption(key)
      toggles.forEach((t) => {
        const on = t.dataset.jcArm === key
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
      first = false
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.jcArm!)))
    render('openai')
  }

export {}
