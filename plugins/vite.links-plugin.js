import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export default function linksPlugin() {
  return {
    name: 'inject-links',
    transformIndexHtml(html) {
      try {
        const linksPath = resolve(process.cwd(), 'public/api/links.json');

        if (!existsSync(linksPath)) {
          console.warn('Links JSON not found at:', linksPath);
          return html;
        }

        const linksData = JSON.parse(readFileSync(linksPath, 'utf-8'));

        if (linksData.length === 0) return html;

        // Generate HTML for links
        const linksHTML = linksData
          .map((link) => {
            return `                    <div class="tooltip-container" role="listitem">
                        <a href="${link.url}" target="_blank" aria-label="${link.label}" data-tooltip="${link.label}" rel="noopener noreferrer"><i class="${link.icon}" aria-hidden="true"></i></a>
                        <div class="tooltip" aria-hidden="true">${link.label}</div>
                    </div>`;
          })
          .join('\n');

        return html.replace(/<!--\s*SOCIAL_LINKS\s*-->/, linksHTML);
      } catch (error) {
        console.error('Error in links plugin:', error);
        return html;
      }
    },
  };
}
