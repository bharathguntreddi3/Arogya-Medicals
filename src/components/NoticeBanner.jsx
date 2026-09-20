import { useSyncExternalStore } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useSiteSettings } from '../settings/SiteSettingsContext'
import { isNoticeActive } from '../lib/notice'
import { NOTICE_TONES } from '../lib/noticeTones'

// Which banner message this visitor closed (for the rest of their visit). Read through
// useSyncExternalStore so the pre-rendered page (which can't know it) hydrates cleanly.
const DISMISS_KEY = 'arogya-notice-dismissed'
const listeners = new Set()

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY)
  } catch {
    return null
  }
}

function dismiss(message) {
  try {
    sessionStorage.setItem(DISMISS_KEY, message)
  } catch {
    // storage unavailable — it just stays closed until the page reloads
  }
  listeners.forEach((notify) => notify())
}

const subscribe = (notify) => {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

/**
 * The admin-controlled strip at the very top of the site.
 * `preview` renders it inside the admin panel: always shown, no close button.
 */
export default function NoticeBanner({ notice, preview = false, lang: langOverride }) {
  const { lang: siteLang, t } = useLanguage()
  const { today } = useSiteSettings()
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => null)
  const lang = langOverride ?? siteLang

  if (!notice) return null
  const message = (lang === 'te' && notice.te) || notice.en || notice.te
  if (!message) return null
  if (!preview && (!isNoticeActive(notice, today) || dismissed === message)) return null

  const tone = NOTICE_TONES[notice.tone] ?? NOTICE_TONES.holiday
  const Icon = tone.icon

  return (
    <div className={`relative ${tone.className}`} role={preview ? undefined : 'region'} aria-label="Notice">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-10 py-2.5 text-center text-sm font-semibold sm:px-12">
        <Icon className="h-4 w-4 flex-none" />
        <p>{message}</p>
      </div>
      {!preview && (
        <button
          type="button"
          onClick={() => dismiss(message)}
          aria-label={t.nav.closeNotice}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 opacity-80 transition-opacity hover:bg-white/15 hover:opacity-100 sm:right-4"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
