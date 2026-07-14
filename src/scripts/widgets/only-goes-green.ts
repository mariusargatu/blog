// "Only goes green" widget: toggle between driving a bad write through the real (fail-closed)
// graph, which grades sound, and a synthetic guard-skipping trajectory that grades unsound.
  const root = document.querySelector<HTMLElement>('[data-og]')
  if (root) {
    const runs: Record<string, { trace: { step: string; ok: boolean; note?: string }[]; sound: boolean }> = {
      real: {
        trace: [
          { step: 'select tool', ok: true },
          { step: 'guard: foreign account id', ok: true, note: 'blocked before execute' },
          { step: 'no action recorded', ok: true },
        ],
        sound: true,
      },
      synthetic: {
        trace: [
          { step: 'hand built trace, guard skipped', ok: false },
          { step: 'execute: change on account #other', ok: false, note: 'a bad action landed' },
          { step: 'grader: foreign id detected', ok: true, note: 'assertion fires' },
        ],
        sound: false,
      },
    }
    const toggles = [...root.querySelectorAll<HTMLButtonElement>('[data-og-mode]')]
    const traceEl = root.querySelector<HTMLElement>('[data-og-trace]')!
    const verdictEl = root.querySelector<HTMLElement>('[data-og-verdict]')!
    const captionEl = root.querySelector<HTMLElement>('[data-og-caption]')!

    const captions: Record<string, string> = {
      real: 'Drive a bad write through the real graph and the trajectory comes back sound: the guard blocked it before execute, so nothing bad ran and the trace shows a block and no action. That is the runtime working. But a suite that can only ever go green is not a test, which is why you also build the synthetic case.',
      synthetic:
        'A hand built trajectory that skips the guard, carrying a foreign account id, lets a bad action land. Now the grader has something to catch, and it does: the assertion fires and the trajectory grades unsound. This is the case that proves your check can actually fail.',
    }

    const render = (mode: string) => {
      const run = runs[mode]
      root.dataset.sound = String(run.sound)
      traceEl.innerHTML = run.trace
        .map(
          (t) =>
            `<li class="og-step flex items-center gap-3 rounded border px-3 py-2 ${t.ok ? 'ok' : 'bad'}"><span class="og-mark font-mono text-mono-xs shrink-0" aria-hidden="true">${t.ok ? '✓' : '✗'}</span><span class="flex-1 text-sm text-text-primary">${t.step}</span>${t.note ? `<span class="og-note font-mono text-mono-xs text-text-muted shrink-0">${t.note}</span>` : ''}</li>`,
        )
        .join('')
      verdictEl.textContent = run.sound ? 'trajectory sound' : 'trajectory unsound, caught'
      captionEl.textContent = captions[mode]
      toggles.forEach((t) => {
        const on = t.dataset.ogMode === mode
        t.classList.toggle('on', on)
        t.setAttribute('aria-pressed', String(on))
      })
    }

    toggles.forEach((t) => t.addEventListener('click', () => render(t.dataset.ogMode!)))
    render('real')
  }

export {}
