// Identity-source widget: flips where customer_id comes from — the authenticated
// session (safe) or the model reading it out of the message (confused deputy).
  type Src = {
    resolved: string
    resolvedFrom: string
    reads: string
    safe: boolean
    verdict: string
  }
  const root = document.querySelector<HTMLElement>('[data-id]')
  if (root) {
    const sources: Record<string, Src> = JSON.parse(root.dataset.sources || '{}')
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-id-src]')]
    const resolved = root.querySelector<HTMLElement>('[data-id-resolved]')!
    const from = root.querySelector<HTMLElement>('[data-id-from]')!
    const reads = root.querySelector<HTMLElement>('[data-id-reads]')!
    const verdict = root.querySelector<HTMLElement>('[data-id-verdict]')!
    const icon = root.querySelector<HTMLElement>('[data-id-outcome-icon]')!

    const apply = (key: string) => {
      const s = sources[key]
      if (!s) return
      root.classList.toggle('safe', s.safe)
      root.classList.toggle('danger', !s.safe)
      resolved.textContent = `customer_id = ${s.resolved}`
      from.textContent = `from ${s.resolvedFrom}.`
      reads.textContent = `Reads ${s.reads}.`
      verdict.textContent = s.verdict
      icon.textContent = s.safe ? '●' : '▲'
    }

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('id-tab-on')
          t.setAttribute('aria-pressed', 'false')
        })
        tab.classList.add('id-tab-on')
        tab.setAttribute('aria-pressed', 'true')
        apply(tab.dataset.idSrc!)
      }),
    )

    apply(tabs[0]?.dataset.idSrc || 'session')
  }

export {}
