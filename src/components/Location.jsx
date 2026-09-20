import { useRef, useState } from 'react'
import { Map, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import { useContact } from '../settings/SiteSettingsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { track } from '../lib/track'
import { useInView } from '../hooks/useReveal'

// Decorative street-grid pattern so the placeholder reads as a map.
function MapBackdrop() {
  return (
    <svg
      className="absolute inset-0 h-full w-full text-primary opacity-[0.12]"
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 400 200"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M-10 60 C80 40 160 90 250 70 S380 30 420 50" strokeWidth="6" />
        <path d="M-10 150 C100 130 200 170 300 140 S390 120 420 130" strokeWidth="4" />
        <path d="M90 -10 C100 60 70 130 95 210" strokeWidth="5" />
        <path d="M230 -10 C220 70 260 140 240 210" strokeWidth="3" />
        <path d="M330 -10 L350 210" strokeWidth="2" />
        <path d="M-10 105 L420 95" strokeWidth="1.5" />
        <path d="M160 -10 L170 210" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

export default function Location() {
  const { lang, t } = useLanguage()
  const c = useContact()
  const address = c.address[lang].join(' ')
  const [showMap, setShowMap] = useState(false)
  const placeholderRef = useRef(null)
  useInView(placeholderRef) // the bouncing pin only animates while visible

  return (
    <section id="location" className="bg-muted/40 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <MapPin className="h-3.5 w-3.5" /> {t.location.badge}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.location.title}</h2>
          <p className="mt-3 text-muted-foreground">{address}</p>
        </div>

        <div data-reveal className="mt-10 overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
          {showMap ? (
            <iframe
              title="Arogya Medicals location"
              src={c.mapsEmbed}
              className="h-[380px] w-full md:h-[460px]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            // Google's map embed is the heaviest thing on the page, so only load it on request.
            <button
              ref={placeholderRef}
              type="button"
              onClick={() => {
                setShowMap(true)
                track('map')
              }}
              className="pause-offscreen group relative flex h-[380px] w-full flex-col items-center justify-center gap-4 overflow-hidden md:h-[460px]"
              style={{ background: 'var(--gradient-soft)' }}
            >
              <MapBackdrop />
              <span className="relative flex h-16 w-16 items-center justify-center">
                {/* location "ping" ripple under the bouncing pin */}
                <span className="absolute bottom-0 h-4 w-10 animate-ping rounded-full bg-primary/30 motion-reduce:hidden" />
                <span className="relative flex h-16 w-16 animate-pin-bounce items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-transform group-hover:scale-110">
                  <MapPin className="h-8 w-8" />
                </span>
              </span>
              <span className="relative max-w-xs rounded-xl bg-card/90 px-4 py-2 text-center text-sm font-medium text-foreground shadow-[var(--shadow-soft)] backdrop-blur">
                {address}
              </span>
              <span className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-[var(--shadow-soft)] transition-colors group-hover:border-primary">
                <Map className="h-4 w-4" /> {t.location.loadMap}
              </span>
              <span className="relative text-xs text-muted-foreground">{t.location.mapHint}</span>
            </button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={c.maps}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
          >
            <Navigation className="h-4 w-4" /> {t.location.openMaps}
          </a>
          <a
            href={c.tel}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            <Phone className="h-4 w-4" /> {t.location.call}
          </a>
          <a
            href={c.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-success px-5 py-3 text-sm font-semibold text-success-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-4 w-4" /> {t.location.whatsapp}
          </a>
        </div>
      </div>
    </section>
  )
}
