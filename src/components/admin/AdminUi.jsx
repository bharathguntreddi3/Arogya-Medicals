import { useState } from 'react'
import { CheckCircle2, Eye, EyeOff, TriangleAlert } from 'lucide-react'
import { inputClass, labelClass, primaryButtonClass } from './adminStyles'

// Password box with an eye button to show / hide what's typed.
export function PasswordInput({ value, onChange, autoComplete = 'current-password', required = false }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        className={`${inputClass} pr-11`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        title={visible ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
      </button>
    </div>
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 flex-none rounded-full transition-colors ${
        checked ? 'bg-success' : 'bg-border'
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}

export function SwitchRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-4">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  )
}

export function StatusMessage({ status }) {
  if (!status.text) return null
  const tone =
    status.type === 'error'
      ? 'text-destructive'
      : status.type === 'saved'
        ? 'text-success'
        : 'text-muted-foreground'
  return (
    <p role="status" className={`flex items-center gap-2 text-sm font-medium ${tone}`}>
      {status.type === 'saved' && <CheckCircle2 className="h-4 w-4 flex-none" />}
      {status.type === 'error' && <TriangleAlert className="h-4 w-4 flex-none" />}
      {status.text}
    </p>
  )
}

// Status + Save button, pinned at the bottom of each tab's form.
export function SaveBar({ status, label = 'Save changes' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
      <div className="min-w-0 flex-1">
        <StatusMessage status={status} />
      </div>
      <button type="submit" disabled={status.type === 'saving'} className={primaryButtonClass}>
        {status.type === 'saving' ? 'Saving…' : label}
      </button>
    </div>
  )
}
