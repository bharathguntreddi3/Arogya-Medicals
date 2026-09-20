import { useRef } from 'react'
import { useInView } from '../hooks/useReveal'

// A heartbeat (ECG) trace drawn across the top of the footer. Decorative; the drawing
// animation only runs while the footer is on screen (see .ecg-line in index.css).
export default function EcgLine() {
  const ref = useRef(null)
  useInView(ref)

  return (
    <svg
      ref={ref}
      className="ecg-line block h-10 w-full text-primary"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        pathLength="1"
        d="M0 22 H250 l12 -4 l10 4 h18 l8 10 l14 -30 l12 34 l10 -14 h26 l14 -6 l14 6 H640 l12 -4 l10 4 h18 l8 10 l14 -30 l12 34 l10 -14 h26 l14 -6 l14 6 H1200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
