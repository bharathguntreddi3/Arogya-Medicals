import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import Root from './Root.jsx'

// Old "#admin" links now go to the separate admin page.
if (window.location.hash === '#admin') window.location.replace('/admin')

const container = document.getElementById('root')

// The production build ships the page pre-rendered in English. English visitors get
// that HTML brought to life in place (hydrated); Telugu visitors, and the dev server
// (which has no pre-rendered HTML), get a fresh render.
if (container.hasChildNodes() && document.documentElement.lang !== 'te') {
  hydrateRoot(container, <Root />)
} else {
  createRoot(container).render(<Root />)
}
