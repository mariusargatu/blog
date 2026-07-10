// First-party analytics endpoint in front of the static site.
// POST /api/event records a CTA event into Cloudflare Analytics Engine
// (dataset: blog_cta_events); every other request falls through to the
// static assets this Worker already serves. Query the data with the
// Analytics Engine SQL API: SELECT blob2 AS cta, count() FROM blog_cta_events.

const ALLOWED_EVENTS = new Set(['cta_click'])
const MAX_BODY_BYTES = 1024

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/event') {
      return handleEvent(request, env)
    }
    return env.ASSETS.fetch(request)
  },
}

async function handleEvent(request, env) {
  if (request.method !== 'POST') {
    return new Response('method not allowed', { status: 405, headers: { allow: 'POST' } })
  }

  let payload
  try {
    const body = await request.arrayBuffer()
    if (body.byteLength > MAX_BODY_BYTES) {
      return new Response('payload too large', { status: 413 })
    }
    payload = JSON.parse(new TextDecoder().decode(body))
  } catch {
    return new Response('invalid json', { status: 400 })
  }

  const event = typeof payload?.event === 'string' ? payload.event : ''
  const cta = typeof payload?.cta === 'string' ? payload.cta.slice(0, 96) : 'unknown'
  const path = typeof payload?.path === 'string' ? payload.path.slice(0, 256) : ''
  if (!ALLOWED_EVENTS.has(event)) {
    return new Response('unknown event', { status: 400 })
  }

  // The binding is optional so `wrangler dev` without the dataset still works.
  env.CTA_EVENTS?.writeDataPoint({
    blobs: [event, cta, path, request.headers.get('referer') ?? ''],
    doubles: [1],
    indexes: [cta],
  })
  return new Response(null, { status: 204 })
}
