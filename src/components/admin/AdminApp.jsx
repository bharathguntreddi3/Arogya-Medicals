// The admin page (yoursite/admin) — its own page and bundle, English only by design.
import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  Clock,
  ExternalLink,
  GalleryHorizontalEnd,
  Image,
  Inbox,
  Lock,
  LogOut,
  Megaphone,
  Phone,
  Sparkles,
  UserRound,
  Wallet,
} from 'lucide-react'
import logo from '../../assets/logo-mark.png'
import { supabase } from '../../lib/supabaseClient'
import { useSiteSettings } from '../../settings/SiteSettingsContext'
import { setTrackingOff } from '../../lib/track'
import { Field, PasswordInput } from './AdminUi'
import { inputClass, primaryButtonClass, secondaryButtonClass } from './adminStyles'
import { useConfirm } from './ConfirmContext'
import AdminBackdrop from './AdminBackdrop'
import { APP_VERSION_LABEL } from '../../version'
import BannerTab from './BannerTab'
import HoursTab from './HoursTab'
import ContactTab from './ContactTab'
import PaymentsOfferTab from './PaymentsOfferTab'
import ImagesTab from './ImagesTab'
import AccountTab from './AccountTab'
import RibbonTab from './RibbonTab'
import GalleryTab from './GalleryTab'
import EnquiriesTab from './EnquiriesTab'
import StatsTab from './StatsTab'

const TABS = [
  { id: 'enquiries', label: 'Enquiries', icon: Inbox, component: EnquiriesTab, about: 'Messages from the contact form' },
  { id: 'stats', label: 'Statistics', icon: BarChart3, component: StatsTab, about: 'How people use the website' },
  { id: 'banner', label: 'Banner', icon: Megaphone, component: BannerTab, about: 'Holiday / notice strip at the top of the site' },
  { id: 'ribbon', label: 'Ribbon', icon: Sparkles, component: RibbonTab, about: 'The orange scrolling offers strip' },
  { id: 'hours', label: 'Store hours', icon: Clock, component: HoursTab, about: 'Opening times for each day' },
  { id: 'contact', label: 'Contact', icon: Phone, component: ContactTab, about: 'Phone, WhatsApp, address and links' },
  { id: 'payments', label: 'Payments & offer', icon: Wallet, component: PaymentsOfferTab, about: 'Payment methods and discounts' },
  { id: 'images', label: 'Images', icon: Image, component: ImagesTab, about: 'Hero photo and offer poster' },
  { id: 'gallery', label: 'Gallery', icon: GalleryHorizontalEnd, component: GalleryTab, about: 'Store photos section' },
  { id: 'account', label: 'Account', icon: UserRound, component: AccountTab, about: 'Password and sign-out' },
]

function Brand() {
  return (
    <a href="/" className="flex items-center gap-2.5">
      <img src={logo} alt="" width={40} height={40} className="h-10 w-10 animate-heartbeat object-contain" />
      <div className="leading-tight">
        <div className="text-base font-bold text-accent-strong sm:text-lg">Arogya Medicals</div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Admin
          <span className="rounded-full border border-border px-1.5 py-px font-mono text-[9px] normal-case tracking-tight">
            {APP_VERSION_LABEL}
          </span>
        </div>
      </div>
    </a>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (err) setError('Wrong email or password.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="animate-fade-up w-full max-w-sm rounded-3xl border border-border bg-card/90 p-7 shadow-[var(--shadow-glow)] backdrop-blur">
        <Brand />
        <h1 className="mt-6 text-xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the Arogya Medicals website.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email">
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Password">
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className={`${primaryButtonClass} w-full`}>
            <Lock className="h-4 w-4" /> {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <a href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to the website
        </a>
      </div>
    </main>
  )
}

function Dashboard({ email, onLogout }) {
  const { refresh } = useSiteSettings()
  const [tab, setTab] = useState('enquiries')
  const [ready, setReady] = useState(false)
  const [openEnquiries, setOpenEnquiries] = useState(0)

  // Start from the latest saved settings, not whatever was loaded earlier.
  // Also: this is the owner's device, so stop counting its clicks in the statistics.
  useEffect(() => {
    setTrackingOff(true)
    refresh().finally(() => setReady(true))
    supabase
      .from('enquiries')
      .select('id', { count: 'exact', head: true })
      .eq('handled', false)
      .then(({ count }) => setOpenEnquiries(count ?? 0))
  }, [refresh])

  const current = TABS.find((t) => t.id === tab)
  const Current = current.component

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Brand />
          <div className="flex items-center gap-2">
            {/* wrapper does the hiding: the button style's own inline-flex would override "hidden" */}
            <span className="hidden sm:block">
              <a href="/" target="_blank" rel="noreferrer" className={secondaryButtonClass}>
                <ExternalLink className="h-4 w-4" /> View website
              </a>
            </span>
            <span className="hidden max-w-[14rem] truncate text-xs text-muted-foreground md:block" title={email}>
              {email}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex flex-none items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[220px_1fr]">
        <nav aria-label="Admin sections" className="md:sticky md:top-24 md:self-start">
          <ul role="tablist" className="flex flex-wrap gap-1.5 md:flex-col md:gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`flex w-full items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-colors md:rounded-xl ${
                    tab === id
                      ? 'bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                      : 'bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground md:bg-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-none" /> {label}
                  {id === 'enquiries' && openEnquiries > 0 && (
                    <span
                      className={`ml-auto rounded-full px-1.5 text-xs tabular-nums ${
                        tab === id ? 'bg-primary-foreground text-primary' : 'bg-destructive text-destructive-foreground'
                      }`}
                    >
                      {openEnquiries}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Loading current settings…</p>
          ) : (
            // key={tab}: each section fades in when opened
            <section
              key={tab}
              role="tabpanel"
              aria-label={current.label}
              className="animate-fade-up rounded-3xl border border-border bg-card/90 p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-7"
            >
              <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <current.icon className="h-5 w-5" />
                </span>
                <div>
                  <h1 className="text-lg font-bold">{current.label}</h1>
                  <p className="text-xs text-muted-foreground">{current.about}</p>
                </div>
              </div>
              <Current
                email={email}
                onLogout={onLogout}
                onOpenCountChange={(d) => setOpenEnquiries((n) => Math.max(0, n + d))}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined) // undefined = still checking
  const confirm = useConfirm()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const logout = useCallback(async () => {
    const ok = await confirm({
      title: 'Log out of the admin?',
      message: 'You will need your email and password to sign in again.',
      confirmText: 'Logout',
      tone: 'danger',
    })
    if (ok) await supabase.auth.signOut()
  }, [confirm])

  return (
    <>
      <AdminBackdrop />
      {!supabase ? (
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-border bg-card/90 p-7 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            <Brand />
            <p className="mt-5">
              The admin area isn’t connected yet. Follow <strong>SUPABASE-SETUP.md</strong> in the project folder to
              add your Supabase keys, then restart the site.
            </p>
          </div>
        </main>
      ) : session === undefined ? (
        <p className="p-10 text-center text-sm text-muted-foreground">Checking sign-in…</p>
      ) : session ? (
        <Dashboard email={session.user.email} onLogout={logout} />
      ) : (
        <LoginPage />
      )}
    </>
  )
}
