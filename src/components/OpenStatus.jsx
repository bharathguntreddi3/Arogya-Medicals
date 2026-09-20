import { useShopStatus } from '../hooks/useShopStatus'
import { useLanguage } from '../i18n/LanguageContext'

function statusText(status, t) {
  if (status.isOpen) return [t.status.open, t.status.closesAt(status.time)]
  if (status.temporarilyClosed) return [t.status.temporarilyClosed, t.status.temporarilyClosedDetail]
  if (!status.time) return [t.status.closed, null]
  if (status.dayOffset === 0) return [t.status.closed, t.status.opensAt(status.time)]
  if (status.dayOffset === 1) return [t.status.closed, t.status.opensTomorrow(status.time)]
  return [t.status.closed, t.status.opensOn(t.days.long[status.day], status.time)]
}

export default function OpenStatus({ className = '' }) {
  const { t } = useLanguage()
  const status = useShopStatus()
  if (!status) return null

  const [label, detail] = statusText(status, t)

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold sm:text-xs ${
        status.isOpen
          ? 'border-success/30 bg-success/10 text-success'
          : 'border-destructive/30 bg-destructive/10 text-destructive'
      } ${className}`}
      role="status"
    >
      <span className="relative flex h-2 w-2">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            status.isOpen ? 'bg-success' : 'bg-destructive'
          }`}
        />
      </span>
      <span>
        {label}
        {detail && <span className="font-medium"> · {detail}</span>}
      </span>
    </div>
  )
}
