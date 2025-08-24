import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()], 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://curas.blac.dev', // Your backend server
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
  },
  preview: {
    // allow exactly this host, or use `['.blac.dev']` to whitelist the whole domain
    allowedHosts: ['cura.blac.dev'],

    // if preview needs to bind to 0.0.0.0 as well:
    host: '0.0.0.0',
    // port: 4173,       // match your docker-compose mapping if needed
  }
})