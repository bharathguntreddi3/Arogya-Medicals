import { useState } from 'react'
import { Copy, Plus, Trash2 } from 'lucide-react'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { DAY_ORDER, toMinutes } from '../../lib/hours'
import { SaveBar, Switch, SwitchRow } from './AdminUi'
import { inputClass, secondaryButtonClass } from './adminStyles'
import { useSaveSetting } from './useSaveSetting'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MAX_SLOTS = 3

// Returns an error message, or null if every open day's time slots make sense.
function validate(days) {
  for (const d of DAY_ORDER) {
    const day = days[d]
    if (day.closed) continue
    if (!day.slots.length) return `${DAY_NAMES[d]}: add a time slot or mark the day as closed.`
    const sorted = [...day.slots].sort((a, b) => toMinutes(a.open) - toMinutes(b.open))
    for (let i = 0; i < sorted.length; i++) {
      const { open, close } = sorted[i]
      if (!open || !close) return `${DAY_NAMES[d]}: fill in both opening and closing times.`
      if (toMinutes(close) <= toMinutes(open)) return `${DAY_NAMES[d]}: closing time must be after opening time.`
      if (i > 0 && toMinutes(open) < toMinutes(sorted[i - 1].close))
        return `${DAY_NAMES[d]}: time slots overlap.`
    }
  }
  return null
}

export default function HoursTab() {
  const { hours } = useSiteSettings().settings
  const [form, setForm] = useState(() => structuredClone(hours))
  const { status, save, fail, reset } = useSaveSetting('hours')

  const setDays = (fn) => {
    const days = structuredClone(form.days)
    fn(days)
    setForm({ ...form, days })
    reset()
  }

  const copyMondayToWeekdays = () =>
    setDays((days) => {
      for (const d of [2, 3, 4, 5, 6]) days[d] = structuredClone(days[1])
    })

  const submit = (e) => {
    e.preventDefault()
    const error = validate(form.days)
    if (error) return fail(error)
    const days = form.days.map((day) => ({
      closed: day.closed,
      slots: [...day.slots].sort((a, b) => toMinutes(a.open) - toMinutes(b.open)),
    }))
    save({ ...form, days })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <SwitchRow
        title="Temporarily closed"
        description={
          form.closedNow
            ? 'On — the website shows “Temporarily closed”, whatever the timings say'
            : 'Use for emergencies; switch off again to go back to the timings below'
        }
        checked={form.closedNow}
        onChange={(closedNow) => {
          setForm({ ...form, closedNow })
          reset()
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Times are in India time (IST).</p>
        <button type="button" onClick={copyMondayToWeekdays} className={secondaryButtonClass}>
          <Copy className="h-4 w-4" /> Copy Monday to Tue–Sat
        </button>
      </div>

      <div className="space-y-3">
        {DAY_ORDER.map((d) => {
          const day = form.days[d]
          return (
            <div key={d} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{DAY_NAMES[d]}</span>
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  {day.closed ? 'Closed' : 'Open'}
                  <Switch
                    checked={!day.closed}
                    label={`${DAY_NAMES[d]} open`}
                    onChange={(open) =>
                      setDays((days) => {
                        days[d].closed = !open
                        if (open && !days[d].slots.length) days[d].slots = [{ open: '09:00', close: '21:00' }]
                      })
                    }
                  />
                </span>
              </div>

              {!day.closed && (
                <div className="mt-3 space-y-2">
                  {day.slots.map((slot, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        aria-label={`${DAY_NAMES[d]} slot ${i + 1} opens`}
                        value={slot.open}
                        onChange={(e) => setDays((days) => (days[d].slots[i].open = e.target.value))}
                        className={`${inputClass} py-2`}
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <input
                        type="time"
                        aria-label={`${DAY_NAMES[d]} slot ${i + 1} closes`}
                        value={slot.close}
                        onChange={(e) => setDays((days) => (days[d].slots[i].close = e.target.value))}
                        className={`${inputClass} py-2`}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${DAY_NAMES[d]} slot ${i + 1}`}
                        disabled={day.slots.length === 1}
                        onClick={() => setDays((days) => days[d].slots.splice(i, 1))}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {day.slots.length < MAX_SLOTS && (
                    <button
                      type="button"
                      onClick={() =>
                        setDays((days) => days[d].slots.push({ open: '17:00', close: '21:00' }))
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add another time slot
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <SaveBar status={status} />
    </form>
  )
}
