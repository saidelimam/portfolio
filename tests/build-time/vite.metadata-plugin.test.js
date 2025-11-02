import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import metadataPlugin from '../../plugins/vite.metadata-plugin.js';

describe('Vite Metadata Plugin', () => {
  // Persistent test metadata file path
  const testMetadataPath = resolve(process.cwd(), 'tests/mocks/test-metadata.json');
  
  const mockMetadata = {
    facebookAppId: '791925360318781',
    themeColor: '#c2185b',
    person: {
      name: 'Test Name',
      location: 'Test Location',
      tagline: 'Test Tagline',
      fullName: 'Test Full Name',
      website: 'https://www.test.com',
    },
    about: {
      description: 'Test description',
    },
    skills: ['Skill 1', 'Skill 2', 'Skill 3'],
    companies: [
      { name: 'Company 1', url: 'https://www.company1.com' },
      { name: 'Company 2', url: 'https://www.company2.com' },
    ],
  };

  // Helper to create plugin with test metadata path
  function createPluginWithTestMetadata() {
    return metadataPlugin({ metadataPath: testMetadataPath });
  }
  
  // Helper to restore default metadata after tests that modify it
  function restoreDefaultMetadata() {
    writeFileSync(testMetadataPath, JSON.stringify(mockMetadata), 'utf-8');
  }

  it('should correctly replace all metadata placeholders in HTML', () => {
    const html = `
      <html>
        <head>
          <title>{{TITLE}} | Portfolio</title>
          <meta name="theme-color" content="{{THEME_COLOR}}">
          <meta name="description" content="{{META_DESCRIPTION}}">
          <meta name="author" content="{{META_AUTHOR}}">
          <meta name="copyright" content="{{META_COPYRIGHT}}">
          <meta property="fb:app_id" content="{{FACEBOOK_APP_ID}}">
          <link rel="canonical" href="{{CANONICAL_URL}}">
          <meta property="og:url" content="{{OG_URL}}">
          <meta property="og:title" content="{{OG_TITLE}}">
          <meta property="og:description" content="{{OG_DESCRIPTION}}">
          <meta property="og:image" content="{{OG_IMAGE}}">
          <meta property="og:image:alt" content="{{OG_IMAGE_ALT}}">
          <meta property="og:site_name" content="{{OG_SITE_NAME}}">
          <meta name="twitter:url" content="{{TWITTER_URL}}">
          <meta name="twitter:title" content="{{TWITTER_TITLE}}">
          <meta name="twitter:description" content="{{TWITTER_DESCRIPTION}}">
          <meta name="twitter:image" content="{{TWITTER_IMAGE}}">
          <meta name="twitter:image:alt" content="{{TWITTER_IMAGE_ALT}}">
        </head>
        <body>
          <img alt="{{LOGO_IMG_ALT}}">
          <h1>{{HERO_H1}}</h1>
          <p>{{HERO_TAGLINE}}</p>
          <div>{{ABOUT_DESCRIPTION}}</div>
          <div>{{SKILLS}}</div>
          <div>{{COMPANIES}}</div>
        </body>
      </html>
    `;

    const plugin = createPluginWithTestMetadata();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Check all placeholders are replaced with test metadata
    expect(result).toContain(mockMetadata.person.name);
    expect(result).toContain(mockMetadata.themeColor);
    expect(result).toContain(mockMetadata.facebookAppId);
    expect(result).toContain(mockMetadata.person.fullName);
    expect(result).toContain(mockMetadata.person.tagline);
    expect(result).toContain(mockMetadata.person.website);

    // Check no placeholders remain
    expect(result).not.toContain('{{TITLE}}');
    expect(result).not.toContain('{{THEME_COLOR}}');
    expect(result).not.toContain('{{META_DESCRIPTION}}');
    expect(result).not.toContain('{{FACEBOOK_APP_ID}}');
    expect(result).not.toContain('{{HERO_H1}}');
    expect(result).not.toContain('{{HERO_TAGLINE}}');
    expect(result).not.toContain('{{ABOUT_DESCRIPTION}}');
    expect(result).not.toContain('{{SKILLS}}');
    expect(result).not.toContain('{{COMPANIES}}');
  });

  it('should add Read More link only when description exceeds 350 characters', () => {
    // Test with short description (under threshold)
    const shortDescription = 'A'.repeat(300); // 300 characters
    const shortMetadata = {
      ...mockMetadata,
      about: { description: shortDescription },
    };

    writeFileSync(testMetadataPath, JSON.stringify(shortMetadata), 'utf-8');
    try {
      const html = '<div>{{ABOUT_DESCRIPTION}}</div>';
      const plugin = createPluginWithTestMetadata();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      expect(result).toContain(shortDescription);
      expect(result).not.toContain('about-read-more');
      expect(result).not.toContain('Read more');
    } finally {
      restoreDefaultMetadata();
    }
  });

  it('should add Read More link when description exceeds 350 characters', () => {
    // Test with long description (over threshold)
    const longDescription = 'A'.repeat(500); // 500 characters
    const longMetadata = {
      ...mockMetadata,
      about: { description: longDescription },
    };

    writeFileSync(testMetadataPath, JSON.stringify(longMetadata), 'utf-8');
    try {
      const html = '<div>{{ABOUT_DESCRIPTION}}</div>';
      const plugin = createPluginWithTestMetadata();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      // Should contain truncated text with "Read more" link
      expect(result).toContain('about-description-truncated');
      expect(result).toContain('about-description-full');
      expect(result).toContain('about-read-more');
      expect(result).toContain('Read more');
      expect(result).toContain(longDescription); // Full description should be in hidden span
    } finally {
      restoreDefaultMetadata();
    }
  });

  it('should generate correct skills HTML', () => {
    const html = '<div>{{SKILLS}}</div>';
    const plugin = createPluginWithTestMetadata();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Check each skill is wrapped in a span with correct classes
    mockMetadata.skills.forEach((skill) => {
      expect(result).toContain(`<span class="skill-tag" role="listitem">${skill}</span>`);
    });

    // Check structure
    expect(result).toContain('skill-tag');
    expect(result).toContain('role="listitem"');
    expect(result).not.toContain('{{SKILLS}}');
  });

  it('should generate correct companies HTML', () => {
    const html = '<div>{{COMPANIES}}</div>';
    const plugin = createPluginWithTestMetadata();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Check each company is wrapped in a link with correct attributes
    mockMetadata.companies.forEach((company) => {
      expect(result).toContain(`href="${company.url}"`);
      expect(result).toContain(`aria-label="${company.name} company"`);
      expect(result).toContain(`>${company.name}</a>`);
    });

    // Check structure
    expect(result).toContain('company-tag');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain('role="listitem"');
    expect(result).not.toContain('{{COMPANIES}}');
  });

  it('should handle missing metadata file gracefully', () => {
    // Temporarily remove the test metadata file
    const originalContent = readFileSync(testMetadataPath, 'utf-8');
    try {
      const fs = require('fs');
      fs.unlinkSync(testMetadataPath);

      const html = '<div>{{TITLE}}</div>';
      const plugin = createPluginWithTestMetadata();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      // Should return HTML unchanged
      expect(result).toBe(html);
      expect(result).toContain('{{TITLE}}');
    } finally {
      // Restore test metadata file
      writeFileSync(testMetadataPath, originalContent, 'utf-8');
    }
  });

  it('should use fallback theme color when not provided', () => {
    const metadataWithoutTheme = {
      ...mockMetadata,
      themeColor: undefined,
    };

    writeFileSync(testMetadataPath, JSON.stringify(metadataWithoutTheme), 'utf-8');
    try {
      const html = '<meta name="theme-color" content="{{THEME_COLOR}}">';
      const plugin = createPluginWithTestMetadata();
      const result = plugin.transformIndexHtml(html, { path: 'index.html' });

      // Should use default fallback
      expect(result).toContain('#c2185b');
    } finally {
      restoreDefaultMetadata();
    }
  });

  it('should generate canonical URL correctly for index page', () => {
    const html = '<link rel="canonical" href="{{CANONICAL_URL}}">';
    const plugin = createPluginWithTestMetadata();
    const result = plugin.transformIndexHtml(html, { path: 'index.html' });

    // Should use website root for index page
    expect(result).toContain(mockMetadata.person.website);
    expect(result).not.toContain('index');
  });

  it('should generate canonical URL correctly for sub-pages', () => {
    const html = '<link rel="canonical" href="{{CANONICAL_URL}}">';
    const plugin = createPluginWithTestMetadata();
    const result = plugin.transformIndexHtml(html, { path: 'pages/photography.html' });

    // Should append page name to website URL
    expect(result).toContain(`${mockMetadata.person.website}/photography`);
  });
});