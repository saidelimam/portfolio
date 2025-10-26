import { defineConfig } from 'vite'
import metadataPlugin from './plugins/vite.metadata-plugin.js'
import projectsPlugin from './plugins/vite.projects-plugin.js'
import linksPlugin from './plugins/vite.links-plugin.js'

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
  plugins: [metadataPlugin(), projectsPlugin(), linksPlugin()]
})
