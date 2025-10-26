import { defineConfig } from 'vite'
import projectsPlugin from './vite.projects-plugin.js'
import linksPlugin from './vite.links-plugin.js'

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
    sourcemap: true,
    rollupOptions: {
      input: {
        index: 'index.html',
        privacy: 'privacy.html'
      }
    }
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
  assetsInclude: ['**/*.webp', '**/*.jpg', '**/*.png', '**/*.svg'],
  
  // Plugins
  plugins: [projectsPlugin(), linksPlugin()]
})
