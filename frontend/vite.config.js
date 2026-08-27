import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to rewrite MPA routes in dev/preview server
const mpaRewrite = () => ({
  name: 'mpa-rewrite',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url, 'http://localhost')
      const pathname = url.pathname.replace(/\/$/, '')
      const routes = ['/auth', '/dashboard', '/verify', '/tracking']
      if (routes.includes(pathname)) {
        req.url = `${pathname}.html` + url.search
      }
      next()
    })
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = new URL(req.url, 'http://localhost')
      const pathname = url.pathname.replace(/\/$/, '')
      const routes = ['/auth', '/dashboard', '/verify', '/tracking']
      if (routes.includes(pathname)) {
        req.url = `${pathname}.html` + url.search
      }
      next()
    })
  }
})

export default defineConfig({
  plugins: [react(), mpaRewrite()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        verify: 'verify.html',
        dashboard: 'dashboard.html',
        auth: 'auth.html',
        tracking: 'tracking.html',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
