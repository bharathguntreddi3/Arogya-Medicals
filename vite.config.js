import { createRequire } from 'node:module'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// package.json is the one place the version lives; src/version.js reads it from here.
const { version } = createRequire(import.meta.url)('./package.json')

// Where the site actually lives. Search engines need absolute URLs for the canonical
// tag, link previews and the sitemap, and a wrong host here de-indexes the site — so
// prefer what the host tells us: VITE_SITE_URL, else Vercel's own production URL,
// else the known deployment. Set VITE_SITE_URL when moving to a custom domain.
const SITE_URL = (
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  'https://arogya-medicals.vercel.app'
).replace(/\/+$/, '')

// Absolute canonical + link-preview URLs in the <head>, and a sitemap for fast indexing.
// The admin page carries its own noindex, so it is left alone.
function seo() {
  return {
    name: 'seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (ctx.path.includes('admin')) return html
        return html
          // relative paths are fine in the browser but WhatsApp/Facebook/Google need full URLs
          .replaceAll('content="/og-image.jpg"', `content="${SITE_URL}/og-image.jpg"`)
          .replace(
            '</head>',
            `  <link rel="canonical" href="${SITE_URL}/" />
` +
              `    <meta property="og:url" content="${SITE_URL}/" />
  </head>`,
          )
      },
    },
    generateBundle() {
      // one public page, so one entry; lastmod refreshes on every deploy
      const lastmod = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>
` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` +
          `  <url>
` +
          `    <loc>${SITE_URL}/</loc>
` +
          `    <lastmod>${lastmod}</lastmod>
` +
          `    <changefreq>weekly</changefreq>
` +
          `    <priority>1.0</priority>
` +
          `  </url>
` +
          `</urlset>
`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source:
          `User-agent: *
` +
          `Allow: /
` +
          `Disallow: /admin

` +
          `Sitemap: ${SITE_URL}/sitemap.xml
`,
      })
    },
  }
}

// yoursite/admin → admin.html, for the local dev and preview servers
// (on Vercel, "cleanUrls" in vercel.json does the same).
function adminRoute() {
  const rewrite = (req, _res, next) => {
    if (/^\/admin\/?(\?.*)?$/.test(req.url)) req.url = req.url.replace(/^\/admin\/?/, '/admin.html')
    next()
  }
  return {
    name: 'admin-route',
    // (block bodies on purpose: a function returned from these hooks would run *after* Vite's own middleware)
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), adminRoute(), ...(isSsrBuild ? [] : [seo()])],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __SITE_URL__: JSON.stringify(SITE_URL),
  },
  build: isSsrBuild
    ? {}
    : {
        // two pages: the public site and the separate admin page
        rollupOptions: { input: { main: 'index.html', admin: 'admin.html' } },
      },
}))
