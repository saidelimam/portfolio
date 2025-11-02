import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/dom';
import { initializeAboutReadMore } from '../src/js/home.js';

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

  it('should expand and show full text when "Read more" is clicked', () => {
    fireEvent.click(readMoreLink);

    expect(truncatedText.style.display).toBe('none');
    expect(fullText.style.display).toBe('inline');
    expect(readMoreLink.textContent).toBe('Read less');
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read less about me');
  });

  it('should collapse and show truncated text when "Read less" is clicked', () => {
    // First expand
    fireEvent.click(readMoreLink);
    expect(truncatedText.style.display).toBe('none');
    expect(fullText.style.display).toBe('inline');

    // Then collapse
    fireEvent.click(readMoreLink);

    expect(truncatedText.style.display).toBe('inline');
    expect(fullText.style.display).toBe('none');
    expect(readMoreLink.textContent).toBe('Read more');
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read more about me');
  });

  it('should toggle between expanded and collapsed states multiple times', () => {
    // Initial state: collapsed
    expect(truncatedText.style.display).toBe('');
    expect(fullText.style.display).toBe('none');

    // First click: expand
    fireEvent.click(readMoreLink);
    expect(truncatedText.style.display).toBe('none');
    expect(fullText.style.display).toBe('inline');
    expect(readMoreLink.textContent).toBe('Read less');

    // Second click: collapse
    fireEvent.click(readMoreLink);
    expect(truncatedText.style.display).toBe('inline');
    expect(fullText.style.display).toBe('none');
    expect(readMoreLink.textContent).toBe('Read more');

    // Third click: expand again
    fireEvent.click(readMoreLink);
    expect(truncatedText.style.display).toBe('none');
    expect(fullText.style.display).toBe('inline');
    expect(readMoreLink.textContent).toBe('Read less');
  });

  it('should prevent default link behavior on click', () => {
    // Verify that clicking doesn't cause navigation
    // by checking that href is still '#'
    const originalHref = readMoreLink.href;
    
    fireEvent.click(readMoreLink);
    
    // Verify the click was handled and text changed
    expect(readMoreLink.textContent).toBe('Read less');
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
    // Remove truncated text
    truncatedText.remove();

    // Click should not throw
    expect(() => {
      fireEvent.click(readMoreLink);
    }).not.toThrow();
  });

  it('should find read more link using querySelector', () => {
    const link = screen.queryByRole('link', { name: /read more/i });
    expect(link).toBeTruthy();
    expect(link).toBe(readMoreLink);
  });

  it('should update aria-label correctly when toggling', () => {
    // Initial state
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read more about me');

    // After expanding
    fireEvent.click(readMoreLink);
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read less about me');

    // After collapsing
    fireEvent.click(readMoreLink);
    expect(readMoreLink.getAttribute('aria-label')).toBe('Read more about me');
  });
});
