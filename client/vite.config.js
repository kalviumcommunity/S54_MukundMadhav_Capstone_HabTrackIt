import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/old/',
  build: {
    outDir: '../new/public/old',
    emptyOutDir: true,
  }
})
