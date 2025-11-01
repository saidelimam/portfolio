import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { sanitizeHTML, sanitizeURL } from '../utils/sanitize.js';
import { getProjectTypeIcon } from '../utils/project-icons.js';

export default function projectsPlugin() {
  return {
    name: 'inject-projects',
    transformIndexHtml(html) {
      try {
        const projectsPath = resolve(process.cwd(), 'public/api/projects.json');

        if (!existsSync(projectsPath)) {
          console.warn('Projects JSON not found at:', projectsPath);
          return html;
        }

        const projectsData = JSON.parse(readFileSync(projectsPath, 'utf-8'));

        if (projectsData.length === 0) return html;

        // Generate HTML for projects grid
        const projectsHTML = projectsData
          .map((project, index) => {
            const typeIcon = getProjectTypeIcon(project.type);

            const projectIcon = project.icon
              ? `<img src="${project.icon}" alt="${project.title} icon" class="project-icon">`
              : `<i class="fas ${typeIcon}" aria-hidden="true"></i>`;

            // Sanitize snapshot URL for use in CSS
            const snapshotURL = project.snapshot ? sanitizeURL(project.snapshot) : '';

            return `                    <article class="project-card" data-project="${index}" role="listitem" ${snapshotURL ? `style="background-image: url('${snapshotURL}');"` : ''}>
                      <div class="project-card-overlay"></div>
                      <div class="project-type-icon project-type-${project.type}">
                          <i class="fas ${typeIcon}" aria-label="${project.type} project type" title="${project.type.charAt(0).toUpperCase() + project.type.slice(1)} Project"></i>
                      </div>
                      <div class="project-header">
                          ${projectIcon}
                          <h3>${project.title}</h3>
                      </div>
                      ${project.date ? `<span class="project-date">${sanitizeHTML(project.date)}</span>` : ''}
                      <p>${project.description}</p>
                      <div class="project-links">
                          ${project.links
                            .map(
                              (link) =>
                                `<a href="${sanitizeURL(link.url)}" target="_blank" class="project-link" rel="noopener noreferrer">${sanitizeHTML(link.text)}</a>`
                            )
                            .join('')}
                      </div>
                  </article>`;
          })
          .join('\n');

        return html.replace(/{{PROJECTS}}/, projectsHTML);
      } catch (error) {
        console.error('Error in projects plugin:', error);
        return html;
      }
    },
  };
}
