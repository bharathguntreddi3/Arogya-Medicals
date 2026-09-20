import { Clock, Lock, MapPin, MessageCircle, Phone } from 'lucide-react'
import logo from '../assets/logo-mark.png'
import { useContact, useSiteSettings } from '../settings/SiteSettingsContext'
import { hoursLines } from '../lib/hours'
import { Facebook, Instagram, Youtube } from './BrandIcons'
import EcgLine from './EcgLine'
import { useLanguage } from '../i18n/LanguageContext'

const LINK_HREFS = ['#services', '#why', '#location', '#contact']

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, youtube: Youtube }
const SOCIAL_NAMES = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' }

export default function Footer() {
  const { lang, t } = useLanguage()
  const c = useContact()
  const { hours } = useSiteSettings().settings
  // social icons only appear once the admin has added a link
  const socials = Object.entries(c.social).filter(([, url]) => url)

  return (
    <footer className="border-t border-border bg-muted/40">
      <EcgLine />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-4 pb-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Arogya Medicals"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              loading="lazy"
            />
            <div>
              <div className="text-lg font-bold text-primary">{t.brand.name}</div>
              <div className="text-xs font-medium text-muted-foreground">{t.brand.tagline}</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t.footer.about}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key]
              return (
                <a
                  key={key}
                  href={url}
                  aria-label={SOCIAL_NAMES[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
            <a
              href={c.whatsapp}
              aria-label={t.mobile.chatAria}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {t.footer.quickLinks}
          </h4>
          <ul className="mt-4 space-y-2.5">
            {LINK_HREFS.map((href, i) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.footer.links[i]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
            {t.footer.contact}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 flex-none text-primary" />
              <a href={c.tel} className="hover:text-primary">
                {c.phoneIntl}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-primary" />
              <span>{c.address[lang][1]}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 flex-none text-primary" />
              <span>
                {hoursLines(hours.days, t).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        {/* md:pr-24 keeps the Admin link clear of the floating WhatsApp / back-to-top buttons */}
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 md:pr-24">
          <span>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {t.footer.rights}
          </span>
          {/* the admin is its own page, opened in a new tab */}
          <a
            href="/admin"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:text-primary"
          >
            <Lock className="h-3 w-3" /> {t.footer.admin}
          </a>
        </div>
      </div>
    </footer>
  )
}
