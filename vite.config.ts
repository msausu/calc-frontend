/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    cors: true,
    strictPort: true,
    port: 5173,
  },  
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ["node_modules"],
    setupFiles: ['./setupTests.ts'],
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
})

