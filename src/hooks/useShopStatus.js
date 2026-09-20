import { useEffect, useState } from 'react'
import { getShopStatus } from '../lib/hours'
import { useSiteSettings } from '../settings/SiteSettingsContext'

// Returns null until mounted: the page is pre-rendered at build time, when the
// visitor's current time isn't known, so the status is only computed in the browser.
export function useShopStatus() {
  const { hours } = useSiteSettings().settings
  const [now, setNow] = useState(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return now ? getShopStatus(hours, now) : null
}
