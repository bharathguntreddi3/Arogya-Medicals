import { Clock, MessageCircle, Phone } from 'lucide-react'
import { useContact, useSiteSettings } from '../settings/SiteSettingsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { dayRangeLabel, formatSlot, groupDays } from '../lib/hours'
import OpenStatus from './OpenStatus'
import PaymentMethods from './PaymentMethods'
import FloatingMedicines from './FloatingMedicines'

export default function WorkingHours() {
  const { t } = useLanguage()
  const c = useContact()
  const { hours } = useSiteSettings().settings

  return (
    <section id="hours" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <div className="grid gap-6 md:grid-cols-2">
        <div
          data-reveal
          className="rounded-3xl border border-border p-6 shadow-[var(--shadow-soft)] sm:p-8"
          style={{ background: 'var(--gradient-card)' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{t.hours.title}</h2>
              <p className="text-sm text-muted-foreground">{t.hours.subtitle}</p>
            </div>
          </div>

          <OpenStatus className="mt-5" />

          <div className="mt-5 space-y-3">
            {groupDays(hours.days).map((group) => (
              <div
                key={group.days.join()}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
              >
                <span className="text-sm font-semibold text-foreground">
                  {dayRangeLabel(group, t.days)}
                </span>
                {group.closed ? (
                  <span className="text-right text-sm font-medium text-destructive">{t.days.closed}</span>
                ) : (
                  <span className="text-right text-sm font-medium text-primary">
                    {group.slots.map((slot) => (
                      <span key={slot.open} className="block">
                        {formatSlot(slot)}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>

          <PaymentMethods className="mt-5" />

          <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            {t.hours.note}
          </div>
        </div>

        <div
          data-reveal
          style={{ background: 'var(--gradient-hero)', '--reveal-delay': '120ms' }}
          className="relative flex flex-col overflow-hidden rounded-3xl border border-border p-8 text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <h3 className="text-2xl font-bold">{t.hours.offerTitle}</h3>
          <p className="mt-2 max-w-md text-primary-foreground/85">{t.hours.offerText}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={c.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-transform hover:scale-[1.03]"
            >
              <MessageCircle className="h-4 w-4" /> {t.hours.enquire}
            </a>
            <a
              href={c.tel}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20"
            >
              <Phone className="h-4 w-4" /> {t.hours.reserve}
            </a>
          </div>
          {/* fills the space left when this card stretches to match the hours card */}
          <FloatingMedicines className="mt-6 min-h-[130px] flex-1" />
        </div>
      </div>
    </section>
  )
}
