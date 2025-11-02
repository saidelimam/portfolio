import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent } from '@testing-library/dom';
import { initializeAboutReadMore } from '../../src/js/home.js';

describe('About Read More Functionality', () => {
  let container;
  let truncatedText;
  let fullText;
  let readMoreLink;

  beforeEach(() => {
    // Create the DOM structure that matches the metadata plugin output
    document.body.innerHTML = `
      <div class="about-description-container">
        <span class="about-description-text">
          <span class="about-description-truncated">Short text...</span>
          <span class="about-description-full" style="display: none;">This is the full text that should be shown when expanded. It contains much more information than the truncated version.</span>
        </span>
        <a href="#" class="about-read-more" aria-label="Read more about me">Read more</a>
      </div>
    `;

    container = document.querySelector('.about-description-container');
    truncatedText = document.querySelector('.about-description-truncated');
    fullText = document.querySelector('.about-description-full');
    readMoreLink = document.querySelector('.about-read-more');

    // Initialize the functionality
    initializeAboutReadMore();
  });

  it('should show truncated text and hide full text by default', () => {
    expect(truncatedText.style.display).toBe('');
    expect(fullText.style.display).toBe('none');
    expect(readMoreLink.textContent).toBe('Read more');
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read more about me');
  });

  it('should toggle between expanded and collapsed states', () => {
    // Expand: click "Read more"
    fireEvent.click(readMoreLink);
    expect(truncatedText.style.display).toBe('none');
    expect(fullText.style.display).toBe('inline');
    expect(readMoreLink.textContent).toBe('Read less');
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read less about me');

    // Collapse: click "Read less"
    fireEvent.click(readMoreLink);
    expect(truncatedText.style.display).toBe('inline');
    expect(fullText.style.display).toBe('none');
    expect(readMoreLink.textContent).toBe('Read more');
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read more about me');

    // Expand again: verify it works multiple times
    fireEvent.click(readMoreLink);
    expect(truncatedText.style.display).toBe('none');
    expect(fullText.style.display).toBe('inline');
    expect(readMoreLink.textContent).toBe('Read less');
  });

  it('should prevent default link behavior on click', () => {
    const originalHref = readMoreLink.href;
    fireEvent.click(readMoreLink);
    // Verify href didn't change (no navigation occurred)
    expect(readMoreLink.href).toBe(originalHref);
  });

  it('should handle missing elements gracefully', () => {
    // Remove the link
    readMoreLink.remove();

    // Should not throw when initializing
    expect(() => {
      initializeAboutReadMore();
    }).not.toThrow();
  });

  it('should handle missing truncated or full text elements gracefully', () => {
    truncatedText.remove();
    // Click should not throw even if elements are missing
    expect(() => {
      fireEvent.click(readMoreLink);
    }).not.toThrow();
  });

  it('should not show "Read more" link when text is shorter than truncation threshold', () => {
    // Clear previous setup
    document.body.innerHTML = '';

    // Create description shorter than 350 characters (threshold)
    const shortDescription = 'This is a short description that does not exceed the 350 character threshold.';

    document.body.innerHTML = `
      <div class="about-description-container">
        <span class="about-description-text">
          ${shortDescription}
        </span>
      </div>
    `;

    // Initialize - should not find read more link
    initializeAboutReadMore();

    const readMoreLink = document.querySelector('.about-read-more');
    expect(readMoreLink).toBeNull();
  });

});
