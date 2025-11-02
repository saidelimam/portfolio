import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import linksPlugin from '../../plugins/vite.links-plugin.js';

describe('Vite Links Plugin', () => {
  // Persistent test files paths
  const testLinksPath = resolve(process.cwd(), 'tests/mocks/test-links.json');
  const testTemplatePath = resolve(process.cwd(), 'tests/mocks/social-link-item.html');

  const mockLinks = [
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/test',
      icon: 'fab fa-instagram',
      label: 'Follow me on Instagram',
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/test',
      icon: 'fab fa-github',
      label: 'Review my code on GitHub',
    },
    {
      platform: 'Email',
      url: 'mailto:test@example.com',
      icon: 'fas fa-envelope',
      label: 'Send me an email',
    },
  ];

  const mockTemplate = `<div class="tooltip-container" role="listitem">
    <a href="{{URL}}" target="_blank" aria-label="{{LABEL}}" data-tooltip="{{LABEL}}" rel="noopener noreferrer"><i class="{{ICON}}" aria-hidden="true"></i></a>
    <div class="tooltip" aria-hidden="true">{{LABEL}}</div>
</div>`;

  // Helper to create plugin with test paths
  function createPluginWithTestPaths() {
    return linksPlugin({
      linksPath: testLinksPath,
      templatePath: testTemplatePath,
    });
  }

  // Helper to restore default test files after tests that modify them
  function restoreDefaultTestFiles() {
    writeFileSync(testLinksPath, JSON.stringify(mockLinks, null, 2), 'utf-8');
    writeFileSync(testTemplatePath, mockTemplate, 'utf-8');
  }

  // Ensure test files have correct content before all tests
  beforeAll(() => {
    restoreDefaultTestFiles();
  });

  afterEach(() => {
    // Restore default test files after each test that might modify them
    restoreDefaultTestFiles();
  });

  it('should correctly replace SOCIAL_LINKS placeholder with all links from JSON', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Should contain all links from mockLinks
    mockLinks.forEach((link) => {
      expect(result).toContain(link.url);
      expect(result).toContain(link.label);
      expect(result).toContain(link.icon);
    });

    // Should not contain placeholder
    expect(result).not.toContain('{{SOCIAL_LINKS}}');
  });

  it('should generate correct HTML structure for each link', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Each link should have:
    // - tooltip-container div with role="listitem"
    // - anchor tag with target="_blank", aria-label, data-tooltip, rel="noopener noreferrer"
    // - icon with aria-hidden="true"
    // - tooltip div with aria-hidden="true"

    const linkCount = (result.match(/tooltip-container/g) || []).length;
    expect(linkCount).toBe(mockLinks.length);

    // Check structure for each link
    mockLinks.forEach((link) => {
      // Should have tooltip-container
      expect(result).toContain('<div class="tooltip-container" role="listitem">');

      // Should have anchor with correct attributes
      expect(result).toContain(`href="${link.url}"`);
      expect(result).toContain('target="_blank"');
      expect(result).toContain(`aria-label="${link.label}"`);
      expect(result).toContain(`data-tooltip="${link.label}"`);
      expect(result).toContain('rel="noopener noreferrer"');

      // Should have icon with correct class and aria-hidden
      expect(result).toContain(`<i class="${link.icon}" aria-hidden="true"></i>`);

      // Should have tooltip div with label and aria-hidden
      expect(result).toContain(`<div class="tooltip" aria-hidden="true">${link.label}</div>`);
    });
  });

  it('should sanitize URLs and labels correctly', () => {
    const dangerousLinks = [
      {
        platform: 'Test',
        url: 'javascript:alert("xss")',
        icon: 'fas fa-test',
        label: '<script>alert("xss")</script>',
      },
      {
        platform: 'Test2',
        url: 'http://example.com',
        icon: 'fas fa-test2',
        label: 'Test & Label',
      },
    ];

    writeFileSync(testLinksPath, JSON.stringify(dangerousLinks), 'utf-8');
    try {
      const html = '<div>{{SOCIAL_LINKS}}</div>';
      const plugin = createPluginWithTestPaths();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      // javascript: URLs should be sanitized (likely removed or made safe)
      // The sanitizeURL function should handle this
      expect(result).not.toContain('javascript:alert');

      // Script tags in labels should be escaped/sanitized
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');

      // HTML entities should be escaped
      expect(result).toContain('&amp;'); // & should be escaped to &amp;
    } finally {
      restoreDefaultTestFiles();
    }
  });

  it('should handle empty links array gracefully', () => {
    writeFileSync(testLinksPath, JSON.stringify([]), 'utf-8');
    try {
      const html = '<div>{{SOCIAL_LINKS}}</div>';
      const plugin = createPluginWithTestPaths();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      // Should return HTML unchanged when links array is empty
      expect(result).toBe(html);
      expect(result).toContain('{{SOCIAL_LINKS}}');
    } finally {
      restoreDefaultTestFiles();
    }
  });

  it('should handle missing links file gracefully', () => {
    // Temporarily remove the test links file
    try {
      if (existsSync(testLinksPath)) {
        unlinkSync(testLinksPath);
      }
    } catch (e) {
      // Ignore
    }

    try {
      const html = '<div>{{SOCIAL_LINKS}}</div>';
      const plugin = createPluginWithTestPaths();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      // Should return HTML unchanged when links file is missing
      expect(result).toBe(html);
      expect(result).toContain('{{SOCIAL_LINKS}}');
    } finally {
      restoreDefaultTestFiles();
    }
  });

  it('should handle missing template file gracefully', () => {
    // Temporarily remove the test template file
    try {
      if (existsSync(testTemplatePath)) {
        unlinkSync(testTemplatePath);
      }
    } catch (e) {
      // Ignore
    }

    try {
      const html = '<div>{{SOCIAL_LINKS}}</div>';
      const plugin = createPluginWithTestPaths();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      // Should return HTML unchanged when template file is missing
      expect(result).toBe(html);
      expect(result).toContain('{{SOCIAL_LINKS}}');
    } finally {
      restoreDefaultTestFiles();
    }
  });

  it('should replace all placeholders in template correctly', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Should not contain any template placeholders
    expect(result).not.toContain('{{URL}}');
    expect(result).not.toContain('{{LABEL}}');
    expect(result).not.toContain('{{ICON}}');

    // Should contain actual values
    mockLinks.forEach((link) => {
      expect(result).toContain(link.url);
      expect(result).toContain(link.label);
      expect(result).toContain(link.icon);
    });
  });

  it('should handle mailto links correctly', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Should contain mailto link
    expect(result).toContain('mailto:test@example.com');
  });

  it('should preserve placeholder when no SOCIAL_LINKS placeholder exists', () => {
    const html = '<div>No links here</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Should return HTML unchanged
    expect(result).toBe(html);
  });

  it('should handle multiple SOCIAL_LINKS placeholders', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div><div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Should replace only the first occurrence (standard replace behavior)
    expect(result).toContain('{{SOCIAL_LINKS}}'); // Second one should remain
    expect(result).toContain('tooltip-container'); // First one should be replaced
  });

  it('should include all links from JSON data', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Count the number of tooltip-container divs (one per link)
    const tooltipContainerCount = (result.match(/tooltip-container/g) || []).length;
    expect(tooltipContainerCount).toBe(mockLinks.length);

    // Verify each link from mockLinks is present
    mockLinks.forEach((link) => {
      // Each link should have its URL
      expect(result).toContain(link.url);
      
      // Each link should have its label (appears in aria-label, data-tooltip, and tooltip element)
      const labelOccurrences = (result.match(new RegExp(link.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      // Label should appear at least 3 times: aria-label, data-tooltip, and tooltip text
      expect(labelOccurrences).toBeGreaterThanOrEqual(3);
      
      // Each link should have its icon class
      expect(result).toContain(link.icon);
    });
  });

  it('should generate correct HTML structure for desktop tooltip hover', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // For desktop: tooltip element should exist for CSS hover behavior
    // CSS rule: .tooltip-container:hover .tooltip { opacity: 1; visibility: visible; }
    const tooltipCount = (result.match(/<div class="tooltip" aria-hidden="true">/g) || []).length;
    expect(tooltipCount).toBe(mockLinks.length);

    // Each tooltip should be inside a tooltip-container
    mockLinks.forEach((link) => {
      // Tooltip element should exist with the label text
      expect(result).toContain(`<div class="tooltip" aria-hidden="true">${link.label}</div>`);
    });
  });

  it('should generate correct HTML structure for mobile label display', () => {
    const html = '<div>{{SOCIAL_LINKS}}</div>';
    const plugin = createPluginWithTestPaths();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // For mobile: data-tooltip attribute is used by CSS to display label inside link
    // CSS rule: .tooltip-container a::after { content: attr(data-tooltip); }
    mockLinks.forEach((link) => {
      // Each link should have data-tooltip attribute for mobile label display
      expect(result).toContain(`data-tooltip="${link.label}"`);
      
      // Link should also have aria-label for accessibility
      expect(result).toContain(`aria-label="${link.label}"`);
    });
  });
});
