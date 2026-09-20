import { useState } from 'react'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { PAYMENT_METHODS } from '../../lib/paymentMethods'
import { Field, StatusMessage, SwitchRow } from './AdminUi'
import { inputClass, labelClass, primaryButtonClass } from './adminStyles'
import { useSaveSetting } from './useSaveSetting'

function PaymentsForm() {
  const { payments } = useSiteSettings().settings
  const [methods, setMethods] = useState(payments.methods)
  const { status, save, fail, reset } = useSaveSetting('payments')

  const toggle = (id) => {
    setMethods((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))
    reset()
  }

  const submit = (e) => {
    e.preventDefault()
    if (!methods.length) return fail('Select at least one payment method.')
    // keep the display order fixed
    save({ methods: PAYMENT_METHODS.map((m) => m.id).filter((id) => methods.includes(id)) })
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border p-4">
      <div>
        <span className={labelClass}>Payment methods accepted</span>
        <div className="grid gap-2 sm:grid-cols-2">
          {PAYMENT_METHODS.map(({ id, icon: Icon, en, te }) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                methods.includes(id) ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <input
                type="checkbox"
                checked={methods.includes(id)}
                onChange={() => toggle(id)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <Icon className="h-4 w-4 text-primary" />
              {en}
              {te !== en && <span className="text-xs text-muted-foreground">({te})</span>}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusMessage status={status} />
        <button type="submit" disabled={status.type === 'saving'} className={`${primaryButtonClass} ml-auto`}>
          Save payment methods
        </button>
      </div>
    </form>
  )
}

const validPercent = (v) => {
  const n = Number(v)
  return Number.isInteger(n) && n >= 1 && n <= 90 ? n : null
}

function PercentInput({ value, onChange, label }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={90}
        step={1}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} max-w-[8rem]`}
      />
      <span className="text-sm font-semibold">% OFF</span>
    </div>
  )
}

function OfferForm() {
  const { settings, today } = useSiteSettings()
  const { offer } = settings
  const [showPercent, setShowPercent] = useState(Boolean(offer.discount))
  const [discount, setDiscount] = useState(offer.discount ? String(offer.discount) : '10')
  const [promoOn, setPromoOn] = useState(Boolean(offer.scheduled))
  const [promo, setPromo] = useState({
    discount: offer.scheduled ? String(offer.scheduled.discount) : '20',
    from: offer.scheduled?.from ?? today,
    until: offer.scheduled?.until ?? '',
  })
  const { status, save, fail, reset } = useSaveSetting('offer')

  const change = (setter) => (value) => {
    setter(value)
    reset()
  }

  const submit = (e) => {
    e.preventDefault()
    const everyday = showPercent ? validPercent(discount) : null
    if (showPercent && !everyday) return fail('Everyday discount must be a whole number from 1 to 90.')

    let scheduled = null
    if (promoOn) {
      const n = validPercent(promo.discount)
      if (!n) return fail('Offer discount must be a whole number from 1 to 90.')
      if (!promo.from || !promo.until) return fail('Choose both a start date and an end date for the offer.')
      if (promo.until < promo.from) return fail('The offer end date must be on or after the start date.')
      if (promo.until < today) return fail('That offer has already ended — choose an end date from today onwards.')
      scheduled = { discount: n, from: promo.from, until: promo.until }
    }

    const running = scheduled && today >= scheduled.from
    const shown = running ? scheduled.discount : everyday
    save(
      { discount: everyday, scheduled },
      running
        ? `Saved — the offer is running: the website says “${shown}% OFF” until ${scheduled.until}.`
        : shown
          ? `Saved — the website says “${shown}% OFF”.`
          : 'Saved — the website says “Best Discounts on All Medicines”.',
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border p-4">
      <div className="text-sm font-semibold">Discount</div>
      <SwitchRow
        title="Everyday discount percentage"
        description={
          showPercent
            ? 'On — the website shows “X% OFF on All Medicines”'
            : 'Off — the website shows “Best Discounts on All Medicines”'
        }
        checked={showPercent}
        onChange={change(setShowPercent)}
      />
      {showPercent && (
        <Field
          label="Everyday discount (%)"
          hint="Updates every discount text on the site, in English and Telugu. The poster image isn't changed — upload a new poster in the Images tab if needed."
        >
          <PercentInput value={discount} onChange={change(setDiscount)} label="Everyday discount" />
        </Field>
      )}

      <SwitchRow
        title="Limited-time offer"
        description={
          promoOn
            ? 'Between the dates below, this discount replaces the everyday one — then it switches back by itself'
            : 'Schedule a festival or special offer with start and end dates'
        }
        checked={promoOn}
        onChange={change(setPromoOn)}
      />
      {promoOn && (
        <div className="grid gap-4 rounded-2xl border border-dashed border-border p-4 sm:grid-cols-3">
          <Field label="Offer discount">
            <PercentInput
              value={promo.discount}
              onChange={(v) => change(setPromo)({ ...promo, discount: v })}
              label="Offer discount"
            />
          </Field>
          <Field label="Starts on">
            <input
              type="date"
              value={promo.from}
              onChange={(e) => change(setPromo)({ ...promo, from: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Ends on (inclusive)">
            <input
              type="date"
              value={promo.until}
              onChange={(e) => change(setPromo)({ ...promo, until: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusMessage status={status} />
        <button type="submit" disabled={status.type === 'saving'} className={`${primaryButtonClass} ml-auto`}>
          Save discount
        </button>
      </div>
    </form>
  )
}

export default function PaymentsOfferTab() {
  return (
    <div className="space-y-5">
      <PaymentsForm />
      <OfferForm />
    </div>
  )
}
