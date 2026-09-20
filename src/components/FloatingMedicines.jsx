import { useRef } from 'react'
import { Pill, Syringe, Tablets, Thermometer } from 'lucide-react'
import { useInView } from '../hooks/useReveal'

// Syrup bottle drawn in the same line style as the lucide icons (there's no syrup icon).
function SyrupBottle({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="3" rx="1" />
      <path d="M10 5v2.5L7 10v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10l-3-2.5V5" />
      <path d="M7 14h10" />
      <path d="M7 14v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6" fill="currentColor" fillOpacity="0.35" />
      <path d="M10.5 17.5h3" />
    </svg>
  )
}

// Each item: where it floats (% of the area), tile size, tilt, and its own float timing
// so they drift out of step with each other.
const ITEMS = [
  { icon: Tablets, left: '4%', top: '12%', size: 'h-14 w-14', iconSize: 'h-7 w-7', rotate: -10, delay: '0s', duration: '6s' },
  { icon: SyrupBottle, left: '27%', top: '48%', size: 'h-16 w-16', iconSize: 'h-8 w-8', rotate: 6, delay: '-2s', duration: '7s' },
  { icon: Syringe, left: '50%', top: '6%', size: 'h-14 w-14', iconSize: 'h-7 w-7', rotate: -30, delay: '-4s', duration: '6.5s' },
  { icon: Pill, left: '72%', top: '46%', size: 'h-12 w-12', iconSize: 'h-6 w-6', rotate: 18, delay: '-1s', duration: '5.5s' },
  { icon: Thermometer, left: '86%', top: '4%', size: 'h-10 w-10', iconSize: 'h-5 w-5', rotate: 12, delay: '-3s', duration: '6.8s' },
]

// Little plus-shaped sparkles filling the gaps
const SPARKS = [
  { left: '18%', top: '72%', delay: '-1.5s' },
  { left: '42%', top: '20%', delay: '-3.5s' },
  { left: '63%', top: '78%', delay: '-0.5s' },
  { left: '93%', top: '62%', delay: '-2.5s' },
]

/** Decorative medicines drifting gently — fills the lower part of the offer card. */
export default function FloatingMedicines({ className = '' }) {
  const ref = useRef(null)
  useInView(ref) // pause the drifting while the card is off screen

  return (
    <div ref={ref} className={`pause-offscreen pointer-events-none relative select-none ${className}`} aria-hidden="true">
      {ITEMS.map(({ icon: Icon, left, top, size, iconSize, rotate, delay, duration }, i) => (
        <div
          key={i}
          className="absolute animate-float motion-reduce:animate-none"
          style={{ left, top, animationDelay: delay, animationDuration: duration }}
        >
          <div
            className={`flex ${size} items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)]`}
            style={{ transform: `rotate(${rotate}deg)` }}
          >
            <Icon className={iconSize} />
          </div>
        </div>
      ))}
      {SPARKS.map(({ left, top, delay }, i) => (
        <span
          key={i}
          className="absolute animate-float text-lg font-bold leading-none text-white/40 motion-reduce:animate-none"
          style={{ left, top, animationDelay: delay, animationDuration: '5s' }}
        >
          +
        </span>
      ))}
    </div>
  )
}
