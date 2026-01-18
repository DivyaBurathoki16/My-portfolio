import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // makes the dev server accessible on your LAN
    port: 5173,
  },
})

