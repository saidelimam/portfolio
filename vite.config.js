import { defineConfig } from 'vite';
import { copyFileSync, rmSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import metadataPlugin from './plugins/vite.metadata-plugin.js';
import projectsPlugin from './plugins/vite.projects-plugin.js';
import linksPlugin from './plugins/vite.links-plugin.js';
import demoreelsPlugin from './plugins/vite.demoreels-plugin.js';
import photographyPlugin from './plugins/vite.photography-plugin.js';

// Plugin to reorganize pages from pages/ folder to dist/ folder
// example: pages/privacy.html -> dist/privacy/index.html
function pagesPlugin() {
  return {
    name: 'pages-reorganizer',
    writeBundle() {
      const distDir = resolve(process.cwd(), 'dist');
      const pagesDir = resolve(process.cwd(), 'pages');
      
      // Check if pages directory exists
      if (!existsSync(pagesDir)) {
        return;
      }
      
      // Read all HTML files in pages directory
      const pagesFiles = require('fs').readdirSync(pagesDir).filter(file => file.endsWith('.html'));
      
      // Process each HTML file
      pagesFiles.forEach(filename => {
        const pageName = filename.replace('.html', '');
        // Check both dist/pages/ and dist/ for the built file
        const srcDist = resolve(distDir, 'pages', filename);
        const srcRoot = resolve(distDir, filename);
        
        let srcPath = null;
        if (existsSync(srcDist)) {
          srcPath = srcDist;
        } else if (existsSync(srcRoot)) {
          srcPath = srcRoot;
        }
        
        if (srcPath) {
          const dest = resolve(distDir, pageName, 'index.html');
          const dir = dirname(dest);
          if (!existsSync(dir)) {
            require('fs').mkdirSync(dir, { recursive: true });
          }
          copyFileSync(srcPath, dest);
          rmSync(srcPath);
        }
      });
    },
  };
}

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
  plugins: [metadataPlugin(), projectsPlugin(), linksPlugin(), demoreelsPlugin(), photographyPlugin(), pagesPlugin()],

  // Optimize dependencies
  optimizeDeps: {
    include: [], // Pre-bundle dependencies for faster dev
    force: false, // Force re-optimization
  },
});
