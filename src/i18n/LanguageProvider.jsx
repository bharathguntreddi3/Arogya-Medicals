import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContext'
import { translations } from './translations'
import { useSiteSettings } from '../settings/SiteSettingsContext'

const STORAGE_KEY = 'arogya-lang'
const TELUGU_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap'

function initialLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'te' ? 'te' : 'en'
  } catch {
    // no localStorage during the build-time pre-render
    return 'en'
  }
}

// The Telugu font is only downloaded once someone actually picks Telugu,
// so English visitors don't wait for it.
function loadTeluguFont() {
  if (document.getElementById('font-telugu')) return
  const link = document.createElement('link')
  link.id = 'font-telugu'
  link.rel = 'stylesheet'
  link.href = TELUGU_FONT_URL
  document.head.appendChild(link)
}

// Resolves offer text across the translation tree: D(withDiscount, withoutDiscount) pairs
// become one string, and {discount} is filled in.
function fill(node, values) {
  if (typeof node === 'string') return node.replace(/\{(\w+)\}/g, (m, key) => values[key] ?? m)
  if (Array.isArray(node)) return node.map((n) => fill(n, values))
  if (node && typeof node === 'object' && 'withDiscount' in node) {
    return fill(values.discount ? node.withDiscount : node.withoutDiscount, values)
  }
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, fill(v, values)]))
  }
  return node
}

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage)
  const { discount } = useSiteSettings()

  useEffect(() => {
    document.documentElement.lang = lang
    if (lang === 'te') loadTeluguFont()
    // index.html hides the English pre-render for Telugu visitors until this first render
    document.documentElement.classList.remove('lang-pending')
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage unavailable — language just won't persist
    }
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      t: fill(translations[lang], { discount }),
      toggleLanguage: () => setLang((l) => (l === 'en' ? 'te' : 'en')),
    }),
    [lang, discount],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
