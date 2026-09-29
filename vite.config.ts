import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is deployed to https://obapluto-ob.github.io/portfolio/
// so base must match the repository name.
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
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
