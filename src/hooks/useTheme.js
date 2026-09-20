import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'arogya-theme'

// The source of truth is the `dark` class on <html>, which index.html sets from the
// saved preference before first paint. This hook just reads and flips that class.
function subscribe(onChange) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const getSnapshot = () =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'

// The build-time pre-render has no <html> to read; it renders the light-mode toggle.
const getServerSnapshot = () => 'light'

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable (private mode) — theme just won't persist
    }
  }

  return { theme, toggleTheme }
}
