import { HeartPulse, ShieldCheck, Sparkles, Store } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const ICONS = [ShieldCheck, HeartPulse, Store, Sparkles]

export default function TrustBar() {
  const { t } = useLanguage()

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4">
        {ICONS.map((Icon, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">{t.trust[i]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
