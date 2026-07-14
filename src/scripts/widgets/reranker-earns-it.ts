// Reranker widget: toggle the reranker off/on and watch NDCG, its lift, and the recall
// guardrail update, with the figcaption carrying the honest "p = 0.23, cannot claim yet" read.
  const root = document.querySelector<HTMLElement>('[data-rk]')
  if (root) {
    const RUNS: Record<string, { ndcg: number; recall: number }> = {
      off: { ndcg: 0.71, recall: 1.0 },
      on: { ndcg: 0.78, recall: 1.0 },
    }
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-rk-mode]')]
    const ndcgEl = root.querySelector<HTMLElement>('[data-rk-ndcg]')!
    const fillEl = root.querySelector<HTMLElement>('[data-rk-fill]')!
    const deltaEl = root.querySelector<HTMLElement>('[data-rk-delta]')!
    const recallEl = root.querySelector<HTMLElement>('[data-rk-recall]')!

    const render = (mode: string) => {
      const run = RUNS[mode]
      ndcgEl.textContent = run.ndcg.toFixed(2)
      fillEl.style.width = `${(run.ndcg * 100).toFixed(0)}%`
      recallEl.textContent = run.recall.toFixed(2)
      deltaEl.textContent =
        mode === 'on' ? `lift +${(RUNS.on.ndcg - RUNS.off.ndcg).toFixed(2)} over off` : 'baseline, no reranker'
      root.classList.toggle('rk-on', mode === 'on')
      toggles.forEach((t) => {
        const on = t.dataset.rkMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.rkMode!)))
    render('off')
  }

export {}
