import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Sparkles, Tag, Trash2 } from 'lucide-react'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { SaveBar, SwitchRow } from './AdminUi'
import { inputClass, secondaryButtonClass } from './adminStyles'
import { useSaveSetting } from './useSaveSetting'

const MAX_ITEMS = 6
const iconButton =
  'rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30'

export default function RibbonTab() {
  const { settings, discount } = useSiteSettings()
  const [form, setForm] = useState(() => structuredClone(settings.ribbon))
  const { status, save, fail, reset } = useSaveSetting('ribbon')

  const edit = (fn) => {
    const next = structuredClone(form)
    fn(next)
    setForm(next)
    reset()
  }

  const move = (i, step) =>
    edit((f) => {
      const [item] = f.items.splice(i, 1)
      f.items.splice(i + step, 0, item)
    })

  const submit = (e) => {
    e.preventDefault()
    const items = form.items
      .map((item) => ({ en: item.en.trim(), te: item.te.trim() }))
      .filter((item) => item.en || item.te)
    if (items.some((item) => !item.en)) return fail('Every message needs an English version.')
    if (!form.showOffer && !items.length) return fail('Keep at least one message, or switch the discount message on.')
    save({ showOffer: form.showOffer, items })
  }

  const offerText = discount ? `${discount}% OFF on All Medicines` : 'Best Discounts on All Medicines'

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-sm text-muted-foreground">
        The orange strip that scrolls across the top of every page.
      </p>

      <SwitchRow
        title="Show the discount message"
        description={`Currently: “${offerText}” — follows the Payments & offer tab`}
        checked={form.showOffer}
        onChange={(showOffer) => edit((f) => (f.showOffer = showOffer))}
      />

      <div className="space-y-3">
        {form.items.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message {i + 1}
              </span>
              <span className="flex">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={iconButton}>
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={i === form.items.length - 1}
                  onClick={() => move(i, 1)}
                  className={iconButton}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete message ${i + 1}`}
                  onClick={() => edit((f) => f.items.splice(i, 1))}
                  className={`${iconButton} hover:text-destructive`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                aria-label={`Message ${i + 1} in English`}
                placeholder="English, e.g. Free BP check every Sunday"
                maxLength={80}
                value={item.en}
                onChange={(e) => edit((f) => (f.items[i].en = e.target.value))}
                className={inputClass}
              />
              <input
                aria-label={`Message ${i + 1} in Telugu`}
                placeholder="Telugu (optional)"
                maxLength={80}
                value={item.te}
                onChange={(e) => edit((f) => (f.items[i].te = e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        ))}
        {form.items.length < MAX_ITEMS && (
          <button type="button" onClick={() => edit((f) => f.items.push({ en: '', te: '' }))} className={secondaryButtonClass}>
            <Plus className="h-4 w-4" /> Add a message
          </button>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Preview
        </span>
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-xl px-4 py-2 text-sm font-semibold text-accent-foreground"
          style={{ background: 'var(--gradient-ribbon)' }}
        >
          {form.showOffer && (
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> {offerText}
            </span>
          )}
          {form.items
            .filter((item) => item.en.trim())
            .map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> {item.en}
              </span>
            ))}
        </div>
      </div>

      <SaveBar status={status} />
    </form>
  )
}
