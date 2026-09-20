// Used only at build time (scripts/prerender.js) to render the page to static HTML.
import { renderToString } from 'react-dom/server'
import Root from './Root.jsx'

// Shared with the pre-render script so it uses exactly the site's own date/offer rules.
export { todayInIndia } from './lib/dates'
export { effectiveDiscount } from './lib/offer'
export { mergeSettings } from './lib/siteDefaults'

export function render(initialSettings, initialDate) {
  return renderToString(<Root initialSettings={initialSettings} initialDate={initialDate} />)
}
