import { useState } from 'react'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { isNoticeActive } from '../../lib/notice'
import { NOTICE_TONES } from '../../lib/noticeTones'
import NoticeBanner from '../NoticeBanner'
import { Field, SaveBar, SwitchRow } from './AdminUi'
import { inputClass, labelClass } from './adminStyles'
import { useSaveSetting } from './useSaveSetting'

export default function BannerTab() {
  const { settings, today } = useSiteSettings()
  const { notice } = settings
  const [form, setForm] = useState(notice)
  const { status, save, fail, reset } = useSaveSetting('notice')

  const update = (patch) => {
    setForm({ ...form, ...patch })
    reset()
  }

  const submit = (e) => {
    e.preventDefault()
    if (form.enabled && !form.en.trim()) return fail('Write the English message before switching the banner on.')
    const value = { ...form, en: form.en.trim(), te: form.te.trim(), until: form.until || null }
    save(value, isNoticeActive(value, today) ? 'Saved — the banner is now live.' : 'Saved — the banner is hidden.')
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <SwitchRow
        title="Show banner on the website"
        description={form.enabled ? 'On — visitors see it at the top of the page' : 'Off — hidden from visitors'}
        checked={form.enabled}
        onChange={(enabled) => update({ enabled })}
      />

      <Field label="Message (English)">
        <textarea
          rows={2}
          maxLength={160}
          value={form.en}
          onChange={(e) => update({ en: e.target.value })}
          placeholder="e.g. Closed on 1 Nov for Diwali. Happy Diwali!"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="Message (Telugu) — optional" hint="If left empty, Telugu visitors see the English message.">
        <textarea
          rows={2}
          maxLength={160}
          value={form.te}
          onChange={(e) => update({ te: e.target.value })}
          placeholder="Type the Telugu version here"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <div>
        <span className={labelClass}>Style</span>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(NOTICE_TONES).map(([key, tone]) => {
            const Icon = tone.icon
            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ tone: key })}
                aria-pressed={form.tone === key}
                className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors ${
                  form.tone === key ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                }`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${tone.className}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {tone.label}
              </button>
            )
          })}
        </div>
      </div>

      <Field
        label="Show until (optional)"
        hint="The banner hides itself automatically after this day. Leave empty to show it until you switch it off."
      >
        <input
          type="date"
          value={form.until ?? ''}
          onChange={(e) => update({ until: e.target.value || null })}
          className={inputClass}
        />
      </Field>

      {(form.en || form.te) && (
        <div>
          <span className={labelClass}>Preview</span>
          <div className="space-y-2 overflow-hidden rounded-xl border border-border">
            {form.en && <NoticeBanner notice={form} preview lang="en" />}
            {form.te && <NoticeBanner notice={form} preview lang="te" />}
          </div>
        </div>
      )}

      <SaveBar status={status} />
    </form>
  )
}
