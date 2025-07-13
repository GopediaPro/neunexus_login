import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@constant': path.resolve(__dirname, 'src/constant'),
      '@mocks': path.resolve(__dirname, 'src/mocks'),
      '@provider': path.resolve(__dirname, 'src/provider'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    rollupOptions: {
      treeshake: false,
      output: {
        manualChunks: undefined,
      }
    },
    minify: false,
  },
})
