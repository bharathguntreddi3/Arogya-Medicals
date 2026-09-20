// Runs after `vite build`: renders the React app to HTML and puts it inside
// dist/index.html, so the page shows instantly instead of waiting for JavaScript.
// If Supabase is configured, the admin's current settings are fetched and baked in,
// so first-time visitors see the latest hours, phone numbers and images immediately.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const indexPath = `${root}dist/index.html`
const serverEntry = pathToFileURL(`${root}dist-ssr/entry-server.js`).href

// Same variables Vite gives the site: .env.local on your computer, project settings on Vercel.
const env = { ...loadEnv('production', root, 'VITE_'), ...process.env }

async function fetchSettings() {
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  // not set up yet (or still the example values from .env.example)
  if (!url || !key || /your-project-id|your-key|your-anon/.test(url + key)) return {}
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?select=id,value`, {
      // apikey only: works with both the new publishable key and the legacy anon key
      headers: { apikey: key },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const rows = await res.json()
    console.log(`prerender: baked in ${rows.length} admin setting(s) from Supabase`)
    return Object.fromEntries(rows.map((r) => [r.id, r.value]))
  } catch (err) {
    console.warn(`prerender: could not load settings from Supabase (${err.message}); using defaults`)
    return {}
  }
}

const settings = await fetchSettings()
const { render, todayInIndia, effectiveDiscount, mergeSettings } = await import(serverEntry)
const today = todayInIndia()
let html = readFileSync(indexPath, 'utf8')
const placeholder = '<div id="root"></div>'

if (!html.includes(placeholder)) {
  throw new Error(`prerender: ${placeholder} not found in dist/index.html`)
}

// Keep the page <head> (search results, link previews) in step with the admin settings.
const discount = effectiveDiscount(mergeSettings(settings).offer, today)
if (discount) {
  html = html.replaceAll('Best discounts on all medicines', `Flat ${discount}% OFF on all medicines`)
}
if (settings.contact?.phone) html = html.replaceAll('9885191077', settings.contact.phone)

// The browser starts from exactly what was rendered here (settings + date), then updates.
const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c')
const baked = `<script>window.__SITE_SETTINGS__=${json(settings)};window.__SITE_DATE__=${json(today)}</script>`
html = html.replace(placeholder, `${baked}<div id="root">${render(settings, today)}</div>`)

writeFileSync(indexPath, html)
rmSync(`${root}dist-ssr`, { recursive: true, force: true })

console.log('prerender: dist/index.html now contains the rendered page')
