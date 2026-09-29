import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base is '/' for Netlify. For GitHub Pages use '/portfolio/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore']
        }
      }
    }
  }
})
