import { MessageCircle, Navigation, Phone } from 'lucide-react'
import { useContact } from '../settings/SiteSettingsContext'
import { useLanguage } from '../i18n/LanguageContext'

// Desktop/tablet only — phones already have WhatsApp in the bottom action bar.
export function FloatingWhatsApp() {
  const { t } = useLanguage()
  const c = useContact()

  return (
    <a
      href={c.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label={t.mobile.chatAria}
      className="fixed bottom-5 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-110 animate-pulse-soft md:inline-flex"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

export function MobileActionBar() {
  const { t } = useLanguage()
  const c = useContact()

  const actions = [
    { href: c.tel, label: t.mobile.call, icon: Phone, tone: 'bg-primary text-primary-foreground' },
    {
      href: c.whatsapp,
      label: t.mobile.whatsapp,
      icon: MessageCircle,
      tone: 'bg-success text-success-foreground',
      external: true,
    },
    {
      href: c.maps,
      label: t.mobile.directions,
      icon: Navigation,
      tone: 'bg-accent text-accent-foreground',
      external: true,
    },
  ]

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 py-2 shadow-[0_-6px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur md:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-3 gap-2">
        {actions.map(({ href, label, icon: Icon, tone, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className={`flex items-center justify-center gap-1.5 rounded-full px-3 py-3 text-xs font-semibold shadow-[var(--shadow-soft)] active:scale-95 transition-transform ${tone}`}
          >
            <Icon className="h-4 w-4 flex-none" /> {label}
          </a>
        ))}
      </div>
    </div>
  )
}
