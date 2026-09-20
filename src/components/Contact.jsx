import { useState } from 'react'
import {
  Clock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Check,
  Send,
  User,
  Wallet,
} from 'lucide-react'
import { useContact, useSiteSettings } from '../settings/SiteSettingsContext'
import { hoursLines } from '../lib/hours'
import { enabledPaymentMethods } from '../lib/paymentMethods'
import { insertRow, track } from '../lib/track'
import { useLanguage } from '../i18n/LanguageContext'

// `website` is a hidden trap field: people never see it, spam bots fill it in.
const EMPTY_FORM = { name: '', phone: '', message: '', website: '' }

// Returns error keys (looked up in t.contact.errors) so messages follow the chosen language.
function validate({ name, phone, message }) {
  const errors = {}
  const n = name.trim()
  const p = phone.trim()
  const m = message.trim()

  if (n.length < 2) errors.name = 'name'
  else if (n.length > 80) errors.name = 'nameLong'

  if (!/^[0-9+\-\s()]{7,15}$/.test(p)) errors.phone = 'phone'

  if (m.length < 5) errors.message = 'messageShort'
  else if (m.length > 500) errors.message = 'messageLong'

  return { errors, data: { name: n, phone: p, message: m } }
}

function InfoRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <div className="mt-0.5 text-sm leading-relaxed text-foreground">{children}</div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, error, multiline, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div
        className={`flex gap-3 rounded-xl border bg-background px-3.5 py-3 transition-colors focus-within:border-primary ${
          error ? 'border-destructive' : 'border-border'
        } ${multiline ? 'items-start' : 'items-center'}`}
      >
        <Icon className={`h-4 w-4 flex-none text-muted-foreground ${multiline ? 'mt-1' : ''}`} />
        {children}
      </div>
      {error && <span className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  )
}

export default function Contact() {
  const { lang, t } = useLanguage()
  const c = useContact()
  const { hours, payments } = useSiteSettings().settings
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  // 'idle' → 'flying' (paper plane leaves) → 'sent' (green tick) → back to 'idle'
  const [phase, setPhase] = useState('idle')
  const sent = phase === 'sent'

  const errorText = (field) => errors[field] && t.contact.errors[errors[field]]

  const handleSubmit = (e) => {
    e.preventDefault()
    const { errors: found, data } = validate(form)
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }
    setErrors({})

    // Keep a copy in the admin Enquiries inbox (skipped for bots), then open WhatsApp.
    // WhatsApp must open straight away — browsers block pop-ups opened after waiting.
    if (!form.website) {
      insertRow('enquiries', { ...data, lang })
      track('enquiry')
    }
    const text = `Hi Arogya Medicals!\nName: ${data.name}\nPhone: ${data.phone}\nMessage: ${data.message}`
    window.open(c.whatsappWith(text), '_blank', 'noopener')

    setForm(EMPTY_FORM)
    setPhase('flying')
    setTimeout(() => setPhase('sent'), 550)
    setTimeout(() => setPhase('idle'), 4500)
  }

  const inputClass =
    'w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none'

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-2">
        <div data-reveal>
          <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <MessageSquare className="h-3.5 w-3.5" /> {t.contact.badge}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.contact.title}</h2>
          <p className="mt-3 text-muted-foreground">{t.contact.description}</p>

          <div className="mt-7 space-y-4">
            <InfoRow icon={Phone} title={t.contact.phone}>
              <a href={c.tel} className="hover:text-primary">
                {c.phoneIntl}
              </a>
            </InfoRow>
            <InfoRow icon={MessageCircle} title={t.contact.whatsapp}>
              <a href={c.whatsapp} target="_blank" rel="noreferrer" className="hover:text-success">
                {t.contact.chat}
              </a>
            </InfoRow>
            <InfoRow icon={MapPin} title={t.contact.address}>
              {c.address[lang][0]}
              <br />
              {c.address[lang][1]}
            </InfoRow>
            <InfoRow icon={Wallet} title={t.contact.payment}>
              {enabledPaymentMethods(payments.methods)
                .map((m) => m[lang])
                .join(' · ')}
            </InfoRow>
            <InfoRow icon={Clock} title={t.contact.timings}>
              {hoursLines(hours.days, t).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </InfoRow>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          data-reveal
          className="relative rounded-3xl border border-border p-6 shadow-[var(--shadow-soft)] sm:p-8"
          style={{ background: 'var(--gradient-card)', '--reveal-delay': '120ms' }}
        >
          <h3 className="text-xl font-bold">{t.contact.formTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t.contact.formSubtitle}</p>

          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />
          <div className="mt-6 space-y-4">
            <Field icon={User} label={t.contact.name} error={errorText('name')}>
              <input
                type="text"
                maxLength={80}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t.contact.namePlaceholder}
                className={inputClass}
              />
            </Field>
            <Field icon={Phone} label={t.contact.phone} error={errorText('phone')}>
              <input
                type="tel"
                maxLength={15}
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="98851 91077"
                className={inputClass}
              />
            </Field>
            <Field icon={MessageSquare} label={t.contact.message} error={errorText('message')} multiline>
              <textarea
                maxLength={500}
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t.contact.messagePlaceholder}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={phase !== 'idle'}
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-semibold shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-glow)] hover:scale-[1.01] ${
              sent ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'
            }`}
          >
            {sent ? (
              <>
                <Check className="h-4 w-4 animate-pop-in" /> {t.contact.sentButton}
              </>
            ) : (
              <>
                <Send className={`h-4 w-4 ${phase === 'flying' ? 'animate-fly-away' : ''}`} /> {t.contact.submit}
              </>
            )}
          </button>
          {sent && (
            <p className="mt-3 text-center text-sm font-medium text-success">{t.contact.sent}</p>
          )}
        </form>
      </div>
    </section>
  )
}
