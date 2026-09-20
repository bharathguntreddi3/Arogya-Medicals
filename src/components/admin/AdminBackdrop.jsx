import { HeartPulse, Pill, Stethoscope, Syringe, Tablets, Thermometer } from 'lucide-react'

// Animated page background for the admin area, in the site's style: soft drifting colour
// glows and faint floating medicine icons. Purely decorative, fixed behind the content,
// CSS-only, and still for "reduce motion" users.
const ICONS = [
  { icon: Pill, left: '6%', top: '18%', size: 'h-10 w-10', rotate: -15, delay: '0s', duration: '9s' },
  { icon: Syringe, left: '88%', top: '14%', size: 'h-12 w-12', rotate: 25, delay: '-3s', duration: '11s' },
  { icon: Tablets, left: '80%', top: '62%', size: 'h-11 w-11', rotate: -8, delay: '-5s', duration: '10s' },
  { icon: Thermometer, left: '10%', top: '70%', size: 'h-9 w-9', rotate: 12, delay: '-2s', duration: '8.5s' },
  { icon: Stethoscope, left: '46%', top: '88%', size: 'h-10 w-10', rotate: -6, delay: '-6s', duration: '12s' },
  { icon: HeartPulse, left: '52%', top: '6%', size: 'h-9 w-9', rotate: 8, delay: '-4s', duration: '9.5s' },
]

export default function AdminBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-soft)' }} />
      <div
        className="absolute -top-40 -right-40 h-[520px] w-[520px] animate-float rounded-full opacity-25 blur-3xl motion-reduce:animate-none"
        style={{ background: 'var(--gradient-hero)', animationDuration: '14s' }}
      />
      <div
        className="absolute -bottom-40 -left-40 h-[440px] w-[440px] animate-float rounded-full bg-accent opacity-20 blur-3xl motion-reduce:animate-none"
        style={{ animationDuration: '16s', animationDelay: '-6s' }}
      />
      {ICONS.map(({ icon: Icon, left, top, size, rotate, delay, duration }, i) => (
        <div
          key={i}
          className="absolute animate-float text-primary/15 motion-reduce:animate-none"
          style={{ left, top, animationDelay: delay, animationDuration: duration }}
        >
          <Icon className={size} style={{ transform: `rotate(${rotate}deg)` }} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  )
}
