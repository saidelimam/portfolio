import { afterEach } from 'vitest';

// Cleanup DOM after each test
// Note: @testing-library/dom cleanup is not needed with jsdom as it resets between tests
afterEach(() => {
  // Clear body HTML after each test
  document.body.innerHTML = '';
});
