import { useEffect } from 'react'
import { classifyLink, track, visitSource } from '../lib/track'

const VISIT_KEY = 'arogya-visit-counted'

// Counts one visit per browser session, plus every Call / WhatsApp / Directions /
// prescription / review link click anywhere on the page.
export function useClickTracking() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(VISIT_KEY)) {
        sessionStorage.setItem(VISIT_KEY, '1')
        track('visit', { source: visitSource() })
      }
    } catch {
      // storage blocked — skip visit counting
    }

    const onClick = (e) => {
      const anchor = e.target.closest?.('a[href]')
      const kind = anchor && classifyLink(anchor)
      if (kind) track(kind)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
}
