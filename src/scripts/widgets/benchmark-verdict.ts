// BenchmarkVerdict widget: toggles the 84-vs-81 reading between "two points"
// and "two intervals", swapping the caption and the interval-reveal state.
  const root = document.querySelector<HTMLElement>('[data-bv]')
  if (root) {
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-bv-mode]')]
    const captionEl = root.querySelector<HTMLElement>('[data-bv-caption]')!

    const captions: Record<string, string> = {
      points:
        'Two points, three apart. Read this way it looks like a regression worth holding the release for.',
      intervals: captionEl.dataset.bvIntervalsCaption!,
    }

    const render = (mode: string) => {
      root.classList.toggle('show-intervals', mode === 'intervals')
      captionEl.textContent = captions[mode]
      toggles.forEach((t) => {
        const on = t.dataset.bvMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.bvMode!)))
    render('points')
  }

export {}
