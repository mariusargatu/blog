// CacheKeyIsolation widget: pick question type and keying strategy, then render
// what the semantic cache serves, surfacing the cross-tenant leak on shared keys.
  type Customer = { key: string; name: string; id: string; bill: string }
  const root = document.querySelector<HTMLElement>('[data-ck]')
  if (root) {
    const state: { customers: Customer[]; initialBill: string } = JSON.parse(root.dataset.state || '{}')
    const { customers } = state
    const qTabs = [...root.querySelectorAll<HTMLButtonElement>('[data-ck-q]')]
    const keyTabs = [...root.querySelectorAll<HTMLButtonElement>('[data-ck-key]')]
    const keystr = root.querySelector<HTMLElement>('[data-ck-keystr]')!
    const status = root.querySelector<HTMLElement>('[data-ck-status]')!
    const statusText = root.querySelector<HTMLElement>('[data-ck-status-text]')!
    const cards = customers.map((c) => ({
      c,
      el: root.querySelector<HTMLElement>(`[data-ck-cust="${c.key}"]`)!,
    }))
    let q = 'generic'
    let key = 'scoped'

    const setCard = (el: HTMLElement, served: string, src: string, leak: boolean) => {
      el.classList.toggle('ok', !leak)
      el.classList.toggle('leak', leak)
      el.querySelector('.ck-mark')!.textContent = leak ? '✗' : '✓'
      el.querySelector<HTMLElement>('[data-ck-served]')!.textContent = served
      el.querySelector<HTMLElement>('[data-ck-src]')!.textContent = src
    }

    const render = () => {
      // who wrote the cache entry first, in the buggy shared-key case
      const owner = customers[1] // Daniel
      if (q === 'generic') {
        keystr.textContent = 'policy:contract-terms'
        cards.forEach(({ el }) =>
          setCard(
            el,
            '“Early termination fees are set per plan term.”',
            'one shared entry · no customer data, safe to share',
            false,
          ),
        )
        status.classList.add('ok')
        status.classList.remove('bad')
        statusText.textContent =
          'Generic, customer-independent answer. One cache entry serves everyone, and nothing private crosses.'
        return
      }
      // "my bill"
      if (key === 'scoped') {
        keystr.textContent = 'bill:{customer_id}'
        cards.forEach(({ c, el }) =>
          setCard(el, `“Your bill this month is ${c.bill}.”`, `keyed bill:${c.id} · isolated`, false),
        )
        status.classList.add('ok')
        status.classList.remove('bad')
        statusText.textContent =
          'Keyed per customer. Each lookup hits its own entry; one bill can never be served to another customer.'
      } else {
        keystr.textContent = 'bill   ← no customer in the key'
        cards.forEach(({ c, el }) => {
          const leak = c.key !== owner.key
          setCard(
            el,
            `“Your bill this month is ${owner.bill}.”`,
            leak ? `served ${owner.name}'s entry · WRONG` : `wrote the entry first`,
            leak,
          )
        })
        status.classList.add('bad')
        status.classList.remove('ok')
        statusText.textContent =
          `Keyed by question text alone. ${owner.name} wrote the entry; ${customers[0].name} is served ${owner.name}'s bill. This is the Asana cross-tenant leak.`
      }
    }

    const wire = (tabs: HTMLButtonElement[], attr: string, set: (v: string) => void) =>
      tabs.forEach((tab) =>
        tab.addEventListener('click', () => {
          tabs.forEach((t) => {
            t.classList.remove('ck-tab-on')
            t.setAttribute('aria-pressed', 'false')
          })
          tab.classList.add('ck-tab-on')
          tab.setAttribute('aria-pressed', 'true')
          set(tab.dataset[attr]!)
          render()
        }),
      )
    wire(qTabs, 'ckQ', (v) => (q = v))
    wire(keyTabs, 'ckKey', (v) => (key = v))

    render()
  }

export {}
