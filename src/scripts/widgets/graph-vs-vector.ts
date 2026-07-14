// Graph-vs-vector slice toggle: flat lookups (both 1.00, skip the graph) vs
// relational multi-hop (vector 0.50, graph 1.00, adopt the graph).
  const root = document.querySelector<HTMLElement>('[data-gv]')
  if (root) {
    const SLICES: Record<string, { q: string; vector: number; graph: number; verdict: string; win: boolean; why: string }> = {
      flat: {
        q: '“what is the fair use threshold?”',
        vector: 1.0,
        graph: 1.0,
        verdict: 'skip the graph',
        win: false,
        why: 'the vector retriever is already perfect; the graph adds only cost.',
      },
      relational: {
        q: '“will the account holder’s line be throttled?”',
        vector: 0.5,
        graph: 1.0,
        verdict: 'adopt the graph',
        win: true,
        why: 'the link the answer needs is a graph edge, not co-occurring text, so no lookup finds it at any k; the traversal resolves the customer and collects every hop.',
      },
    }
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-gv-mode]')]
    const qEl = root.querySelector<HTMLElement>('[data-gv-q]')!
    const vec = root.querySelector<HTMLElement>('[data-gv-vec]')!
    const vecLabel = root.querySelector<HTMLElement>('[data-gv-vec-label]')!
    const graph = root.querySelector<HTMLElement>('[data-gv-graph]')!
    const graphLabel = root.querySelector<HTMLElement>('[data-gv-graph-label]')!
    const verdictEl = root.querySelector<HTMLElement>('[data-gv-verdict]')!
    const captionEl = root.querySelector<HTMLElement>('[data-gv-caption]')!

    const captions: Record<string, string> = {
      flat: 'On the flat slice both strategies land at 1.00. The vector retriever is already perfect, so the graph adds only indexing and token cost. Skip it here.',
      relational:
        'On the relational slice the split is stark: the vector recovers only 0.50 even at the deployed budget (k=3), while graph path recall is 1.00, every hop. The link the answer needs is a graph edge, not co-occurring text, so no lookup finds it at any k; the traversal resolves the customer and collects every hop. Adopt the graph here.',
    }

    const render = (mode: string) => {
      const s = SLICES[mode]
      qEl.textContent = s.q
      vec.style.width = `${(s.vector * 100).toFixed(0)}%`
      vecLabel.textContent = s.vector.toFixed(2)
      graph.style.width = `${(s.graph * 100).toFixed(0)}%`
      graphLabel.textContent = s.graph.toFixed(2)
      verdictEl.textContent = s.verdict
      root.dataset.win = String(s.win)
      captionEl.textContent = captions[mode]
      toggles.forEach((t) => {
        const on = t.dataset.gvMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.gvMode!)))
    render('flat')
  }

export {}
