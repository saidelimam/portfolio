import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('Social Links Tooltip Behavior', () => {
  let container;
  let linkElement;
  let tooltipElement;

  beforeEach(() => {
    // Create the DOM structure that matches the links plugin output
    document.body.innerHTML = `
      <div class="hero-social-links" role="list" aria-label="Social media links">
        <div class="tooltip-container" role="listitem">
          <a href="https://www.instagram.com/test" target="_blank" 
             aria-label="Follow me on Instagram" 
             data-tooltip="Follow me on Instagram" 
             rel="noopener noreferrer">
            <i class="fab fa-instagram" aria-hidden="true"></i>
          </a>
          <div class="tooltip" aria-hidden="true">Follow me on Instagram</div>
        </div>
      </div>
    `;

    container = document.querySelector('.tooltip-container');
    linkElement = document.querySelector('a');
    tooltipElement = document.querySelector('.tooltip');
  });

  it('should have correct HTML structure with tooltip-container, link, and tooltip', () => {
    expect(container).toBeTruthy();
    expect(linkElement).toBeTruthy();
    expect(tooltipElement).toBeTruthy();

    // Check container has correct role
    expect(container.getAttribute('role')).toBe('listitem');

    // Check link has correct attributes
    expect(linkElement.getAttribute('href')).toBe('https://www.instagram.com/test');
    expect(linkElement.getAttribute('target')).toBe('_blank');
    expect(linkElement.getAttribute('aria-label')).toBe('Follow me on Instagram');
    expect(linkElement.getAttribute('data-tooltip')).toBe('Follow me on Instagram');
    expect(linkElement.getAttribute('rel')).toBe('noopener noreferrer');

    // Check tooltip has correct attributes
    expect(tooltipElement.getAttribute('aria-hidden')).toBe('true');
    expect(tooltipElement.textContent).toBe('Follow me on Instagram');
  });

  it('should have data-tooltip attribute on link for mobile label display', () => {
    // The data-tooltip attribute is used in CSS to display label in mobile view
    // via content: attr(data-tooltip) in ::after pseudo-element
    expect(linkElement.hasAttribute('data-tooltip')).toBe(true);
    expect(linkElement.getAttribute('data-tooltip')).toBe('Follow me on Instagram');
  });

  it('should have tooltip element present in DOM (for desktop hover)', () => {
    // Tooltip element should exist in DOM for desktop hover behavior
    expect(tooltipElement).toBeTruthy();
    expect(tooltipElement.textContent).toBe('Follow me on Instagram');

    // Tooltip should have aria-hidden="true" by default (for screen readers)
    expect(tooltipElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have aria-label on link for accessibility', () => {
    // aria-label provides accessible name for the link
    expect(linkElement.getAttribute('aria-label')).toBe('Follow me on Instagram');
  });

  it('should have icon element with correct class and aria-hidden', () => {
    const iconElement = linkElement.querySelector('i');

    expect(iconElement).toBeTruthy();
    expect(iconElement.classList.contains('fab')).toBe(true);
    expect(iconElement.classList.contains('fa-instagram')).toBe(true);
    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should handle multiple social links correctly', () => {
    // Add more links to test multiple links
    document.body.innerHTML = `
      <div class="hero-social-links" role="list" aria-label="Social media links">
        <div class="tooltip-container" role="listitem">
          <a href="https://www.instagram.com/test" target="_blank" 
             aria-label="Follow me on Instagram" 
             data-tooltip="Follow me on Instagram" 
             rel="noopener noreferrer">
            <i class="fab fa-instagram" aria-hidden="true"></i>
          </a>
          <div class="tooltip" aria-hidden="true">Follow me on Instagram</div>
        </div>
        <div class="tooltip-container" role="listitem">
          <a href="https://github.com/test" target="_blank" 
             aria-label="Review my code on GitHub" 
             data-tooltip="Review my code on GitHub" 
             rel="noopener noreferrer">
            <i class="fab fa-github" aria-hidden="true"></i>
          </a>
          <div class="tooltip" aria-hidden="true">Review my code on GitHub</div>
        </div>
        <div class="tooltip-container" role="listitem">
          <a href="mailto:test@example.com" target="_blank" 
             aria-label="Send me an email" 
             data-tooltip="Send me an email" 
             rel="noopener noreferrer">
            <i class="fas fa-envelope" aria-hidden="true"></i>
          </a>
          <div class="tooltip" aria-hidden="true">Send me an email</div>
        </div>
      </div>
    `;

    const containers = document.querySelectorAll('.tooltip-container');
    const links = document.querySelectorAll('a');
    const tooltips = document.querySelectorAll('.tooltip');

    expect(containers.length).toBe(3);
    expect(links.length).toBe(3);
    expect(tooltips.length).toBe(3);

    // Verify each link has its own tooltip
    links.forEach((link, index) => {
      const container = link.closest('.tooltip-container');
      const tooltip = container.querySelector('.tooltip');

      expect(container).toBeTruthy();
      expect(tooltip).toBeTruthy();
      expect(link.getAttribute('data-tooltip')).toBe(tooltip.textContent);
    });
  });

  it('should have mailto links handled correctly', () => {
    document.body.innerHTML = `
      <div class="hero-social-links" role="list" aria-label="Social media links">
        <div class="tooltip-container" role="listitem">
          <a href="mailto:test@example.com" target="_blank" 
             aria-label="Send me an email" 
             data-tooltip="Send me an email" 
             rel="noopener noreferrer">
            <i class="fas fa-envelope" aria-hidden="true"></i>
          </a>
          <div class="tooltip" aria-hidden="true">Send me an email</div>
        </div>
      </div>
    `;

    const linkElement = document.querySelector('a');

    expect(linkElement.getAttribute('href')).toBe('mailto:test@example.com');
    expect(linkElement.getAttribute('data-tooltip')).toBe('Send me an email');
  });

  it('should have tooltip element present for desktop hover behavior', () => {
    // On desktop, the tooltip element should exist in the DOM
    // CSS handles showing it on hover via .tooltip-container:hover .tooltip
    expect(tooltipElement).toBeTruthy();
    expect(tooltipElement.classList.contains('tooltip')).toBe(true);
    expect(tooltipElement.textContent).toBe('Follow me on Instagram');

    // Tooltip should be in the DOM (CSS handles visibility via opacity/visibility)
    expect(container.contains(tooltipElement)).toBe(true);
  });

  it('should have data-tooltip attribute on link for mobile label display', () => {
    // On mobile, CSS uses content: attr(data-tooltip) to display the label
    // inside the link button via ::after pseudo-element
    // The tooltip element is hidden via display: none in mobile CSS
    
    expect(linkElement.hasAttribute('data-tooltip')).toBe(true);
    expect(linkElement.getAttribute('data-tooltip')).toBe('Follow me on Instagram');

    // This attribute is used by CSS to display the label in mobile view
    // via .tooltip-container a::after { content: attr(data-tooltip); }
  });

  it('should have all required attributes for both desktop and mobile behavior', () => {
    // Desktop: tooltip element exists, CSS handles hover visibility
    expect(tooltipElement).toBeTruthy();
    expect(tooltipElement.textContent).toBe('Follow me on Instagram');

    // Mobile: data-tooltip attribute exists for label display
    expect(linkElement.getAttribute('data-tooltip')).toBe('Follow me on Instagram');

    // Both desktop tooltip and mobile label should have the same text
    expect(tooltipElement.textContent).toBe(linkElement.getAttribute('data-tooltip'));
  });
});
