import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export default function BackToTop() {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.nav.backToTop}
      title={t.nav.backToTop}
      tabIndex={visible ? 0 : -1}
      // Phones: sits above the bottom action bar. Desktop: above the floating WhatsApp button.
      className={`fixed right-4 bottom-[88px] z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary md:right-[26px] md:bottom-24 ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
