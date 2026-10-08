import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/EduPath',
  server: {
    host: '127.0.0.1', // Forces IPv4 loopback (bypasses VPN routing adapter)
    port: 5173,
    strictPort: true,
  },
})
