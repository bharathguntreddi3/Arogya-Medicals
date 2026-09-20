// Shop-hours logic. `days` is the admin-editable schedule: index 0 = Sunday … 6 = Saturday,
// each { closed, slots: [{ open: 'HH:MM', close: 'HH:MM' }] } in India time.

// Monday-first order for display
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export const formatSlot = (slot) => `${formatTime(slot.open)} – ${formatTime(slot.close)}`

const istFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Kolkata',
  weekday: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
})

function nowInIndia(date) {
  const parts = Object.fromEntries(istFormatter.formatToParts(date).map((p) => [p.type, p.value]))
  return { day: WEEKDAYS.indexOf(parts.weekday), minutes: Number(parts.hour) * 60 + Number(parts.minute) }
}

const openSlots = (days, d) => (days[d]?.closed ? [] : (days[d]?.slots ?? []))

/**
 * { isOpen: true, time }                      open now, closes at `time`
 * { isOpen: false, time, dayOffset, day }     opens at `time`, `dayOffset` days from today
 * { isOpen: false, temporarilyClosed: true }  admin's emergency switch is on
 * { isOpen: false }                           no opening hours at all
 */
export function getShopStatus({ days, closedNow }, date = new Date()) {
  if (closedNow) return { isOpen: false, temporarilyClosed: true }

  const { day, minutes } = nowInIndia(date)
  const today = openSlots(days, day)

  const current = today.find((s) => minutes >= toMinutes(s.open) && minutes < toMinutes(s.close))
  if (current) return { isOpen: true, time: formatTime(current.close) }

  const later = today.find((s) => minutes < toMinutes(s.open))
  if (later) return { isOpen: false, time: formatTime(later.open), dayOffset: 0, day }

  for (let offset = 1; offset <= 7; offset++) {
    const d = (day + offset) % 7
    const first = openSlots(days, d)[0]
    if (first) return { isOpen: false, time: formatTime(first.open), dayOffset: offset, day: d }
  }
  return { isOpen: false }
}

/**
 * Groups neighbouring days with identical hours, Monday first:
 * [{ days: [1,2,3,4,5,6], closed: false, slots: [...] }, { days: [0], ... }]
 */
export function groupDays(days) {
  const groups = []
  for (const d of DAY_ORDER) {
    const slots = openSlots(days, d)
    const key = JSON.stringify(slots)
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.days.push(d)
    else groups.push({ key, days: [d], closed: slots.length === 0, slots })
  }
  return groups
}

// "Mon – Sat" or "Sunday", using the translated day names
export function dayRangeLabel(group, dayNames) {
  const first = group.days[0]
  const last = group.days[group.days.length - 1]
  return group.days.length === 1
    ? dayNames.long[first]
    : `${dayNames.short[first]} – ${dayNames.short[last]}`
}

// One line per group: "Mon – Sat · 8:00 AM – 1:30 PM & 5:00 PM – 10:00 PM"
export function hoursLines(days, t) {
  return groupDays(days).map(
    (g) =>
      `${dayRangeLabel(g, t.days)} · ${g.closed ? t.days.closed : g.slots.map(formatSlot).join(' & ')}`,
  )
}
