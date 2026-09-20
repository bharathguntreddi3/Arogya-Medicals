import { useState } from 'react'
import { KeyRound, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { Field, PasswordInput, StatusMessage } from './AdminUi'
import { primaryButtonClass, secondaryButtonClass } from './adminStyles'

export default function AccountTab({ email, onLogout }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState({ type: 'idle', text: '' })

  const changePassword = async (e) => {
    e.preventDefault()
    if (password.length < 8) return setStatus({ type: 'error', text: 'Use at least 8 characters.' })
    if (password !== confirm) return setStatus({ type: 'error', text: 'The two passwords don’t match.' })
    setStatus({ type: 'saving', text: 'Updating…' })
    const { error } = await supabase.auth.updateUser({ password })
    if (error) return setStatus({ type: 'error', text: `Could not change password: ${error.message}` })
    setPassword('')
    setConfirm('')
    setStatus({ type: 'saved', text: 'Password changed. Use the new one next time you sign in.' })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 p-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Signed in as</div>
          <div className="text-sm font-semibold">{email}</div>
        </div>
        <button type="button" onClick={onLogout} className={secondaryButtonClass}>
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <form onSubmit={changePassword} className="space-y-4 rounded-2xl border border-border p-4">
        <div className="text-sm font-semibold">Change password</div>
        <Field label="New password" hint="At least 8 characters.">
          <PasswordInput
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field label="Confirm new password">
          <PasswordInput
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusMessage status={status} />
          <button type="submit" disabled={status.type === 'saving'} className={`${primaryButtonClass} ml-auto`}>
            <KeyRound className="h-4 w-4" /> Change password
          </button>
        </div>
      </form>
    </div>
  )
}
