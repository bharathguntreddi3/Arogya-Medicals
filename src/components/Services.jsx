import {
  Activity,
  BadgeIndianRupee,
  Boxes,
  FileText,
  Leaf,
  MessageCircle,
  Pill,
  ShieldCheck,
  Smile,
  Store,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useContact } from '../settings/SiteSettingsContext'

const TONES = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  accent: 'bg-accent/15 text-accent-strong',
}

// Hover/tap micro-animation for each icon (CSS only, see index.css)
const MOTION = {
  hop: 'group-hover:icon-hop',
  wiggle: 'group-hover:icon-wiggle',
  spin: 'group-hover:icon-spin',
}

// Same order as t.services.items. `glow` pulses the tile instead of moving the icon.
const CARDS = [
  { icon: Boxes, tone: 'primary', motion: 'hop' },
  { icon: Pill, tone: 'success', motion: 'wiggle' },
  { icon: Store, tone: 'accent', motion: 'hop' },
  { icon: FileText, tone: 'primary', motion: 'wiggle' },
  { icon: Leaf, tone: 'success', motion: 'wiggle' },
  { icon: Smile, tone: 'accent', motion: 'hop' },
  { icon: ShieldCheck, tone: 'primary', motion: 'glow' },
  { icon: BadgeIndianRupee, tone: 'success', motion: 'spin' },
]
const PRESCRIPTION_CARD = 3

export default function Services() {
  const { t } = useLanguage()
  const c = useContact()

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Activity className="h-3.5 w-3.5" /> {t.services.badge}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.services.title}</h2>
        <p className="mt-3 text-muted-foreground">{t.services.subtitle}</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ icon: Icon, tone, motion }, i) => (
          <article
            key={i}
            data-reveal
            className="group relative overflow-hidden rounded-2xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
            style={{ background: 'var(--gradient-card)', '--reveal-delay': `${(i % 4) * 80}ms` }}
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${TONES[tone]} ${
                motion === 'glow' ? 'group-hover:icon-glow' : ''
              }`}
            >
              <Icon className={`h-6 w-6 ${MOTION[motion] ?? ''}`} />
            </div>
            <h3 className="text-base font-semibold text-foreground">{t.services.items[i].title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t.services.items[i].text}
            </p>
            {i === PRESCRIPTION_CARD && (
              <a
                href={c.whatsappWith(t.prescription.message)}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 mt-4 inline-flex items-center gap-1.5 rounded-full bg-success px-3.5 py-2 text-xs font-semibold text-success-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="h-3.5 w-3.5" /> {t.prescription.button}
              </a>
            )}
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-125" />
          </article>
        ))}
      </div>
    </section>
  )
}
