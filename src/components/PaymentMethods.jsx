import { useLanguage } from '../i18n/LanguageContext'
import { useSiteSettings } from '../settings/SiteSettingsContext'
import { enabledPaymentMethods } from '../lib/paymentMethods'

export default function PaymentMethods({ className = '' }) {
  const { lang, t } = useLanguage()
  const methods = enabledPaymentMethods(useSiteSettings().settings.payments.methods)
  if (!methods.length) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground">{t.payments.label}:</span>
      {methods.map(({ id, icon: Icon, [lang]: label }) => (
        <span
          key={id}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground"
        >
          <Icon className="h-3.5 w-3.5 text-primary" />
          {label}
        </span>
      ))}
    </div>
  )
}
