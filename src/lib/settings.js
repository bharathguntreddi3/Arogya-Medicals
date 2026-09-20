import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './supabaseConfig'

// Loads every admin-saved section in one small request (no Supabase library needed).
// Returns { notice: {...}, hours: {...}, ... } — only the sections that have been saved.
export async function fetchSettings() {
  if (!isSupabaseConfigured) return {}
  // Only the `apikey` header: works with both the new publishable key (sb_publishable_…)
  // and the legacy anon key — the new keys aren't JWTs, so they don't go in Authorization.
  const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=id,value`, {
    headers: { apikey: SUPABASE_ANON_KEY },
  })
  if (!res.ok) throw new Error(`settings request failed: ${res.status}`)
  const rows = await res.json()
  return Object.fromEntries(rows.map((r) => [r.id, r.value]))
}
