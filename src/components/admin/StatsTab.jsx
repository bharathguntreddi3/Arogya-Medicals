import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { isTrackingOff, setTrackingOff } from '../../lib/track'
import { StatusMessage, SwitchRow } from './AdminUi'
import { secondaryButtonClass } from './adminStyles'

// Headline actions (tiles) and secondary interactions, with how they read in the UI.
const METRICS = [
  { kind: 'visit', label: 'Site visits', unit: 'visits', hint: 'people who opened the website (once per visit)' },
  { kind: 'call', label: 'Calls', unit: 'call taps', hint: 'taps on a Call button' },
  { kind: 'whatsapp', label: 'WhatsApp chats', unit: 'WhatsApp taps', hint: 'taps on a WhatsApp chat button' },
  { kind: 'prescription', label: 'Prescriptions shared', unit: 'prescription taps', hint: 'taps on Send prescription (WhatsApp)' },
  { kind: 'enquiry', label: 'Enquiries', unit: 'messages', hint: 'contact form messages' },
]
const OTHER = [
  { kind: 'directions', label: 'Directions opened', unit: 'direction taps', hint: 'taps on Directions / Google Maps' },
  { kind: 'map', label: 'Map loaded', unit: 'map loads', hint: 'visitors who loaded the map on the page' },
  { kind: 'gallery', label: 'Gallery photos viewed', unit: 'photo views', hint: 'store photos opened full screen' },
  { kind: 'review', label: 'Review taps', unit: 'review taps', hint: 'taps on Rate us on Google' },
  { kind: 'ribbon_close', label: 'Offer strip closed', unit: 'closes', hint: 'visitors who closed the orange scrolling strip' },
]
const ALL_METRICS = [...METRICS, ...OTHER]
// Actions that mean a customer got in touch
const CONTACT_KINDS = ['call', 'whatsapp', 'prescription', 'enquiry']
const RANGES = [7, 30, 90]
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]
const SOURCES = [
  ['direct', 'Direct / typed the address'],
  ['search', 'Google & other search'],
  ['social', 'WhatsApp, Facebook & social'],
  ['other', 'Other websites'],
]

// YYYY-MM-DD ± n days (calendar arithmetic in UTC, so no time-zone drift)
const addDays = (day, n) => {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}
const shortDate = (day) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const hourLabel = (h) => `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`
const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0)

// ---------- small building blocks ----------

