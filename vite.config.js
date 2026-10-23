import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Listens on all addresses so both http://localhost:5173 and http://127.0.0.1:5173 work
    port: 5173,
    open: true, // Automatically opens your browser tab when you run npm run dev
    cors: true,
  },
  preview: {
    host: true,
    port: 5173,
    open: true,
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
})
