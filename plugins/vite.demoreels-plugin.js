import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { sanitizeHTML, sanitizeURL } from '../utils/sanitize.js';

export default function demoreelsPlugin() {
  return {
    name: 'inject-demoreels',
    transformIndexHtml(html) {
      try {
        const demoreelsPath = resolve(process.cwd(), 'public/api/demoreels.json');

        if (!existsSync(demoreelsPath)) {
          console.warn('Demoreels JSON not found at:', demoreelsPath);
          return html;
        }

        const demoreelsData = JSON.parse(readFileSync(demoreelsPath, 'utf-8'));

        if (demoreelsData.length === 0) return html;

        // Generate HTML for demoreels accordion
        const demoreelsHTML = demoreelsData
          .map((demoreel, index) => {
            const title = sanitizeHTML(demoreel.title);
            const videoId = sanitizeURL(demoreel.videoId);
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;

            return `                    <div class="video-item" role="listitem">
                      <div class="video-header ${index === 0 ? 'active' : ''}">
                        <h3 class="video-title">${title}</h3>
                        <span class="video-toggle">
                          <i class="fas fa-chevron-down"></i>
                        </span>
                      </div>
                      <div class="video-content ${index === 0 ? 'active' : ''}">
                        <div class="video-embed">
                          <iframe 
                            src="${embedUrl}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            loading="lazy">
                          </iframe>
                        </div>
                      </div>
                    </div>`;
          })
          .join('\n');

                return html.replace(/{{DEMOREELS}}/, demoreelsHTML);
      } catch (error) {
        console.error('Error in demoreels plugin:', error);
        return html;
      }
    },
  };
}

