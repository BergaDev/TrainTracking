import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'
config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
