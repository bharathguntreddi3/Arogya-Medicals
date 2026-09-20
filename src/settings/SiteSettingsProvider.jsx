import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { SiteSettingsContext } from './SiteSettingsContext'
import { mergeSettings } from '../lib/siteDefaults'
import { fetchSettings } from '../lib/settings'
import { todayInIndia } from '../lib/dates'
import { effectiveDiscount } from '../lib/offer'

// The build bakes the settings (and the date) it rendered with into the page as
// window.__SITE_SETTINGS__ / __SITE_DATE__, so the first render matches the pre-rendered HTML.
const baked = (key) => (typeof window !== 'undefined' ? window[key] : undefined)

// "Today" in India, re-checked every minute so date-based things (scheduled offers,
// banner end dates) switch over by themselves. During hydration React uses the build's date.
const subscribeToDay = (onChange) => {
  const id = setInterval(onChange, 60_000)
  return () => clearInterval(id)
}

export default function SiteSettingsProvider({ initial, initialDate, children }) {
  const [remote, setRemote] = useState(() => initial ?? baked('__SITE_SETTINGS__') ?? {})
  const today = useSyncExternalStore(
    subscribeToDay,
    () => todayInIndia(),
    () => initialDate ?? baked('__SITE_DATE__') ?? todayInIndia(),
  )

  const refresh = useCallback(
    () =>
      fetchSettings()
        .then(setRemote)
        .catch(() => {
          // offline or Supabase unavailable — keep showing what we have
        }),
    [],
  )

  // Then fetch the latest, so admin changes show up without a rebuild.
  useEffect(() => {
    refresh()
  }, [refresh])

  const setSetting = useCallback((id, value) => setRemote((r) => ({ ...r, [id]: value })), [])

  const value = useMemo(() => {
    const settings = mergeSettings(remote)
    return { settings, today, discount: effectiveDiscount(settings.offer, today), setSetting, refresh }
  }, [remote, today, setSetting, refresh])

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}
