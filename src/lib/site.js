// The deployed origin, stamped in at build time (see `SITE_URL` in vite.config.js).
/* global __SITE_URL__ */
export const SITE_URL = __SITE_URL__

// "/og-image.jpg" -> "https://arogya-medicals.vercel.app/og-image.jpg".
// Google and the link-preview crawlers ignore relative paths, so anything that ends up
// in a meta tag or in the JSON-LD has to go through here.
export const absoluteUrl = (path) => new URL(path, SITE_URL).href
