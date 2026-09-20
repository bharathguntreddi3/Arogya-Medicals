import { useCallback, useEffect, useState } from 'react'
import { Check, MessageCircle, Phone, RefreshCw, RotateCcw, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { StatusMessage } from './AdminUi'
import { useConfirm } from './ConfirmContext'
import { secondaryButtonClass } from './adminStyles'

const FILTERS = [
  { id: 'open', label: 'To do' },
  { id: 'handled', label: 'Handled' },
  { id: 'all', label: 'All' },
]

const timeFormat = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

// Customer's number as a wa.me link (assumes Indian numbers without a country code).
function replyLink(phone, name) {
  const digits = phone.replace(/\D/g, '').replace(/^0/, '')
  const full = digits.length === 10 ? `91${digits}` : digits
  return `https://wa.me/${full}?text=${encodeURIComponent(`Hi ${name}, this is Arogya Medicals replying to your message.`)}`
}

export default function EnquiriesTab({ onOpenCountChange }) {
  const [filter, setFilter] = useState('open')
  const [rows, setRows] = useState(null)
  const [status, setStatus] = useState({ type: 'idle', text: '' })
  const confirm = useConfirm()

  const load = useCallback(() => {
    let query = supabase.from('enquiries').select('*').order('created_at', { ascending: false }).limit(200)
    if (filter !== 'all') query = query.eq('handled', filter === 'handled')
    return query.then(({ data, error }) => {
      setRows(error ? [] : data)
      setStatus(
        error
          ? { type: 'error', text: `Could not load enquiries: ${error.message}` }
          : { type: 'idle', text: '' },
      )
    })
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const setHandled = async (row, handled) => {
    const { error } = await supabase
      .from('enquiries')
      .update({ handled, handled_at: handled ? new Date().toISOString() : null })
      .eq('id', row.id)
    if (error) return setStatus({ type: 'error', text: `Could not update: ${error.message}` })
    onOpenCountChange?.(handled ? -1 : 1)
    load()
  }

  const remove = async (row) => {
    const ok = await confirm({
      title: `Delete the enquiry from ${row.name}?`,
      message: "This can't be undone.",
      confirmText: 'Delete',
      tone: 'danger',
    })
    if (!ok) return
    const { error } = await supabase.from('enquiries').delete().eq('id', row.id)
    if (error) return setStatus({ type: 'error', text: `Could not delete: ${error.message}` })
    if (!row.handled) onOpenCountChange?.(-1)
    load()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Messages sent from the website's contact form. They also go to WhatsApp — this list makes sure none
        get lost.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-full border border-border p-0.5" role="group" aria-label="Show">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                filter === f.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={load} className={secondaryButtonClass}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <StatusMessage status={status} />

      {rows === null ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {filter === 'open' ? 'All caught up — no enquiries waiting.' : 'No enquiries here yet.'}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className={`rounded-2xl border p-4 ${row.handled ? 'border-border opacity-75' : 'border-primary/40 bg-primary/5'}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-sm font-semibold">
                  {row.name}
                  {row.lang === 'te' && (
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Telugu site
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">{timeFormat.format(new Date(row.created_at))}</span>
              </div>
              <p className="mt-2 whitespace-pre-line break-words text-sm">{row.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a href={`tel:${row.phone.replace(/[^\d+]/g, '')}`} className={`${secondaryButtonClass} py-1.5`}>
                  <Phone className="h-3.5 w-3.5" /> {row.phone}
                </a>
                <a href={replyLink(row.phone, row.name)} target="_blank" rel="noreferrer" className={`${secondaryButtonClass} py-1.5`}>
                  <MessageCircle className="h-3.5 w-3.5" /> Reply on WhatsApp
                </a>
                <span className="ml-auto flex gap-1">
                  {row.handled ? (
                    <button type="button" onClick={() => setHandled(row, false)} className={`${secondaryButtonClass} py-1.5`}>
                      <RotateCcw className="h-3.5 w-3.5" /> Mark as to do
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setHandled(row, true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-success px-4 py-1.5 text-sm font-semibold text-success-foreground"
                    >
                      <Check className="h-3.5 w-3.5" /> Mark handled
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(row)}
                    aria-label={`Delete enquiry from ${row.name}`}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
