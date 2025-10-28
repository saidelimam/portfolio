import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { sanitizeHTML, sanitizeURL } from '../utils/sanitize.js';

export default function videosPlugin() {
  return {
    name: 'inject-videos',
    transformIndexHtml(html) {
      try {
        const videosPath = resolve(process.cwd(), 'public/api/videos.json');

        if (!existsSync(videosPath)) {
          console.warn('Videos JSON not found at:', videosPath);
          return html;
        }

        const videosData = JSON.parse(readFileSync(videosPath, 'utf-8'));

        if (videosData.length === 0) return html;

        // Generate HTML for videos accordion
        const videosHTML = videosData
          .map((video, index) => {
            const title = sanitizeHTML(video.title);
            const videoId = sanitizeURL(video.videoId);
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

        return html.replace(/<!--\s*VIDEOS\s*-->/, videosHTML);
      } catch (error) {
        console.error('Error in videos plugin:', error);
        return html;
      }
    },
  };
}
