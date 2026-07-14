// CTA tracking: provider-agnostic click measurement for [data-cta] elements,
// firing into Plausible / GA4 / dataLayer and a first-party /api/event beacon.
  // Provider-agnostic CTA measurement: fires into Plausible / GA4 / dataLayer if
  // present, no-op otherwise. The hire CTA becomes countable the moment any
  // analytics provider is wired, with no change here. FLOW: add the measurement
  // event before judging whether the content converts.
  document.querySelectorAll<HTMLElement>('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.cta || 'unknown'
      ;(window as any).plausible?.('CTA Click', { props: { cta: id } })
      ;(window as any).gtag?.('event', 'cta_click', { cta_id: id })
      ;((window as any).dataLayer = (window as any).dataLayer || []).push({
        event: 'cta_click',
        cta_id: id,
      })
      // First-party receiver: the Worker's /api/event endpoint writes this to
      // Analytics Engine. sendBeacon survives the mailto navigation.
      try {
        navigator.sendBeacon?.(
          '/api/event',
          new Blob([JSON.stringify({ event: 'cta_click', cta: id, path: location.pathname })], {
            type: 'application/json',
          }),
        )
      } catch {
        // beacon is best-effort; never block the CTA itself
      }
    })
  })

export {}
