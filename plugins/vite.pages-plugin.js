import { copyFileSync, rmSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

/**
 * Vite plugin to reorganize pages from pages/ folder to dist/ folder
 * In dev: Rewrites URLs like /photography -> /pages/photography.html
 * In build: Moves dist/pages/photography.html -> dist/photography/index.html
 * @param {Object} options - Plugin options
 * @param {string} [options.pagesDir] - Override the default pages directory path (useful for testing)
 * @param {string} [options.distDir] - Override the default dist directory path (useful for testing)
 * @returns {Object} Vite plugin object
 */
export default function pagesPlugin(options = {}) {
  // Allow overriding paths for testing
  const defaultPagesDir = resolve(process.cwd(), 'pages');
  const defaultDistDir = resolve(process.cwd(), 'dist');
  const getPagesDir = () => options.pagesDir || defaultPagesDir;
  const getDistDir = () => options.distDir || defaultDistDir;

  return {
    name: 'pages-reorganizer',
    configureServer(server) {
      // Dev server: Handle /photography, /privacy, etc. routes
      // example: /photography -> /pages/photography.html
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        const pagesDir = getPagesDir();

        if (!existsSync(pagesDir)) {
          return next();
        }

        // Parse URL to get pathname (without query parameters)
        // Split URL to separate pathname from query parameters
        const [pathname, search = ''] = url.split('?');
        const queryString = search ? `?${search}` : ''; // Preserve query parameters

        const pagesFiles = readdirSync(pagesDir)
          .filter((file) => file.endsWith('.html'));

        pagesFiles.forEach((filename) => {
          const pageName = filename.replace('.html', '');

          // Check if the request matches a page route (e.g., /photography or /photography/)
          // Match pathname only, preserving query parameters
          if (pathname === `/${pageName}` || pathname === `/${pageName}/`) {
            // Preserve query parameters when rewriting URL
            req.url = `/pages/${filename}${queryString}`;
          }
        });

        next();
      });
    },
    writeBundle() {
      // Build: Move files from dist/pages/ to dist/[page]/index.html
      const distDir = getDistDir();
      const pagesDir = getPagesDir();

      // Check if pages directory exists
      if (!existsSync(pagesDir)) {
        return;
      }

      // Read all HTML files in pages directory
      const pagesFiles = readdirSync(pagesDir)
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
            mkdirSync(dir, { recursive: true });
          }
          copyFileSync(srcPath, dest);
          rmSync(srcPath);
        }
      });
    },
  };
}
