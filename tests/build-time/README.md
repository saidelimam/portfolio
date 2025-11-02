# Build-Time Tests

Tests for build-time code like Vite plugins and build scripts.

## Structure

Tests for code that runs during the build process (not in the browser).

## What to test here

- Vite plugin transformations
- HTML generation logic
- Data processing
- Build script functionality
- File system operations (mocked)

## Examples

- `vite.metadata-plugin.js` - Testing metadata injection
- `vite.projects-plugin.js` - Testing project card generation
- `vite.gallery-plugin.js` - Testing gallery item generation
- `vite.layout-plugin.js` - Testing layout merging
