import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import pagesPlugin from '../../plugins/vite.pages-plugin.js';

describe('Vite Pages Plugin', () => {
  // Test directories
  const testPagesDir = resolve(process.cwd(), 'tests/mocks/pages');
  const testDistDir = resolve(process.cwd(), 'tests/mocks/dist');

  const mockPageFiles = [
    { filename: 'photography.html', content: '<html><body><h1>Photography</h1></body></html>' },
    { filename: 'videography.html', content: '<html><body><h1>Videography</h1></body></html>' },
    { filename: 'privacy.html', content: '<html><body><h1>Privacy</h1></body></html>' },
  ];

  // Helper to create plugin with test paths
  function createPluginWithTestPaths() {
    return pagesPlugin({
      pagesDir: testPagesDir,
      distDir: testDistDir,
    });
  }

  // Helper to setup test directories and files
  function setupTestFiles() {
    // Create pages directory
    if (!existsSync(testPagesDir)) {
      mkdirSync(testPagesDir, { recursive: true });
    }

    // Create dist directory
    if (!existsSync(testDistDir)) {
      mkdirSync(testDistDir, { recursive: true });
    }

    // Create mock page files
    mockPageFiles.forEach((page) => {
      writeFileSync(resolve(testPagesDir, page.filename), page.content, 'utf-8');
    });
  }

  // Helper to cleanup test directories
  function cleanupTestFiles() {
    try {
      if (existsSync(testPagesDir)) {
        rmSync(testPagesDir, { recursive: true, force: true });
      }
      if (existsSync(testDistDir)) {
        rmSync(testDistDir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  beforeAll(() => {
    cleanupTestFiles();
    setupTestFiles();
  });

  afterEach(() => {
    // Clean dist directory after each test
    if (existsSync(testDistDir)) {
      rmSync(testDistDir, { recursive: true, force: true });
      mkdirSync(testDistDir, { recursive: true });
    }
  });

  afterAll(() => {
    cleanupTestFiles();
  });

  describe('configureServer (dev server URL rewriting)', () => {
    it('should rewrite URL from /photography to /pages/photography.html', () => {
      const plugin = createPluginWithTestPaths();
      const mockServer = {
        middlewares: {
          use: (middleware) => {
            const mockReq = { url: '/photography' };
            const mockRes = {};
            const mockNext = () => {};

            middleware(mockReq, mockRes, mockNext);

            expect(mockReq.url).toBe('/pages/photography.html');
          },
        },
      };

      plugin.configureServer(mockServer);
    });

    it('should rewrite URL from /photography/ to /pages/photography.html', () => {
      const plugin = createPluginWithTestPaths();
      const mockServer = {
        middlewares: {
          use: (middleware) => {
            const mockReq = { url: '/photography/' };
            const mockRes = {};
            const mockNext = () => {};

            middleware(mockReq, mockRes, mockNext);

            expect(mockReq.url).toBe('/pages/photography.html');
          },
        },
      };

      plugin.configureServer(mockServer);
    });

    it('should not rewrite URL that does not match a page', () => {
      const plugin = createPluginWithTestPaths();
      const mockServer = {
        middlewares: {
          use: (middleware) => {
            const mockReq = { url: '/other-page' };
            const mockRes = {};
            const mockNext = () => {};

            middleware(mockReq, mockRes, mockNext);

            expect(mockReq.url).toBe('/other-page');
          },
        },
      };

      plugin.configureServer(mockServer);
    });

    it('should handle all page files from pages directory', () => {
      const plugin = createPluginWithTestPaths();
      const mockServer = {
        middlewares: {
          use: (middleware) => {
            mockPageFiles.forEach((page) => {
              const pageName = page.filename.replace('.html', '');
              const mockReq1 = { url: `/${pageName}` };
              const mockReq2 = { url: `/${pageName}/` };
              const mockRes = {};
              const mockNext = () => {};

              middleware(mockReq1, mockRes, mockNext);
              expect(mockReq1.url).toBe(`/pages/${page.filename}`);

              middleware(mockReq2, mockRes, mockNext);
              expect(mockReq2.url).toBe(`/pages/${page.filename}`);
            });
          },
        },
      };

      plugin.configureServer(mockServer);
    });

    it('should handle missing pages directory gracefully', () => {
      const plugin = pagesPlugin({
        pagesDir: resolve(process.cwd(), 'tests/mocks/nonexistent-pages'),
        distDir: testDistDir,
      });

      const mockServer = {
        middlewares: {
          use: (middleware) => {
            const mockReq = { url: '/photography' };
            const mockRes = {};
            const mockNext = () => {};

            middleware(mockReq, mockRes, mockNext);

            // Should not rewrite URL if pages directory doesn't exist
            expect(mockReq.url).toBe('/photography');
          },
        },
      };

      plugin.configureServer(mockServer);
    });

    it('should filter out non-HTML files from pages directory', () => {
      // Add a non-HTML file to the pages directory
      writeFileSync(resolve(testPagesDir, 'readme.txt'), 'Some text', 'utf-8');

      try {
        const plugin = createPluginWithTestPaths();
        const mockServer = {
          middlewares: {
            use: (middleware) => {
              const mockReq = { url: '/readme' };
              const mockRes = {};
              const mockNext = () => {};

              middleware(mockReq, mockRes, mockNext);

              // Should not rewrite URL for non-HTML files
              expect(mockReq.url).toBe('/readme');
            },
          },
        };

        plugin.configureServer(mockServer);
      } finally {
        // Cleanup the non-HTML file
        try {
          rmSync(resolve(testPagesDir, 'readme.txt'), { force: true });
        } catch (e) {
          // Ignore
        }
      }
    });
  });

  describe('writeBundle (build-time file reorganization)', () => {
    it('should move file from dist/pages/photography.html to dist/photography/index.html', () => {
      // Setup: Create dist/pages/photography.html
      const pagesSubDir = resolve(testDistDir, 'pages');
      if (!existsSync(pagesSubDir)) {
        mkdirSync(pagesSubDir, { recursive: true });
      }
      writeFileSync(resolve(pagesSubDir, 'photography.html'), '<html><body>Photography</body></html>', 'utf-8');

      const plugin = createPluginWithTestPaths();
      plugin.writeBundle();

      // Verify file was moved
      const destFile = resolve(testDistDir, 'photography', 'index.html');
      expect(existsSync(destFile)).toBe(true);
      expect(existsSync(resolve(pagesSubDir, 'photography.html'))).toBe(false);

      const content = readFileSync(destFile, 'utf-8');
      expect(content).toBe('<html><body>Photography</body></html>');
    });

    it('should move file from dist/photography.html to dist/photography/index.html', () => {
      // Setup: Create dist/photography.html (alternative location)
      writeFileSync(resolve(testDistDir, 'photography.html'), '<html><body>Photography</body></html>', 'utf-8');

      const plugin = createPluginWithTestPaths();
      plugin.writeBundle();

      // Verify file was moved
      const destFile = resolve(testDistDir, 'photography', 'index.html');
      expect(existsSync(destFile)).toBe(true);
      expect(existsSync(resolve(testDistDir, 'photography.html'))).toBe(false);

      const content = readFileSync(destFile, 'utf-8');
      expect(content).toBe('<html><body>Photography</body></html>');
    });

    it('should prioritize dist/pages/ over dist/ when both exist', () => {
      // Setup: Create both dist/pages/photography.html and dist/photography.html
      const pagesSubDir = resolve(testDistDir, 'pages');
      if (!existsSync(pagesSubDir)) {
        mkdirSync(pagesSubDir, { recursive: true });
      }
      writeFileSync(resolve(pagesSubDir, 'photography.html'), '<html><body>Photography from pages</body></html>', 'utf-8');
      writeFileSync(resolve(testDistDir, 'photography.html'), '<html><body>Photography from root</body></html>', 'utf-8');

      const plugin = createPluginWithTestPaths();
      plugin.writeBundle();

      // Verify file from dist/pages/ was moved (should take priority)
      const destFile = resolve(testDistDir, 'photography', 'index.html');
      expect(existsSync(destFile)).toBe(true);
      expect(existsSync(resolve(pagesSubDir, 'photography.html'))).toBe(false);
      // dist/photography.html should still exist (not processed if dist/pages/ version exists)
      expect(existsSync(resolve(testDistDir, 'photography.html'))).toBe(true);

      const content = readFileSync(destFile, 'utf-8');
      expect(content).toBe('<html><body>Photography from pages</body></html>');
    });

    it('should process all HTML files from pages directory', () => {
      // Setup: Create dist/pages/ files for all mock pages
      const pagesSubDir = resolve(testDistDir, 'pages');
      if (!existsSync(pagesSubDir)) {
        mkdirSync(pagesSubDir, { recursive: true });
      }

      mockPageFiles.forEach((page) => {
        writeFileSync(resolve(pagesSubDir, page.filename), page.content, 'utf-8');
      });

      const plugin = createPluginWithTestPaths();
      plugin.writeBundle();

      // Verify all files were moved
      mockPageFiles.forEach((page) => {
        const pageName = page.filename.replace('.html', '');
        const destFile = resolve(testDistDir, pageName, 'index.html');
        expect(existsSync(destFile)).toBe(true);
        expect(existsSync(resolve(pagesSubDir, page.filename))).toBe(false);

        const content = readFileSync(destFile, 'utf-8');
        expect(content).toBe(page.content);
      });
    });

    it('should create destination directory if it does not exist', () => {
      // Setup: Create dist/pages/photography.html
      const pagesSubDir = resolve(testDistDir, 'pages');
      if (!existsSync(pagesSubDir)) {
        mkdirSync(pagesSubDir, { recursive: true });
      }
      writeFileSync(resolve(pagesSubDir, 'photography.html'), '<html><body>Photography</body></html>', 'utf-8');

      // Ensure destination directory doesn't exist
      const destDir = resolve(testDistDir, 'photography');
      if (existsSync(destDir)) {
        rmSync(destDir, { recursive: true, force: true });
      }

      const plugin = createPluginWithTestPaths();
      plugin.writeBundle();

      // Verify directory was created
      expect(existsSync(destDir)).toBe(true);
      expect(existsSync(resolve(destDir, 'index.html'))).toBe(true);
    });

    it('should handle missing pages directory gracefully', () => {
      const plugin = pagesPlugin({
        pagesDir: resolve(process.cwd(), 'tests/mocks/nonexistent-pages'),
        distDir: testDistDir,
      });

      // Should not throw
      expect(() => {
        plugin.writeBundle();
      }).not.toThrow();
    });

    it('should skip files that do not exist in dist', () => {
      const plugin = createPluginWithTestPaths();
      plugin.writeBundle();

      // Verify no directories were created for pages that don't exist in dist
      mockPageFiles.forEach((page) => {
        const pageName = page.filename.replace('.html', '');
        const destFile = resolve(testDistDir, pageName, 'index.html');
        expect(existsSync(destFile)).toBe(false);
      });
    });

    it('should filter out non-HTML files from pages directory', () => {
      // Add a non-HTML file to the pages directory
      writeFileSync(resolve(testPagesDir, 'readme.txt'), 'Some text', 'utf-8');

      try {
        // Setup: Create dist/pages/readme.txt (matching the non-HTML file)
        const pagesSubDir = resolve(testDistDir, 'pages');
        if (!existsSync(pagesSubDir)) {
          mkdirSync(pagesSubDir, { recursive: true });
        }
        writeFileSync(resolve(pagesSubDir, 'readme.txt'), 'Some text', 'utf-8');

        const plugin = createPluginWithTestPaths();
        plugin.writeBundle();

        // Verify readme.txt was not moved (not an HTML file)
        expect(existsSync(resolve(testDistDir, 'readme', 'index.html'))).toBe(false);
        expect(existsSync(resolve(pagesSubDir, 'readme.txt'))).toBe(true);
      } finally {
        // Cleanup
        try {
          rmSync(resolve(testPagesDir, 'readme.txt'), { force: true });
          rmSync(resolve(testDistDir, 'pages', 'readme.txt'), { force: true });
        } catch (e) {
          // Ignore
        }
      }
    });

    it('should remove source file after copying to destination', () => {
      // Setup: Create dist/pages/photography.html
      const pagesSubDir = resolve(testDistDir, 'pages');
      if (!existsSync(pagesSubDir)) {
        mkdirSync(pagesSubDir, { recursive: true });
      }
      writeFileSync(resolve(pagesSubDir, 'photography.html'), '<html><body>Photography</body></html>', 'utf-8');

      const plugin = createPluginWithTestPaths();
      plugin.writeBundle();

      // Verify source file was removed
      expect(existsSync(resolve(pagesSubDir, 'photography.html'))).toBe(false);
      // Verify destination file exists
      expect(existsSync(resolve(testDistDir, 'photography', 'index.html'))).toBe(true);
    });
  });
});
