import {
  Award,
  BadgeIndianRupee,
  HeartPulse,
  Package,
  ShieldCheck,
  Star,
  Stethoscope,
  Store,
} from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useContact } from '../settings/SiteSettingsContext'

// Same order as t.why.items
const ICONS = [ShieldCheck, BadgeIndianRupee, HeartPulse, Store, Stethoscope, Package]

export default function WhyUs() {
  const { t } = useLanguage()
  const c = useContact()

  return (
    <section id="why" className="bg-muted/40 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <Award className="h-3.5 w-3.5" /> {t.why.badge}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.why.title}</h2>
          <p className="mt-3 text-muted-foreground">{t.why.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ICONS.map((Icon, i) => (
            <article
              key={i}
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 90}ms` }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 flex-none items-center justify-center rounded-xl text-primary-foreground shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110"
                  style={{ background: 'var(--gradient-hero)' }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{t.why.items[i].title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t.why.items[i].text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)] sm:flex-row sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex gap-0.5 text-accent" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <div>
              <h3 className="text-base font-semibold">{t.why.rateTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.why.rateText}</p>
            </div>
          </div>
          <a
            href={c.review}
            data-track="review"
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-none items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
          >
            <Star className="h-4 w-4" /> {t.why.rateButton}
          </a>
        </div>
      </div>
    </section>
  )
}
