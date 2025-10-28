import { readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

export default function photographyPlugin() {
  return {
    name: 'inject-photography',
    transformIndexHtml(html, context) {
      // Only run on photography.html
      if (!context.filename?.includes('photography')) {
        return html;
      }

      try {
        const photoDir = resolve(process.cwd(), 'public/img/photography');

        if (!existsSync(photoDir)) {
          console.warn('Photography directory not found at:', photoDir);
          return html;
        }

        // Read all image files from the directory
        const files = readdirSync(photoDir)
          .filter((file) => /\.(jpg|jpeg|webp|png)$/i.test(file))
          .sort();

        if (files.length === 0) {
          console.warn('No image files found in photography directory');
          return html;
        }

        // Generate HTML for all photos
        const photosHTML = files
          .map((file, index) => {
            const alt = `Photography ${index + 1}`;
            return `            <div class="photo-item" role="listitem" tabindex="0" aria-label="View image ${index + 1}: ${alt}">
              <img src="/img/photography/${file}" alt="${alt}" loading="lazy" />
            </div>`;
          })
          .join('\n');

        return html.replace(/{{PHOTOS}}/, photosHTML);
      } catch (error) {
        console.error('Error in photography plugin:', error);
        return html;
      }
    },
  };
}
