import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { sanitizeURL, sanitizeHTML } from '../utils/sanitize.js';

/**
 * Generic gallery plugin for photography, videography, and discography
 * Uses component templates from src/components/ and JSON data from public/api/
 */
export default function galleryPlugin() {
  return {
    name: 'inject-gallery',
    transformIndexHtml(html, context) {
      // Determine gallery type from filename
      const filename = context.filename || context.path || '';
      let galleryType = null;
      let placeholder = null;
      let dataSource = null;
      let templatePath = null;

      if (filename.includes('photography')) {
        galleryType = 'photography';
        placeholder = '{{PHOTOS}}';
        dataSource = 'directory'; // Photography reads from directory, not JSON
        templatePath = resolve(process.cwd(), 'src/components/photography-item.html');
      } else if (filename.includes('videography')) {
        galleryType = 'videography';
        placeholder = '{{VIDEOS}}';
        dataSource = resolve(process.cwd(), 'public/api/videography.json');
        templatePath = resolve(process.cwd(), 'src/components/videography-item.html');
      } else if (filename.includes('discography')) {
        galleryType = 'discography';
        placeholder = '{{ALBUMS}}';
        dataSource = resolve(process.cwd(), 'public/api/discography.json');
        templatePath = resolve(process.cwd(), 'src/components/discography-item.html');
      } else {
        // Not a gallery page, skip
        return html;
      }

      try {
        let itemsHTML = '';

        if (galleryType === 'photography') {
          // Photography: read files from directory
          const photoDir = resolve(process.cwd(), 'public/img/photography');
          if (!existsSync(photoDir)) {
            console.warn('Photography directory not found at:', photoDir);
            return html;
          }

          const files = readdirSync(photoDir)
            .filter((file) => /\.(jpg|jpeg|webp|png)$/i.test(file))
            .sort();

          if (files.length === 0) {
            console.warn('No image files found in photography directory');
            return html;
          }

          // Load template
          const template = readFileSync(templatePath, 'utf-8');

          // Generate HTML for each photo
          itemsHTML = files
            .map((file, index) => {
              const alt = `Photography ${index + 1}`;
              let itemHTML = template
                .replace(/{{INDEX}}/g, index + 1)
                .replace(/{{ALT}}/g, alt)
                .replace(/{{IMAGE_SRC}}/g, `/img/photography/${file}`);
              // Add consistent indentation (12 spaces)
              return '            ' + itemHTML.trim().replace(/\n/g, '\n            ');
            })
            .join('\n');
        } else {
          // Videography or Discography: read from JSON
          if (!existsSync(dataSource)) {
            console.warn(`Gallery data file not found at: ${dataSource}`);
            return html;
          }

          const data = JSON.parse(readFileSync(dataSource, 'utf-8'));
          if (!Array.isArray(data) || data.length === 0) {
            console.warn(`No ${galleryType} data found`);
            return html;
          }

          // Load template
          const template = readFileSync(templatePath, 'utf-8');

          // Generate HTML for each item
          itemsHTML = data
            .map((item) => {
              let itemHTML = template;

              if (galleryType === 'videography') {
                const coverSrc = sanitizeURL(`/img/videography/${item.cover}`);
                const title = sanitizeHTML(item.title);
                const videoId = item.videoId;

                itemHTML = itemHTML
                  .replace(/{{VIDEO_ID}}/g, videoId)
                  .replace(/{{TITLE}}/g, title)
                  .replace(/{{COVER_SRC}}/g, coverSrc);
              } else if (galleryType === 'discography') {
                const title = sanitizeHTML(item.title);
                const date = item.date || '';
                const embed = item.embed || '';

                // Build date HTML if date exists
                const dateHTML = date
                  ? `<time class="album-date" datetime="${date}">${date}</time>`
                  : '';

                // Build embed HTML if embed exists
                const embedHTML = embed
                  ? `<div class="album-embed" aria-label="Music player for ${title}">
                <div class="iframe-loading">
                  <div class="loading-spinner"></div>
                </div>
                ${embed}
              </div>`
                  : '';

                itemHTML = itemHTML
                  .replace(/{{TITLE}}/g, title)
                  .replace(/{{DATE_HTML}}/g, dateHTML)
                  .replace(/{{EMBED_HTML}}/g, embedHTML);
              }

              // Add consistent indentation (12 spaces)
              return '            ' + itemHTML.trim().replace(/\n/g, '\n            ');
            })
            .join('\n');
        }

        // Replace placeholder in HTML
        return html.replace(new RegExp(placeholder, 'g'), itemsHTML);
      } catch (error) {
        console.error(`Error in ${galleryType} gallery plugin:`, error);
        return html;
      }
    },
  };
}

