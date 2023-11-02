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
          target: 'http://127.0.0.1:8090',
          changeOrigin: true,
          ws: true
        },
        '/_/': {
          target: 'http://127.0.0.1:8090',
          changeOrigin: true,
          ws: true
        }
      }
    }
  },
  site: process.env.SITE_URL
})
