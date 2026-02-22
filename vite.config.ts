import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/cycle-dash/',
  build: {
    target: 'esnext',
  }
})