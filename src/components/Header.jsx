import { useEffect, useState } from 'react'
import { Menu, Moon, Phone, Sun, X } from 'lucide-react'
import logo from '../assets/logo-mark.png'
import { useContact } from '../settings/SiteSettingsContext'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../hooks/useTheme'
import { useActiveSection } from '../hooks/useActiveSection'

const SECTION_IDS = ['services', 'why', 'location', 'contact']

function LanguageToggle() {
  const { lang, t, toggleLanguage } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title={t.nav.switchLanguage}
      className="relative inline-flex h-9 items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold shadow-sm transition-colors hover:border-primary/50"
    >
      <span
        className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-primary transition-transform duration-300 ${
          lang === 'te' ? 'translate-x-full' : ''
        }`}
      />
      <span
        className={`relative z-10 w-9 text-center sm:w-12 transition-colors ${
          lang === 'en' ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}
      >
        EN
      </span>
      <span
        className={`relative z-10 w-9 text-center sm:w-12 transition-colors ${
          lang === 'te' ? 'text-primary-foreground' : 'text-muted-foreground'
        }`}
      >
        <span className="sm:hidden">తె</span>
        <span className="hidden sm:inline">తెలుగు</span>
      </span>
      {/* the button's spoken name is its visible text plus this hint */}
      <span className="sr-only">{t.nav.switchLanguage}</span>
    </button>
  )
}

function ThemeToggle({ theme, onToggle, className = '' }) {
  const { t } = useLanguage()
  const label = theme === 'dark' ? t.nav.lightMode : t.nav.darkMode

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={`relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:border-primary/50 hover:text-primary ${className}`}
    >
      {/* both icons stay mounted and rotate/fade into each other */}
      <Sun
        className={`absolute h-4 w-4 transition-all duration-500 ${
          theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-500 ${
          theme === 'dark' ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
    </button>
  )
}

export default function Header() {
  const { t } = useLanguage()
  const c = useContact()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const active = useActiveSection(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = SECTION_IDS.map((id) => ({ id, href: `#${id}`, label: t.nav[id] }))

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-xl shadow-[var(--shadow-soft)]'
          : 'bg-background/60 backdrop-blur'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <a href="#top" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <img
            src={logo}
            alt="Arogya Medicals logo"
            width={56}
            height={56}
            className="h-10 w-10 flex-none animate-heartbeat object-contain min-[370px]:h-11 min-[370px]:w-11 sm:h-14 sm:w-14"
          />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-base font-bold text-accent-strong min-[370px]:text-lg sm:text-2xl">
              {t.brand.name}
            </div>
            <div className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
              {t.brand.tagline}
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => {
            const isActive = active === link.id
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-primary transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            )
          })}
          <LanguageToggle />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <a
            href={c.tel}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
          >
            <Phone className="h-4 w-4" /> {t.nav.callNow}
          </a>
        </nav>

        <div className="flex flex-none items-center gap-1.5 lg:hidden">
          <LanguageToggle />
          {/* phones get Call in the bottom action bar; tablets need it here */}
          <a
            href={c.tel}
            aria-label={t.nav.callNow}
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] md:inline-flex"
          >
            <Phone className="h-4.5 w-4.5" />
          </a>
          <button
            className="rounded-md p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label={t.nav.menu}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium hover:bg-muted hover:text-primary ${
                  active === link.id ? 'bg-primary/10 text-primary' : 'text-foreground/80'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center justify-between rounded-md px-3 py-2">
              <span className="text-base font-medium text-foreground/80">
                {t.nav.darkMode}
              </span>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
            <a
              href={c.tel}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> {t.nav.callNumber(c.phoneDisplay)}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
