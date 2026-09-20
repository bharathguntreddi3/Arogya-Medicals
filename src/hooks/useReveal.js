import { useEffect } from 'react'

// Scroll-reveal for elements marked `data-reveal` (optionally with a `--reveal-delay`
// style for staggering). One shared IntersectionObserver, no animation library.
//
// Safe by default: the pre-rendered page shows everything, elements already on screen are
// left alone, and only elements registered here (below the screen) are hidden until they
// scroll into view. Anything added later or missed simply stays visible.
export function useReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.remove('reveal-pending')
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    for (const el of document.querySelectorAll('[data-reveal]')) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue // already visible: leave it
      el.classList.add('reveal-pending')
      observer.observe(el)
    }

    return () => {
      observer.disconnect()
      document.querySelectorAll('.reveal-pending').forEach((el) => el.classList.remove('reveal-pending'))
    }
  }, [])
}

// Toggles `in-view` on and off with visibility — for looping decorations (the ECG line)
// so they only animate while someone can actually see them.
export function useInView(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle('in-view', entry.isIntersecting)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}
