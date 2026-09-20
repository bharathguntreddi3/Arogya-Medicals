import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

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
  plugins: [react(), tailwindcss(), adminRoute()],
  build: isSsrBuild
    ? {}
    : {
        // two pages: the public site and the separate admin page
        rollupOptions: { input: { main: 'index.html', admin: 'admin.html' } },
      },
}))
