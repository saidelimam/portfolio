import { readFileSync } from 'fs';
import { resolve } from 'path';
import { sanitizeURL, sanitizeHTML } from '../utils/sanitize.js';

export default function videographyPlugin() {
  return {
    name: 'inject-videography',
    transformIndexHtml(html, context) {
      // Only run for videography.html
      if (!context.filename?.includes('videography.html')) {
        return html;
      }

      try {
        const videographyDataPath = resolve(process.cwd(), 'public/api/videography.json');
        const videographyData = JSON.parse(readFileSync(videographyDataPath, 'utf-8'));

        if (!Array.isArray(videographyData) || videographyData.length === 0) {
          console.warn('No videography data found');
          return html;
        }

        const videosHTML = videographyData
          .map((video) => {
            const coverSrc = sanitizeURL(`/img/videography/${video.cover}`);
            const title = sanitizeHTML(video.title);
            const videoId = video.videoId;

            return `            <div class="video-item" role="listitem" data-video-id="${videoId}">
              <div class="video-cover">
                <img src="${coverSrc}" alt="${title}" loading="lazy" />
                <div class="play-button" aria-label="Play ${title}">
                  <i class="fas fa-play" aria-hidden="true"></i>
                </div>
              </div>
            </div>`;
          })
          .join('\n');

        return html.replace(/{{VIDEOS}}/, videosHTML);
      } catch (error) {
        console.error('Error in videography plugin:', error);
        return html;
      }
    },
  };
}
