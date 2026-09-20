import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './supabaseConfig'

// Anonymous click counting for the admin Statistics tab. Stored per event: the kind of
// action, the time, phone-or-computer, the site language, and (visits only) a broad
// "how they arrived" category. Nothing that identifies anyone. Requests never delay the page.

export const EVENT_KINDS = [
  'visit',
  'call',
  'whatsapp',
  'directions',
  'prescription',
  'review',
  'enquiry',
  'map',
  'gallery',
  'ribbon_close',
]

const OPT_OUT_KEY = 'arogya-no-track'

export function isTrackingOff() {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1'
  } catch {
    return false
  }
}

// The shop owner's own device shouldn't inflate the numbers.
export function setTrackingOff(off) {
  try {
    if (off) localStorage.setItem(OPT_OUT_KEY, '1')
    else localStorage.removeItem(OPT_OUT_KEY)
  } catch {
    // storage unavailable — nothing to remember
  }
}

// POST a row to a public-insert table; keepalive lets it finish even if the page is leaving.
export function insertRow(table, row) {
  if (!isSupabaseConfigured) return Promise.resolve()
  return fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    keepalive: true,
    headers: {
      // apikey only: works with both the new publishable key and the legacy anon key
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  }).catch(() => {
    // counting is best-effort
  })
}

const deviceType = () => (window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop')
const siteLang = () => (document.documentElement.lang === 'te' ? 'te' : 'en')

// Where a visit came from, as a broad category only (the exact page is never stored).
export function visitSource(referrer = document.referrer) {
  if (!referrer) return 'direct'
  let host
  try {
    host = new URL(referrer).hostname
  } catch {
    return 'other'
  }
  if (host === window.location.hostname) return 'direct'
  if (/(^|\.)(google|bing|yahoo|duckduckgo)\./.test(host)) return 'search'
  if (/(facebook|instagram|whatsapp|wa\.me|youtube|t\.co|twitter|x\.com|linkedin)/.test(host)) return 'social'
  return 'other'
}

export function track(kind, extra = {}) {
  if (isTrackingOff()) return
  insertRow('site_events', { kind, device: deviceType(), lang: siteLang(), ...extra })
}

// Which action a link represents. Links can also say so explicitly with data-track="…".
export function classifyLink(anchor) {
  const explicit = anchor.dataset.track
  if (explicit) return explicit
  const href = anchor.getAttribute('href') ?? ''
  if (href.startsWith('tel:')) return 'call'
  if (href.includes('wa.me/')) {
    const text = decodeURIComponent(href).toLowerCase()
    return text.includes('prescription') || text.includes('ప్రిస్క్రిప్షన్') ? 'prescription' : 'whatsapp'
  }
  if (href.includes('google.com/maps')) return 'directions'
  return null
}
