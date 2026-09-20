import { useEffect, useSyncExternalStore } from 'react'
import { Sparkles, Tag, X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useSiteSettings } from '../settings/SiteSettingsContext'
import { track } from '../lib/track'

// A visitor can close the strip. It stays closed on their device for an hour, unless the
// messages change (new offer, edited ribbon) — then everyone sees it again straight away.
// index.html reads the same key before first paint and hides the strip, so a returning
// visitor who closed it never sees it flash up.
const CLOSED_KEY = 'arogya-ribbon-closed'
const CLOSED_FOR_MS = 60 * 60 * 1000 // 1 hour
const listeners = new Set()

function readClosed() {
  try {
    return localStorage.getItem(CLOSED_KEY)
  } catch {
    return null
  }
}

const subscribe = (notify) => {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

// Short fingerprint of the strip's content, so changing it brings the strip back.
function signature(value) {
  const text = JSON.stringify(value)
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0
  return String(hash)
}

function isClosed(raw, sig) {
  if (!raw) return false
  try {
    const { sig: closedSig, until } = JSON.parse(raw)
    return closedSig === sig && until > Date.now()
  } catch {
    return false
  }
}

export default function OfferRibbon() {
  const { lang, t } = useLanguage()
  const { settings, discount } = useSiteSettings()
  const { ribbon } = settings
  const closedRaw = useSyncExternalStore(subscribe, readClosed, () => null)

  const sig = signature({ showOffer: ribbon.showOffer, items: ribbon.items, discount })
  const closed = isClosed(closedRaw, sig)

  // keep the early-hide class from index.html in step (e.g. the messages changed since closing)
  useEffect(() => {
    document.documentElement.classList.toggle('ribbon-closed', closed)
  }, [closed])

  // The discount message (follows the Offer setting) + the admin's own messages.
  const messages = [
    ...(ribbon.showOffer ? [{ icon: Tag, text: t.ribbon.offer }] : []),
    ...ribbon.items
      .map((item) => ({ icon: Sparkles, text: (lang === 'te' && item.te) || item.en }))
      .filter((m) => m.text),
  ]
  if (!messages.length || closed) return null

  const close = () => {
    try {
      localStorage.setItem(CLOSED_KEY, JSON.stringify({ sig, until: Date.now() + CLOSED_FOR_MS }))
    } catch {
      // storage blocked — it simply stays closed until the page reloads
    }
    track('ribbon_close')
    listeners.forEach((notify) => notify())
  }

  const repeats = Array.from({ length: 8 })

  return (
    <div
      data-ribbon
      className="relative overflow-hidden text-accent-foreground"
      style={{ background: 'var(--gradient-ribbon)', backgroundSize: '200% 100%' }}
    >
      {/* Screen readers get the messages once instead of the 16 scrolling copies */}
      <p className="sr-only">{messages.map((m) => m.text).join(' · ')}</p>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee pause-on-hover gap-8 whitespace-nowrap py-1.5 pr-10 text-[12px] font-semibold tracking-wide sm:gap-12 sm:py-2 sm:text-sm"
      >
        {[...repeats, ...repeats].map((_, i) => (
          <span key={i} className="flex items-center gap-2">
            {messages.map(({ icon: Icon, text }, j) => (
              <span key={j} className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {text}
              </span>
            ))}
          </span>
        ))}
      </div>

      {/* Close: sits on a fade so the scrolling text slides under it cleanly */}
      <div
        className="absolute inset-y-0 right-0 flex items-center pr-1.5 pl-6 sm:pr-3"
        style={{ background: 'linear-gradient(to right, transparent, oklch(0.76 0.175 48) 45%)' }}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t.nav.closeRibbon}
          title={t.nav.closeRibbon}
          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-accent-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
