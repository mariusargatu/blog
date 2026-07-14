// Idempotency-key widget: toggles a retried write between "without a key" (three
// plan changes) and "with a key" (three retries collapse to one plan change).
  const root = document.querySelector<HTMLElement>('[data-ik]')
  if (root) {
    const keyEls = [...root.querySelectorAll<HTMLElement>('[data-ik-key]')]
    const countEl = root.querySelector<HTMLElement>('[data-ik-count]')!
    const nounEl = root.querySelector<HTMLElement>('[data-ik-noun]')!
    const captionEl = root.querySelector<HTMLElement>('[data-ik-caption]')!
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-ik-mode]')]

    const captions: Record<string, string> = {
      off: 'Without a key, each retry is a fresh change. The write half succeeded, the retries landed too, and the backend now holds three plan changes where the customer asked for one.',
      on: 'With the key, the stateful backend recognises it, applies the change once, and returns the original result for every repeat. Three retries on one key are one plan change, and the key lives outside the model’s reach.',
    }

    const render = (mode: string) => {
      const keyed = mode === 'on'
      root.dataset.keyed = String(keyed)
      keyEls.forEach((k) => (k.textContent = keyed ? 'idem:9f3a…' : 'no key'))
      countEl.textContent = keyed ? '1' : '3'
      nounEl.textContent = keyed ? 'plan change' : 'plan changes'
      captionEl.textContent = captions[mode]
      toggles.forEach((t) => {
        const on = t.dataset.ikMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.ikMode!)))
    render('off')
  }

export {}
