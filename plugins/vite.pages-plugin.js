import { copyFileSync, rmSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';

// Plugin to reorganize pages from pages/ folder to dist/ folder
// example: pages/privacy.html -> dist/privacy/index.html
export default function pagesPlugin() {
  return {
    name: 'pages-reorganizer',
    configureServer(server) {
      // Dev server: Handle /photography, /privacy, etc. routes
      // example: /photography -> /pages/photography.html
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        const pagesDir = resolve(process.cwd(), 'pages');

        if (!existsSync(pagesDir)) {
          return next();
        }

        const pagesFiles = require('fs')
          .readdirSync(pagesDir)
          .filter((file) => file.endsWith('.html'));

        pagesFiles.forEach((filename) => {
          const pageName = filename.replace('.html', '');

          // Check if the request matches a page route (e.g., /photography or /photography/)
          if (url === `/${pageName}` || url === `/${pageName}/`) {
            req.url = `/pages/${filename}`;
          }
        });

        next();
      });
    },
    writeBundle() {
      // Build: Move files from dist/pages/ to dist/[page]/index.html
      const distDir = resolve(process.cwd(), 'dist');
      const pagesDir = resolve(process.cwd(), 'pages');

      // Check if pages directory exists
      if (!existsSync(pagesDir)) {
        return;
      }

      // Read all HTML files in pages directory
      const pagesFiles = require('fs')
        .readdirSync(pagesDir)
        .filter((file) => file.endsWith('.html'));

      // Process each HTML file
      pagesFiles.forEach((filename) => {
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

