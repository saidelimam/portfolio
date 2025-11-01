import { defineConfig } from 'vite';
import layoutPlugin from './plugins/vite.layout-plugin.js';
import metadataPlugin from './plugins/vite.metadata-plugin.js';
import projectsPlugin from './plugins/vite.projects-plugin.js';
import linksPlugin from './plugins/vite.links-plugin.js';
import galleryPlugin from './plugins/vite.gallery-plugin.js';
import pagesPlugin from './plugins/vite.pages-plugin.js';

export default defineConfig({
  // Static site configuration
  root: '.',
  publicDir: 'public',

  // Development server options
  server: {
    port: 3000,
    open: true,
    host: true,
  },

  // Build options
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable in production for smaller bundle
    minify: 'terser', // Use terser for better JS minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.* calls
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific functions
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    cssMinify: true, // Minify CSS
    cssCodeSplit: false, // Generate single CSS file
    reportCompressedSize: true, // Report gzipped sizes
    chunkSizeWarningLimit: 1000, // Warn if chunk exceeds 1KB
    rollupOptions: {
      input: {
        index: 'index.html',
        privacy: 'pages/privacy.html',
        photography: 'pages/photography.html',
        videography: 'pages/videography.html',
        discography: 'pages/discography.html',
      },
      output: {
        manualChunks: undefined, // Single chunk for better caching
        assetFileNames: 'assets/[name]-[hash][extname]', // Asset naming with hash
        chunkFileNames: 'assets/[name]-[hash].js', // JS chunk naming with hash
        entryFileNames: 'assets/[name]-[hash].js', // Entry file naming with hash
      },
    },
  },

  // CSS preprocessing
  css: {
    preprocessorOptions: {
      less: {
        // LESS options
        javascriptEnabled: true,
      },
    },
    devSourcemap: true, // Source maps in dev
    postcss: {
      plugins: [], // Add postcss plugins if needed
    },
  },

  // Asset handling
  assetsInclude: ['**/*.webp', '**/*.jpg', '**/*.png', '**/*.svg'],

  // Plugins
  plugins: [
    layoutPlugin(), // Run first to merge layout.html with all pages
    metadataPlugin(),
    projectsPlugin(),
    linksPlugin(),
    galleryPlugin(), // Generic gallery plugin for photography, videography, and discography
    pagesPlugin(),
  ],

  // Optimize dependencies
  optimizeDeps: {
    include: [], // Pre-bundle dependencies for faster dev
    force: false, // Force re-optimization
  },
});
