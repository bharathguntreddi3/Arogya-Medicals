import { useRef } from 'react'
import { MessageCircle, Phone, Sparkles } from 'lucide-react'
import defaultPoster from '../assets/poster.webp'
import { useContact, useSiteSettings } from '../settings/SiteSettingsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTilt } from '../hooks/useTilt'

export default function FeaturedOffer() {
  const { t } = useLanguage()
  const c = useContact()
  const posterRef = useRef(null)
  useTilt(posterRef)
  // admin-uploaded poster, or the original
  const poster =
    useSiteSettings().settings.images.poster ?? { url: defaultPoster, width: 1024, height: 1536 }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <div
        data-reveal
        className="relative overflow-hidden rounded-3xl border border-border p-6 shadow-[var(--shadow-soft)] sm:p-10"
        style={{ background: 'var(--gradient-soft)' }}
      >
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--gradient-hero)' }}
        />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/30 opacity-40 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent-strong">
              <Sparkles className="h-3.5 w-3.5" /> {t.featured.badge}
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.featured.title}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              {t.featured.textBefore}
              <span className="font-semibold text-accent-strong">{t.featured.highlight}</span>
              {t.featured.textAfter}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={c.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-success px-5 py-3 text-sm font-semibold text-success-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
              >
                <MessageCircle className="h-4 w-4" /> {t.featured.enquire}
              </a>
              <a
                href={c.tel}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                <Phone className="h-4 w-4" /> {c.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div
              ref={posterRef}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glow)] will-change-transform"
            >
              <img
                src={poster.url}
                alt={t.featured.posterAlt}
                width={poster.width}
                height={poster.height}
                className="h-auto w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
