import { readFileSync } from 'fs';
import { resolve } from 'path';

export default function discographyPlugin() {
  return {
    name: 'inject-discography',
    transformIndexHtml(html, context) {
      // Only run for discography.html
      if (!context.filename?.includes('discography.html')) {
        return html;
      }

      try {
        const discographyDataPath = resolve(process.cwd(), 'public/api/discography.json');
        const discographyData = JSON.parse(readFileSync(discographyDataPath, 'utf-8'));

        if (!Array.isArray(discographyData) || discographyData.length === 0) {
          console.warn('No discography data found');
          return html;
        }

        const albumsHTML = discographyData
          .map((album) => {
            const title = album.title;
            const date = album.date || '';
            const embed = album.embed || '';

            return `            <div class="album-card" role="listitem">
              <div class="album-header">
                <h2 class="album-title">${title}</h2>
                <span class="album-date">${date}</span>
              </div>
              ${embed ? `<div class="album-embed">${embed}</div>` : ''}
            </div>`;
          })
          .join('\n');

        return html.replace(/{{ALBUMS}}/, albumsHTML);
      } catch (error) {
        console.error('Error in discography plugin:', error);
        return html;
      }
    },
  };
}

