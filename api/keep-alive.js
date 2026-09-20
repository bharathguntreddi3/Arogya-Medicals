// Vercel Cron calls this every 3 days (see vercel.json) so the free Supabase
// project never sits idle long enough to be paused (Supabase pauses after 7 days).
// It only reads the public banner row — the same thing every visitor does.

export async function GET(request) {
  // If CRON_SECRET is set in Vercel, only Vercel's scheduler may call this.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    return Response.json({ ok: false, error: 'Supabase env vars are not set' }, { status: 500 })
  }

  const res = await fetch(`${url}/rest/v1/site_settings?select=id&limit=1`, {
    // apikey only: works with both the new publishable key and the legacy anon key
    headers: { apikey: key },
  })

  return Response.json(
    { ok: res.ok, supabaseStatus: res.status, at: new Date().toISOString() },
    { status: res.ok ? 200 : 502 },
  )
}
