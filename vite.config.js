import { defineConfig } from 'vite'

export default defineConfig({
  // Static site configuration
  root: '.',
  publicDir: 'public',
  
  // Development server options
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  
  // CSS preprocessing
  css: {
    preprocessorOptions: {
      less: {
        // LESS options
        javascriptEnabled: true
      }
    }
  },
  
  // Asset handling
  assetsInclude: ['**/*.webp', '**/*.jpg', '**/*.png', '**/*.svg']
})
