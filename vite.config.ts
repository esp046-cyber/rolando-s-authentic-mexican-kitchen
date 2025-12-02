import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load correctly on GitHub Pages or relative paths
  define: {
    // Safely provide the API key if it exists in the build environment
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})