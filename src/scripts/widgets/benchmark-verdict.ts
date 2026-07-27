// BenchmarkVerdict widget: toggles the 5-vs-8 handoff reading between "two points"
// and "two intervals", swapping the caption and the interval-reveal state. The intervals caption is
// rendered server side from the measured numbers and read back off the dataset, so there is exactly
// one place those figures live.
  const root = document.querySelector<HTMLElement>('[data-bv]')
  if (root) {
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-bv-mode]')]
    const captionEl = root.querySelector<HTMLElement>('[data-bv-caption]')!

    const captions: Record<string, string> = {
      points:
        'Two points, six apart: 10.0% against 16.0%. Read this way arm B looks meaningfully worse, and it looks like something you could act on.',
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
