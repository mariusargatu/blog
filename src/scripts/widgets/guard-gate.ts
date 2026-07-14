// Fail-closed guard widget: runs a picked model payload through two checkpoints
// (pre-action, pre-render) and either ships it or stops it, default is no.
  type Payload = { text: string; blockAt: number; verdict: string }
  const root = document.querySelector<HTMLElement>('[data-gg]')
  if (root) {
    const payloads: Record<string, Payload> = JSON.parse(root.dataset.payloads || '{}')
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-gg-payload]')]
    const gates = [...root.querySelectorAll<HTMLElement>('[data-gg-gate]')]
    const exit = root.querySelector<HTMLElement>('[data-gg-exit]')!
    const text = root.querySelector<HTMLElement>('[data-gg-text]')!
    const status = root.querySelector<HTMLElement>('[data-gg-status]')!
    const statusText = root.querySelector<HTMLElement>('[data-gg-status-text]')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let token = 0

    const clear = () => {
      gates.forEach((g) => {
        g.classList.remove('pass', 'block')
        g.querySelector('.gg-gate-mark')!.textContent = ''
      })
      exit.classList.remove('ship')
      status.classList.remove('ok', 'stop')
    }

    const run = (key: string) => {
      const p = payloads[key]
      if (!p) return
      const myToken = ++token
      clear()
      text.textContent = p.text
      const stepMs = reduce ? 0 : 300

      gates.forEach((g, i) => {
        window.setTimeout(() => {
          if (myToken !== token) return
          if (i === p.blockAt) {
            g.classList.add('block')
            g.querySelector('.gg-gate-mark')!.textContent = '✗'
            status.classList.add('stop')
            statusText.textContent = p.verdict
          } else if (p.blockAt === -1 || i < p.blockAt) {
            g.classList.add('pass')
            g.querySelector('.gg-gate-mark')!.textContent = '✓'
          }
        }, stepMs * (i + 1))
      })

      if (p.blockAt === -1) {
        window.setTimeout(() => {
          if (myToken !== token) return
          exit.classList.add('ship')
          status.classList.add('ok')
          statusText.textContent = p.verdict
        }, stepMs * (gates.length + 1))
      }
    }

    tabs.forEach((tab) =>
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('gg-tab-on')
          t.setAttribute('aria-pressed', 'false')
        })
        tab.classList.add('gg-tab-on')
        tab.setAttribute('aria-pressed', 'true')
        run(tab.dataset.ggPayload!)
      }),
    )

    // auto-run a blocked case once in view, so the fail-closed default reads at a glance
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            obs.disconnect()
            tabs.find((t) => t.dataset.ggPayload === 'otherbill')?.click()
          }
        }
      },
      { threshold: 0.4 },
    )
    io.observe(root)
  }

export {}
