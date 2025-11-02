import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Vite plugin to inject metadata from metadata.json into HTML
 * @param {Object} options - Plugin options
 * @param {string} [options.metadataPath] - Override the default metadata file path (useful for testing)
 * @returns {Object} Vite plugin object
 */
export default function metadataPlugin(options = {}) {
  // Allow overriding metadata path for testing
  const defaultMetadataPath = resolve(process.cwd(), 'public/api/metadata.json');
  const getMetadataPath = () => options.metadataPath || defaultMetadataPath;

  return {
    name: 'inject-metadata',
    transformIndexHtml(html, context) {
      try {
        const metadataPath = getMetadataPath();

        if (!existsSync(metadataPath)) {
          console.warn('Metadata JSON not found at:', metadataPath);
          return html;
        }

        const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

        // Replace theme color placeholder
        const themeColor = metadata.themeColor || '#c2185b'; // Fallback to default if not set
        html = html.replace(/{{THEME_COLOR}}/g, themeColor);

        // Replace all tags

        html = html.replace(/{{TITLE}}/g, metadata.person.name);
        html = html.replace(/{{META_DESCRIPTION}}/g, `${metadata.person.name}, ${metadata.person.tagline}. Check out his work and contact him for booking requests!`);
        html = html.replace(/{{META_AUTHOR}}/g, metadata.person.name);
        html = html.replace(/{{META_COPYRIGHT}}/g, `© 2025 ${metadata.person.name}`);
        html = html.replace(/{{FACEBOOK_APP_ID}}/g, metadata.facebookAppId);

        // Determine canonical URL based on page path (used for canonical, og:url, and twitter:url)
        let canonicalUrl = metadata.person.website; // Default to website root
        if (context.path) {
          // Extract page name from path
          // Examples: 
          // - pages/photography.html -> photography
          // - pages/videography.html -> videography
          // - index.html -> (stays as root)
          const pathMatch = context.path.match(/(?:pages\/)?([^\/]+)\.html$/);
          if (pathMatch && pathMatch[1] !== 'index') {
            const pageName = pathMatch[1];
            canonicalUrl = `${metadata.person.website}/${pageName}`;
          }
          // index.html and other root pages use the default website URL
        }

        // Replace canonical URL placeholder (already determined above)
        html = html.replace(/{{CANONICAL_URL}}/g, canonicalUrl);

        // Replace Open Graph URL placeholder and other Open Graph tags
        html = html.replace(/{{OG_URL}}/g, canonicalUrl);
        html = html.replace(/{{OG_TITLE}}/g, `${metadata.person.name} - Portfolio`);
        html = html.replace(/{{OG_DESCRIPTION}}/g, `${metadata.person.tagline}. Check out my work and contact me for booking requests!`);
        html = html.replace(/{{OG_IMAGE}}/g, `${metadata.person.website}/img/profile_picture.jpg`);
        html = html.replace(/{{OG_IMAGE_ALT}}/g, `${metadata.person.name} - Profile Picture`);
        html = html.replace(/{{OG_SITE_NAME}}/g, `${metadata.person.name} Portfolio`);
        html = html.replace(/{{TWITTER_URL}}/g, canonicalUrl);
        html = html.replace(/{{TWITTER_TITLE}}/g, `${metadata.person.name} - Portfolio`);
        html = html.replace(/{{TWITTER_DESCRIPTION}}/g, `${metadata.person.tagline}. Check out my work and contact me for booking requests!`);
        html = html.replace(/{{TWITTER_IMAGE}}/g, `${metadata.person.website}/img/profile_picture.jpg`);
        html = html.replace(/{{TWITTER_IMAGE_ALT}}/g, `${metadata.person.name} - Profile Picture`);

        // Replace logo image alt placeholder
        html = html.replace(/{{LOGO_IMG_ALT}}/g, metadata.person.fullName);

        // Replace hero h1 placeholder
        html = html.replace(/{{HERO_H1}}/g, metadata.person.fullName);

        // Replace hero tagline placeholder
        html = html.replace(/{{HERO_TAGLINE}}/g, metadata.person.tagline);

        // Replace about description placeholder with truncated version and Read more link
        const fullDescription = metadata.about.description || '';
        const truncatedLength = 350;
        let descriptionHTML = fullDescription;
        
        if (fullDescription.length > truncatedLength) {
          // Find a good break point (end of sentence or space near 1000 characters)
          let breakPoint = truncatedLength;
          const nearEnd = fullDescription.substring(truncatedLength - 50, truncatedLength + 50);
          // Try to break at sentence end
          const sentenceEnd = nearEnd.search(/[.!?]\s/);
          if (sentenceEnd > 0) {
            breakPoint = truncatedLength - 50 + sentenceEnd + 1;
          } else {
            // Try to break at space
            const spaceIndex = nearEnd.lastIndexOf(' ');
            if (spaceIndex > 0) {
              breakPoint = truncatedLength - 50 + spaceIndex + 1;
            }
          }
          
          const truncatedText = fullDescription.substring(0, breakPoint).trim();
          const remainingText = fullDescription.substring(breakPoint).trim();
          
          descriptionHTML = `<span class="about-description-text"><span class="about-description-truncated">${truncatedText}...</span><span class="about-description-full" style="display: none;">${fullDescription}</span></span> <a href="#" class="about-read-more" aria-label="Read more about me">Read more</a>`;
        }
        
        html = html.replace(/{{ABOUT_DESCRIPTION}}/g, descriptionHTML);

        // Generate skills HTML
        const skillsHTML = metadata.skills
          .map(
            (skill) =>
              `<span class="skill-tag" role="listitem">${skill}</span>`
          )
          .join('\n');

        // Replace skills placeholder
        html = html.replace(/{{SKILLS}}/g, skillsHTML);

        // Generate companies HTML
        const companiesHTML = metadata.companies
          .map(
            (company) =>
              `<a href="${company.url}" target="_blank" class="company-tag" role="listitem" rel="noopener noreferrer" aria-label="${company.name} company">${company.name}</a>`
          )
          .join('\n');

        // Replace companies placeholder
        html = html.replace(/{{COMPANIES}}/g, companiesHTML);

        return html;
      } catch (error) {
        console.error('Error in metadata plugin:', error);
        return html;
      }
    },
  };
}
