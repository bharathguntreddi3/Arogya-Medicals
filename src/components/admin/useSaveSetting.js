import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { useConfirm } from './ConfirmContext'

const NOT_ADMIN =
  'This account is not allowed to change settings. Add it as an admin (see SUPABASE-SETUP.md).'

// JSON with sorted keys, so two settings objects compare equal regardless of key order.
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable(value[k])}`)
      .join(',')}}`
  }
  return JSON.stringify(value ?? null)
}

const DEFAULT_CONFIRM = {
  title: 'Save these changes?',
  message: 'They will be live on the website straight away.',
  confirmText: 'Save',
}

// Saves one settings section to Supabase and shows it on the live page straight away.
// Asks for confirmation first; if nothing actually changed, says so instead of saving.
export function useSaveSetting(id) {
  const { settings, setSetting } = useSiteSettings()
  const confirm = useConfirm()
  const [status, setStatus] = useState({ type: 'idle', text: '' })

  const save = async (value, savedText = 'Saved — live on the website.', confirmOptions) => {
    if (stable(value) === stable(settings[id])) {
      setStatus({ type: 'idle', text: 'No changes to save.' })
      return false
    }
    if (!(await confirm({ ...DEFAULT_CONFIRM, ...confirmOptions }))) {
      setStatus({ type: 'idle', text: 'Not saved.' })
      return false
    }

    setStatus({ type: 'saving', text: 'Saving…' })
    const { error } = await supabase.from('site_settings').upsert({ id, value })
    if (error) {
      setStatus({
        type: 'error',
        text: error.code === '42501' ? NOT_ADMIN : `Could not save: ${error.message}`,
      })
      return false
    }
    setSetting(id, value)
    setStatus({ type: 'saved', text: savedText })
    return true
  }

  const fail = (text) => setStatus({ type: 'error', text })
  const reset = () => setStatus({ type: 'idle', text: '' })

  return { status, save, fail, reset }
}
