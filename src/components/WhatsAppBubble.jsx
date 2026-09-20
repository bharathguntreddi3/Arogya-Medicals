import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useContact } from '../settings/SiteSettingsContext'

const SHOWN_KEY = 'arogya-bubble-shown'
const SHOW_AFTER_MS = 6000
const HIDE_AFTER_MS = 12000

// "Need a medicine? Chat with us" nudge. Appears once per visit, a few seconds after the
// page has loaded (so it never competes with the first paint), and hides itself again.
export default function WhatsAppBubble() {
  const { t } = useLanguage()
  const c = useContact()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return
    } catch {
      return
    }
    let hide = 0
    const reveal = () => {
      window.removeEventListener('scroll', onScroll)
      try {
        sessionStorage.setItem(SHOWN_KEY, '1')
      } catch {
        // fine — worst case it shows again next page load
      }
      setVisible(true)
      hide = setTimeout(() => setVisible(false), HIDE_AFTER_MS)
    }
    // On phones the bubble would cover the main Call / WhatsApp buttons at the top of the
    // page, so there it waits until the visitor has scrolled past the first screen.
    const phone = window.matchMedia('(max-width: 767px)').matches
    const pastHero = () => window.scrollY > window.innerHeight * 0.8
    const onScroll = () => pastHero() && reveal()
    const show = setTimeout(() => {
      if (!phone || pastHero()) reveal()
      else window.addEventListener('scroll', onScroll, { passive: true })
    }, SHOW_AFTER_MS)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      // phones: above the bottom bar, leaving the right corner for the back-to-top button
      className="fixed bottom-[92px] left-4 right-[72px] z-50 md:bottom-7 md:left-auto md:right-24 md:w-72"
    >
      <div className="animate-bubble-in relative rounded-2xl border border-border bg-card p-3.5 pr-9 shadow-[var(--shadow-glow)]">
        <a
          href={c.whatsapp}
          target="_blank"
          rel="noreferrer"
          onClick={() => setVisible(false)}
          className="flex items-center gap-3"
        >
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-success text-success-foreground">
            <MessageCircle className="h-4.5 w-4.5" />
          </span>
          <span className="text-sm font-semibold leading-snug text-foreground">{t.bubble.text}</span>
        </a>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label={t.bubble.close}
          className="absolute top-2 right-2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        {/* little tail pointing at the WhatsApp button (desktop) / bottom bar (phone) */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-[calc(50vw-1.5rem)] h-3 w-3 rotate-45 border-r border-b border-border bg-card md:top-1/2 md:-right-1.5 md:bottom-auto md:left-auto md:-translate-y-1/2 md:rotate-[-45deg]"
        />
      </div>
    </div>
  )
}
