import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { sanitizeURL, sanitizeHTML } from '../utils/sanitize.js';

/**
 * Vite plugin to inject social links from links.json into HTML
 * Uses component template from src/components/social-link-item.html
 * @param {Object} options - Plugin options
 * @param {string} [options.linksPath] - Override the default links file path (useful for testing)
 * @param {string} [options.templatePath] - Override the default template file path (useful for testing)
 * @returns {Object} Vite plugin object
 */
export default function linksPlugin(options = {}) {
  // Allow overriding paths for testing
  const defaultLinksPath = resolve(process.cwd(), 'public/api/links.json');
  const defaultTemplatePath = resolve(process.cwd(), 'src/components/social-link-item.html');
  const getLinksPath = () => options.linksPath || defaultLinksPath;
  const getTemplatePath = () => options.templatePath || defaultTemplatePath;

  return {
    name: 'inject-links',
    transformIndexHtml(html) {
      try {
        const linksPath = getLinksPath();

        if (!existsSync(linksPath)) {
          console.warn('Links JSON not found at:', linksPath);
          return html;
        }

        const linksData = JSON.parse(readFileSync(linksPath, 'utf-8'));

        if (linksData.length === 0) return html;

        // Load template
        const templatePath = getTemplatePath();
        if (!existsSync(templatePath)) {
          console.warn('Social link template not found at:', templatePath);
          return html;
        }

        const template = readFileSync(templatePath, 'utf-8');

        // Generate HTML for links using template
        const linksHTML = linksData
          .map((link) => {
            const url = sanitizeURL(link.url);
            const label = sanitizeHTML(link.label);
            const icon = sanitizeHTML(link.icon);

            return template
              .replace(/{{URL}}/g, url)
              .replace(/{{LABEL}}/g, label)
              .replace(/{{ICON}}/g, icon);
          })
          .join('\n');

        return html.replace(/{{SOCIAL_LINKS}}/, linksHTML);
      } catch (error) {
        console.error('Error in links plugin:', error);
        return html;
      }
    },
  };
}
