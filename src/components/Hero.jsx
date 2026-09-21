import {
  ArrowRight,
  FileText,
  MessageCircle,
  Navigation,
  Phone,
  Pill,
  ShieldCheck,
  Store,
  Syringe,
  Tablets,
  Tag,
  UserCheck,
} from 'lucide-react'
import defaultHero from '../assets/hero.webp'
import { useContact, useSiteSettings } from '../settings/SiteSettingsContext'
import { useLanguage } from '../i18n/LanguageContext'
import OpenStatus from './OpenStatus'

const HERO_FLOATERS = [
  { icon: Pill, position: '-left-5 top-[38%]', tone: 'text-success', rotate: -14, delay: '-1s' },
  { icon: Syringe, position: '-bottom-5 right-[22%]', tone: 'text-primary', rotate: 20, delay: '-3s' },
  { icon: Tablets, position: 'top-[45%] -right-5', tone: 'text-accent-strong', rotate: 10, delay: '-5s' },
]

export default function Hero() {
  const { lang, t } = useLanguage()
  const c = useContact()
  // admin-uploaded image, or the original
  const hero = useSiteSettings().settings.images.hero ?? { url: defaultHero, width: 1678, height: 937 }

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'var(--gradient-soft)' }}
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 -z-10 h-[460px] w-[460px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'var(--gradient-hero)' }}
      />
      <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-[360px] w-[360px] rounded-full opacity-30 blur-3xl bg-accent" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-12 md:grid-cols-2 md:py-20 lg:py-24">
        <div className="animate-fade-up order-2 md:order-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[11px] font-bold text-accent-strong shadow-sm animate-pulse-soft sm:text-xs">
              <Tag className="h-3.5 w-3.5" />
              {t.hero.badge}
            </div>
            <OpenStatus />
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:mt-5 sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-2 text-base font-semibold sm:mt-3 sm:text-xl">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--gradient-hero)' }}
            >
              {t.hero.subtitle}
            </span>
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
            {t.hero.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
            <a
              href={c.tel}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)] hover:scale-[1.03] sm:px-5"
            >
              <Phone className="h-4 w-4 transition-transform group-hover:rotate-12" />
              {t.hero.call}
            </a>
            <a
              href={c.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-success-foreground shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)] hover:scale-[1.03] sm:px-5"
            >
              <MessageCircle className="h-4 w-4 transition-transform group-hover:rotate-[-8deg]" />
              {t.hero.whatsapp}
            </a>
            <a
              href={c.maps}
              target="_blank"
              rel="noreferrer"
              className="group col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-accent)] transition-all hover:scale-[1.03] sm:col-span-1 sm:px-5"
            >
              <Navigation className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              {t.hero.visit}
            </a>
          </div>

          <a
            href={c.whatsappWith(t.prescription.message)}
            target="_blank"
            rel="noreferrer"
            className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success hover:underline sm:mt-5"
          >
            <FileText className="h-4 w-4" />
            {t.hero.prescription}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms] order-1 md:order-2">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-glow)] sm:rounded-[2rem]">
            <img
              src={hero.url}
              alt={t.hero.imageAlt}
              width={hero.width}
              height={hero.height}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/10" />

            {/* Points at the man in the photo so visitors know he is the pharmacist, not a model.
                Sits low on sm+ to clear the "Visit Our Store" card overhanging the corner. */}
            <div className="pointer-events-none absolute right-1 top-1.5 flex animate-nudge flex-col items-end motion-reduce:animate-none sm:right-4 sm:top-20">
              <div className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-card/95 px-2 py-1.5 shadow-[var(--shadow-soft)] backdrop-blur sm:gap-2.5 sm:px-4 sm:py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary sm:h-9 sm:w-9">
                  <UserCheck className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-[11px] font-bold text-foreground sm:text-sm">
                    {t.hero.pharmacist}
                  </span>
                  <span className="block text-[9px] text-muted-foreground sm:text-xs">
                    {t.hero.pharmacistNote}
                  </span>
                </span>
              </div>

              {/* curve sweeping down-left from the tag to his coat */}
              <svg
                aria-hidden="true"
                viewBox="0 0 120 76"
                className="mr-2 -mt-0.5 h-12 w-20 text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] sm:mr-6 sm:h-24 sm:w-40"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M104 8C101 34 88 56 18 66" />
                <path d="M32 52 18 66l15 7" />
              </svg>
            </div>
          </div>

          {/* decorative medicines drifting around the photo (tablet & desktop only) */}
          {HERO_FLOATERS.map(({ icon: Icon, position, tone, rotate, delay }) => (
            <div
              key={position}
              aria-hidden="true"
              className={`pointer-events-none absolute hidden animate-float motion-reduce:animate-none sm:block ${position}`}
              style={{ animationDelay: delay, animationDuration: '6.5s' }}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] ${tone}`}
                style={{ transform: `rotate(${rotate}deg)` }}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          ))}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border border-border bg-card/95 px-3 py-2 shadow-[var(--shadow-soft)] backdrop-blur sm:-bottom-5 sm:-left-6 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success sm:h-10 sm:w-10 sm:rounded-xl">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold sm:text-sm">{t.hero.genuine}</div>
              <div className="text-[10px] text-muted-foreground sm:text-xs">{t.hero.licensed}</div>
            </div>
          </div>

          <div className="absolute -top-5 -right-3 hidden items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-soft)] sm:-right-6 sm:flex animate-float">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{t.hero.visitStore}</div>
              <div className="text-xs text-muted-foreground">{c.area[lang]}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
