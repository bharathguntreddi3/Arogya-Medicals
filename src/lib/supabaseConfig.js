// Values come from .env.local (on your computer) or the Vercel project settings.
// The anon key is meant to be public — what visitors can do is limited by the
// database rules in supabase/setup.sql, not by keeping this key secret.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

// The example values from .env.example don't count as connected.
const isPlaceholder = (v) => /your-project-id|your-key|your-anon/.test(v)

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && !isPlaceholder(SUPABASE_URL) && !isPlaceholder(SUPABASE_ANON_KEY),
)
