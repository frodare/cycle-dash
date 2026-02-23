import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/cycle-dash/',
  server: {
    host: '127.0.0.1',
    port: 5174
  },
  build: {
    target: 'esnext',
  }
})