function Panel({ title, note, children }) {
  return (
    <section className="rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

// Change vs the previous period: arrow + words, never colour alone.
function Change({ now, before }) {
  if (!before && !now) return <span className="text-xs text-muted-foreground">No activity yet</span>
  if (!before) return <span className="text-xs text-muted-foreground">New this period</span>
  const change = Math.round(((now - before) / before) * 100)
  const Icon = change > 0 ? ArrowUpRight : change < 0 ? ArrowDownRight : Minus
  const tone = change > 0 ? 'text-success' : change < 0 ? 'text-destructive' : 'text-muted-foreground'
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${tone}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {change === 0 ? 'Same' : `${Math.abs(change)}% ${change > 0 ? 'up' : 'down'}`}
      <span className="text-muted-foreground">&nbsp;vs before</span>
    </span>
  )
}

// Horizontal bars for a breakdown: label, bar, value and share. Single hue.
function BarList({ rows, emptyText = 'No data yet' }) {
  const total = rows.reduce((s, r) => s + r.value, 0)
  if (!total) return <p className="text-xs text-muted-foreground">{emptyText}</p>
  const max = Math.max(...rows.map((r) => r.value))
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="text-xs">
          <div className="mb-1 flex justify-between gap-2">
            <span className="text-foreground">{r.label}</span>
            <span className="tabular-nums text-muted-foreground">
              <span className="font-semibold text-foreground">{r.value}</span> · {pct(r.value, total)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

// Vertical bar chart with hover tooltip. `ticks` = [index, text] labels along the bottom.
function ColumnChart({ values, tooltip, ticks, caption, height = 'h-40' }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(1, ...values)
  const n = values.length

  return (
    <figure className="relative">
      <figcaption className="sr-only">{caption}</figcaption>
      <div className="flex gap-2">
        <div className={`flex ${height} flex-col justify-between text-right text-[10px] tabular-nums text-muted-foreground`}>
          <span>{max}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-border" />
          <div className={`flex ${height} items-end gap-[2px] border-b border-border`} onMouseLeave={() => setHover(null)}>
            {values.map((v, i) => (
              // full-height hit target, bigger than the bar itself
              <div key={i} className="flex h-full min-w-0 flex-1 items-end" onMouseEnter={() => setHover(i)}>
                <div
                  className={`w-full rounded-t-[4px] bg-primary transition-opacity ${
                    hover === null || hover === i ? 'opacity-100' : 'opacity-40'
                  }`}
                  style={{ height: `${(v / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
          {hover !== null && (
            <div
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-[var(--shadow-soft)]"
              style={{ left: `${Math.min(88, Math.max(12, ((hover + 0.5) / n) * 100))}%` }}
            >
              {tooltip(hover)}
            </div>
          )}
          <div className="relative mt-1 h-4 whitespace-nowrap text-[10px] text-muted-foreground">
            {ticks.map(([i, text], k) => (
              <span
                key={k}
                className="absolute"
                style={{
                  left: `${((i + 0.5) / n) * 100}%`,
                  transform:
                    k === 0 ? 'translateX(-10%)' : k === ticks.length - 1 ? 'translateX(-90%)' : 'translateX(-50%)',
                }}
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}

function DataTable({ head, rows }) {
  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer text-xs font-semibold text-primary">Show as table</summary>
      <table className="mt-2 w-full text-left text-xs">
        <thead className="text-muted-foreground">
          <tr>
            <th className="py-1 font-medium">{head[0]}</th>
            <th className="py-1 text-right font-medium">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a} className="border-t border-border">
              <td className="py-1">{a}</td>
              <td className="py-1 text-right tabular-nums">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

// ---------- the tab ----------

export default function StatsTab() {
  const { today } = useSiteSettings()
  const [range, setRange] = useState(30)
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState('visit')
  const [status, setStatus] = useState({ type: 'idle', text: '' })
  const [excludeMe, setExcludeMe] = useState(isTrackingOff)

  const load = useCallback(
    () =>
      Promise.all([
        // twice the range, so the previous period can be compared
        supabase.rpc('site_event_counts', { days: range * 2 }),
        supabase.rpc('site_event_breakdown', { days: range }),
        supabase.rpc('site_event_totals'),
      ]).then(([counts, breakdown, totals]) => {
        const error = counts.error || breakdown.error || totals.error
        setData({ counts: counts.data ?? [], breakdown: breakdown.data ?? [], totals: totals.data ?? [] })
        setStatus(
          error ? { type: 'error', text: `Could not load statistics: ${error.message}` } : { type: 'idle', text: '' },
        )
      }),
    [range],
  )

  useEffect(() => {
    load()
  }, [load])

  const days = useMemo(() => Array.from({ length: range }, (_, i) => addDays(today, i - range + 1)), [range, today])
  const firstDay = days[0]

  // counts[kind][day], split into this period and the one before
  const stats = useMemo(() => {
    const byKind = {}
    for (const r of data?.counts ?? []) {
      byKind[r.kind] ??= {}
      byKind[r.kind][r.day] = Number(r.total)
    }
    const sum = (kind, from, to) =>
      Object.entries(byKind[kind] ?? {}).reduce((s, [d, n]) => (d >= from && d <= to ? s + n : s), 0)
    return {
      byKind,
      current: (kind) => sum(kind, firstDay, today),
      previous: (kind) => sum(kind, addDays(firstDay, -range), addDays(firstDay, -1)),
    }
  }, [data, firstDay, today, range])

  // breakdown[dimension][value][kind]
  const breakdown = useMemo(() => {
    const out = {}
    for (const r of data?.breakdown ?? []) {
      out[r.dimension] ??= {}
      out[r.dimension][r.value] ??= {}
      out[r.dimension][r.value][r.kind] = Number(r.total)
    }
    return out
  }, [data])
  const dimCount = (dim, value, kinds) => kinds.reduce((s, k) => s + (breakdown[dim]?.[value]?.[k] ?? 0), 0)

  const allTime = useMemo(() => {
    const totals = Object.fromEntries((data?.totals ?? []).map((t) => [t.kind, Number(t.total)]))
    const first = (data?.totals ?? [])
      .map((t) => t.first_at)
      .filter(Boolean)
      .sort()[0]
    return {
      totals,
      since: first
        ? new Date(first).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : null,
    }
  }, [data])

  if (data === null) return <p className="text-sm text-muted-foreground">Loading statistics…</p>

  const metric = ALL_METRICS.find((m) => m.kind === selected)
  const daily = days.map((d) => stats.byKind[selected]?.[d] ?? 0)
  const visits = stats.current('visit')
  const visitsBefore = stats.previous('visit')
  const contacts = CONTACT_KINDS.reduce((s, k) => s + stats.current(k), 0)
  const contactsBefore = CONTACT_KINDS.reduce((s, k) => s + stats.previous(k), 0)

  const weekdayRows = WEEK_ORDER.map((d) => ({ label: WEEKDAYS[d], value: dimCount('weekday', String(d), CONTACT_KINDS) }))
  const busiestDay = [...weekdayRows].sort((a, b) => b.value - a.value)[0]
  const hourly = Array.from({ length: 24 }, (_, h) => dimCount('hour', String(h), CONTACT_KINDS))
  const busiestHour = hourly.indexOf(Math.max(...hourly))
  const mid = Math.floor((range - 1) / 2)

  return (
    <div className="space-y-5">
      {/* ---- all time ---- */}
      <Panel
        title="All time"
        note={allTime.since ? `Since counting started on ${allTime.since}` : 'Counting starts once the site is live'}
      >
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {METRICS.map((m) => (
            <div key={m.kind}>
              <dt className="text-xs text-muted-foreground">{m.label}</dt>
              <dd className="text-xl font-bold tabular-nums">{(allTime.totals[m.kind] ?? 0).toLocaleString('en-IN')}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      {/* ---- range ---- */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-full border border-border p-0.5" role="group" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => setRange(r)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                range === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Last {r} days
            </button>
          ))}
        </div>
        <button type="button" onClick={load} className={secondaryButtonClass}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <StatusMessage status={status} />

      {/* ---- headline tiles (click one to chart it per day) ---- */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {METRICS.map((m) => (
          <button
            key={m.kind}
            type="button"
            aria-pressed={selected === m.kind}
            onClick={() => setSelected(m.kind)}
            title={m.hint}
            className={`rounded-2xl border p-3 text-left transition-colors ${
              selected === m.kind ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-xs font-medium text-muted-foreground">{m.label}</div>
            <div className="text-2xl font-bold tabular-nums text-foreground">{stats.current(m.kind)}</div>
            <Change now={stats.current(m.kind)} before={stats.previous(m.kind)} />
          </button>
        ))}
        <div
          className="rounded-2xl border border-border p-3"
          title="Calls + WhatsApp chats + prescriptions shared + enquiries, compared with site visits"
        >
          <div className="text-xs font-medium text-muted-foreground">Contact rate</div>
          <div className="text-2xl font-bold tabular-nums text-foreground">{pct(contacts, visits)}%</div>
          <span className="text-xs text-muted-foreground">
            {contacts} contacts from {visits} visits
            {visitsBefore > 0 && ` · was ${pct(contactsBefore, visitsBefore)}%`}
          </span>
        </div>
      </div>

      {/* ---- per day ---- */}
      <Panel title={`${metric.label} per day`} note={metric.hint}>
        <ColumnChart
          values={daily}
          caption={`${metric.label} per day, ${shortDate(days[0])} to ${shortDate(today)}`}
          ticks={[
            [0, shortDate(days[0])],
            [mid, shortDate(days[mid])],
            [range - 1, shortDate(today)],
          ]}
          tooltip={(i) => (
            <>
              <span className="font-semibold text-foreground">{daily[i]}</span>{' '}
              <span className="text-muted-foreground">
                {metric.unit} · {shortDate(days[i])}
              </span>
            </>
          )}
        />
        <DataTable
          head={['Date', metric.label]}
          rows={days
            .map((d, i) => [shortDate(d), daily[i]])
            .filter(([, v]) => v > 0)
            .reverse()}
        />
      </Panel>

      {/* ---- audience ---- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="How visitors found the site" note={`Site visits, last ${range} days`}>
          <BarList rows={SOURCES.map(([key, label]) => ({ label, value: dimCount('source', key, ['visit']) }))} />
        </Panel>
        <Panel title="Phone or computer" note={`Site visits, last ${range} days`}>
          <BarList
            rows={[
              { label: 'Mobile phone', value: dimCount('device', 'mobile', ['visit']) },
              { label: 'Computer / tablet', value: dimCount('device', 'desktop', ['visit']) },
            ]}
          />
        </Panel>
        <Panel title="Language used" note={`Site visits, last ${range} days`}>
          <BarList
            rows={[
              { label: 'English', value: dimCount('lang', 'en', ['visit']) },
              { label: 'Telugu', value: dimCount('lang', 'te', ['visit']) },
            ]}
          />
        </Panel>
        <Panel
          title="Busiest days for customer contact"
          note={
            busiestDay?.value
              ? `Most on ${busiestDay.label} — calls, WhatsApp, prescriptions and enquiries`
              : 'Calls, WhatsApp, prescriptions and enquiries'
          }
        >
          <BarList rows={weekdayRows} emptyText="No customer contact yet in this period" />
        </Panel>
      </div>

      <Panel
        title="Busiest hours for customer contact"
        note={
          Math.max(...hourly) > 0
            ? `Peak around ${hourLabel(busiestHour)} (India time) — useful for planning staff at the counter`
            : 'No customer contact yet in this period'
        }
      >
        <ColumnChart
          values={hourly}
          height="h-28"
          caption="Customer contacts by hour of day"
          ticks={[
            [0, '12 AM'],
            [6, '6 AM'],
            [12, '12 PM'],
            [18, '6 PM'],
            [23, '11 PM'],
          ]}
          tooltip={(h) => (
            <>
              <span className="font-semibold text-foreground">{hourly[h]}</span>{' '}
              <span className="text-muted-foreground">
                contacts · {hourLabel(h)}–{hourLabel((h + 1) % 24)}
              </span>
            </>
          )}
        />
      </Panel>

      {/* ---- other interactions ---- */}
      <Panel title="Other interactions" note={`Last ${range} days — click one to see it per day above`}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {OTHER.map((m) => (
            <button
              key={m.kind}
              type="button"
              aria-pressed={selected === m.kind}
              onClick={() => setSelected(m.kind)}
              title={m.hint}
              className={`rounded-xl border p-2.5 text-left transition-colors ${
                selected === m.kind ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="text-lg font-bold tabular-nums">{stats.current(m.kind)}</div>
            </button>
          ))}
        </div>
      </Panel>

      <SwitchRow
        title="Don't count my own visits on this device"
        description="Turned on automatically when you sign in here, so your own checks don't inflate the numbers."
        checked={excludeMe}
        onChange={(on) => {
          setTrackingOff(on)
          setExcludeMe(on)
        }}
      />
      <p className="text-xs text-muted-foreground">
        Anonymous: only the type of action, the time, phone-or-computer, language and a broad “how they
        arrived” category are recorded — nothing that identifies a visitor.
      </p>
    </div>
  )
}
