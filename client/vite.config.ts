import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: 'client', // ✅ client 폴더를 루트로 설정
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@components': path.resolve(__dirname, 'client/src/components'),
      '@constant': path.resolve(__dirname, 'client/src/constant'),
      '@mocks': path.resolve(__dirname, 'client/src/mocks'),
      '@provider': path.resolve(__dirname, 'client/src/provider'),
      '@pages': path.resolve(__dirname, 'client/src/pages'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
