import node from '@astrojs/node'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.INTERNAL_BACKEND_URL,
          changeOrigin: true,
          ws: true
        },
        '/_/': {
          target: process.env.INTERNAL_BACKEND_URL,
          changeOrigin: true,
          ws: true
        }
      }
    }
  },
  site: process.env.SITE_URL,
  server: {
    port: parseInt(process.env.FRONTEND_PORT) | 4321
  }
})
