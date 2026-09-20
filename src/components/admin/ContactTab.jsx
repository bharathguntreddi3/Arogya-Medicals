import { useState } from 'react'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { Field, SaveBar } from './AdminUi'
import { inputClass } from './adminStyles'
import { useSaveSetting } from './useSaveSetting'

const PHONE_RE = /^[6-9]\d{9}$/
const SOCIALS = [
  ['facebook', 'Facebook page link'],
  ['instagram', 'Instagram profile link'],
  ['youtube', 'YouTube channel link'],
]

const digitsOnly = (s) => s.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
const isUrlOrEmpty = (s) => !s || /^https:\/\/\S+$/.test(s)

function Section({ title, children }) {
  return (
    <fieldset className="space-y-4 rounded-2xl border border-border p-4">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  )
}

export default function ContactTab() {
  const { contact } = useSiteSettings().settings
  const [form, setForm] = useState(() => structuredClone(contact))
  const [sameWhatsapp, setSameWhatsapp] = useState(contact.whatsapp === contact.phone)
  const { status, save, fail, reset } = useSaveSetting('contact')

  const edit = (fn) => {
    const next = structuredClone(form)
    fn(next)
    setForm(next)
    reset()
  }

  const submit = (e) => {
    e.preventDefault()
    const phone = digitsOnly(form.phone)
    const whatsapp = sameWhatsapp ? phone : digitsOnly(form.whatsapp)
    if (!PHONE_RE.test(phone)) return fail('Phone number must be a 10-digit Indian mobile number.')
    if (!PHONE_RE.test(whatsapp)) return fail('WhatsApp number must be a 10-digit Indian mobile number.')
    if (!form.address.en[0].trim() || !form.address.en[1].trim())
      return fail('Fill in both English address lines.')
    if (!form.mapsQuery.trim()) return fail('Fill in the Google Maps search text.')
    for (const url of [form.reviewLink, ...Object.values(form.social)]) {
      if (!isUrlOrEmpty(url.trim())) return fail(`Links must start with https:// — check “${url}”.`)
    }

    const trim = (v) => v.trim()
    save({
      phone,
      whatsapp,
      address: {
        en: form.address.en.map(trim),
        // Telugu falls back to English line by line
        te: form.address.te.map((line, i) => line.trim() || form.address.en[i].trim()),
      },
      area: { en: form.area.en.trim(), te: form.area.te.trim() || form.area.en.trim() },
      mapsQuery: form.mapsQuery.trim(),
      reviewLink: form.reviewLink.trim(),
      social: Object.fromEntries(Object.entries(form.social).map(([k, v]) => [k, v.trim()])),
    })
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <Section title="Phone numbers">
        <Field label="Phone number" hint="10 digits, without +91. Used for all Call buttons.">
          <input
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => edit((f) => (f.phone = e.target.value))}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sameWhatsapp}
            onChange={(e) => {
              setSameWhatsapp(e.target.checked)
              reset()
            }}
            className="h-4 w-4 accent-[var(--primary)]"
          />
          WhatsApp uses the same number
        </label>
        {!sameWhatsapp && (
          <Field label="WhatsApp number" hint="Used for all WhatsApp buttons and the contact form.">
            <input
              type="tel"
              inputMode="numeric"
              value={form.whatsapp}
              onChange={(e) => edit((f) => (f.whatsapp = e.target.value))}
              className={inputClass}
            />
          </Field>
        )}
      </Section>

      <Section title="Address">
        {[0, 1].map((i) => (
          <Field key={`en${i}`} label={`English — line ${i + 1}`}>
            <input
              value={form.address.en[i]}
              onChange={(e) => edit((f) => (f.address.en[i] = e.target.value))}
              className={inputClass}
            />
          </Field>
        ))}
        {[0, 1].map((i) => (
          <Field
            key={`te${i}`}
            label={`Telugu — line ${i + 1} (optional)`}
            hint={i === 1 ? 'Empty lines show the English text on the Telugu site.' : undefined}
          >
            <input
              value={form.address.te[i]}
              onChange={(e) => edit((f) => (f.address.te[i] = e.target.value))}
              className={inputClass}
            />
          </Field>
        ))}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Short area name (English)" hint="Shown on the hero photo card.">
            <input
              value={form.area.en}
              onChange={(e) => edit((f) => (f.area.en = e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Short area name (Telugu)">
            <input
              value={form.area.te}
              onChange={(e) => edit((f) => (f.area.te = e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>
        <Field
          label="Google Maps search text"
          hint="What Google Maps searches for on the map and Directions buttons — usually shop name + area + PIN code."
        >
          <input
            value={form.mapsQuery}
            onChange={(e) => edit((f) => (f.mapsQuery = e.target.value))}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Links">
        <Field
          label="Google review link (optional)"
          hint="From Google Business Profile → Ask for reviews. Empty = opens your shop on Google Maps."
        >
          <input
            type="url"
            placeholder="https://g.page/r/…/review"
            value={form.reviewLink}
            onChange={(e) => edit((f) => (f.reviewLink = e.target.value))}
            className={inputClass}
          />
        </Field>
        {SOCIALS.map(([key, label]) => (
          <Field key={key} label={`${label} (optional)`}>
            <input
              type="url"
              placeholder="https://…"
              value={form.social[key]}
              onChange={(e) => edit((f) => (f.social[key] = e.target.value))}
              className={inputClass}
            />
          </Field>
        ))}
        <p className="text-xs text-muted-foreground">Social icons appear in the footer only when a link is filled in.</p>
      </Section>

      <SaveBar status={status} />
    </form>
  )
}
