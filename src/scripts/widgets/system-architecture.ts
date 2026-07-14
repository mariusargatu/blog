// System architecture diagram: toggles between the runtime view and the
// test-points (seams) view, updating the aria-live legend accordingly.
  const root = document.querySelector<HTMLElement>('[data-arch]')
  if (root) {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-arch-view]')]
    const legend = root.querySelector<HTMLElement>('[data-legend]')!
    const RUNTIME = 'What ships: the request path, the trust boundary, the capability tier bound per intent, and the systems of record behind it.'
    const SEAMS =
      'Four test points the harness hooks into: the model gateway pins the one nondeterministic node, seeded fakes stand in for every backend, the cache key is asserted per customer, and the trace is what trajectory tests read.'

    const view = (v: string) => {
      root.classList.toggle('seams', v === 'seams')
      legend.textContent = v === 'seams' ? SEAMS : RUNTIME
    }

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('arch-tab-on')
          t.setAttribute('aria-pressed', 'false')
        })
        tab.classList.add('arch-tab-on')
        tab.setAttribute('aria-pressed', 'true')
        view(tab.dataset.archView!)
      }),
    )

    view('runtime')
  }

export {}
