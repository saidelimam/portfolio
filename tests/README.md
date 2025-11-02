# Testing

This project uses [Vitest](https://vitest.dev/) for testing.

## Requirements

- **Node.js**: Version 20.0.0 or higher (or 22.0.0+ / 24.0.0+)
- **npm**: Version 8.0.0 or higher

## Running Tests

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run tests once and exit
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

- `tests/` - All test files
- `tests/setup.js` - Test setup and global configuration
- `tests/runtime/` - Tests for runtime JavaScript (client-side code that runs in the browser)
- `tests/build-time/` - Tests for build-time code (Vite plugins, build scripts, etc.)

## Writing Tests

Tests use:
- **Vitest** - Test framework
- **@testing-library/dom** - DOM testing utilities
- **jsdom** - DOM environment for tests

Example:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import { initializeAboutReadMore } from '../src/js/home.js';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `<div>...</div>`;
    
    // Initialize functionality
    initializeAboutReadMore();
  });

  it('should do something', () => {
    // Test implementation
    expect(something).toBe(expected);
  });
});
```
