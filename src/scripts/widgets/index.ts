// Barrel for all article interactive-widget scripts. Imported once by
// ArticleLayout so the whole set bundles into a single external chunk
// (covered by CSP `script-src 'self'`) instead of N inline <script> blocks,
// each of which added a sha256 hash to the _headers CSP until the line
// breached Cloudflare's 2000-char limit. Every widget guards on its own
// data-* attribute, so importing all of them on every article page is a
// no-op where the widget is absent. Adding a new widget here keeps the
// bundle external (it only grows), so the CSP header never regrows.
import './agent-topology'
import './benchmark-verdict'
import './cache-key-isolation'
import './capability-ranker'
import './confirm-execute'
import './crescendo-player'
import './cta-tracking'
import './faithful-not-true'
import './gating-rule'
import './graph-vs-vector'
import './grounded-vs-true'
import './guard-gate'
import './idempotency-key'
import './identity-source'
import './intent-binding'
import './judge-bias'
import './judge-calibration'
import './metric-routing'
import './only-goes-green'
import './reranker-earns-it'
import './risk-lever'
import './stakes-escalator'
import './system-architecture'
import './trajectory-levels'
import './trial-spread'
import './validator-pipeline'
