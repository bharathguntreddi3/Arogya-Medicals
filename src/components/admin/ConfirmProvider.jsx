import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleHelp, TriangleAlert } from 'lucide-react'
import { ConfirmContext } from './ConfirmContext'

// One styled "Are you sure?" dialog for the whole admin area (instead of window.confirm).
export default function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null)
  const confirmButton = useRef(null)

  const confirm = useCallback(
    (options) => new Promise((resolve) => setRequest({ tone: 'primary', confirmText: 'Yes', cancelText: 'Cancel', ...options, resolve })),
    [],
  )

  const answer = useCallback(
    (value) => {
      request?.resolve(value)
      setRequest(null)
    },
    [request],
  )

  useEffect(() => {
    if (!request) return
    confirmButton.current?.focus()
    const onKey = (e) => e.key === 'Escape' && answer(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [request, answer])

  const danger = request?.tone === 'danger'
  const Icon = danger ? TriangleAlert : CircleHelp

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && answer(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            className="animate-pop-in w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-glow)]"
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${
                  danger ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 id="confirm-title" className="text-base font-bold">
                  {request.title}
                </h2>
                {request.message && (
                  <p id="confirm-message" className="mt-1 text-sm text-muted-foreground">
                    {request.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => answer(false)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                {request.cancelText}
              </button>
              <button
                ref={confirmButton}
                type="button"
                onClick={() => answer(true)}
                className={`rounded-full px-5 py-2 text-sm font-semibold shadow-[var(--shadow-soft)] ${
                  danger ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
                }`}
              >
                {request.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
