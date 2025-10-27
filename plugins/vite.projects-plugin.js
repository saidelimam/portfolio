import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

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
            const typeIcon =
              project.type === 'dev'
                ? 'fa-code'
                : project.type === 'film'
                  ? 'fa-video'
                  : project.type === 'music'
                    ? 'fa-music'
                    : 'fa-folder';

            const projectIcon = project.icon
              ? `<img src="${project.icon}" alt="${project.title} icon" class="project-icon">`
              : `<i class="fas ${typeIcon}" aria-hidden="true"></i>`;

            return `                    <article class="project-card" data-project="${index}" role="listitem">
                      <div class="project-type-icon project-type-${project.type}">
                          <i class="fas ${typeIcon}" aria-label="${project.type} project type" title="${project.type.charAt(0).toUpperCase() + project.type.slice(1)} Project"></i>
                      </div>
                      <div class="project-header">
                          ${projectIcon}
                          <h3>${project.title}</h3>
                      </div>
                      <p>${project.description}</p>
                      <div class="project-links">
                          ${project.links
                            .map(
                              (link) =>
                                `<a href="${link.url}" target="_blank" class="project-link" rel="noopener noreferrer">${link.text}</a>`
                            )
                            .join('')}
                      </div>
                  </article>`;
          })
          .join('\n');

        return html.replace(/<!--\s*PROJECTS\s*-->/, projectsHTML);
      } catch (error) {
        console.error('Error in projects plugin:', error);
        return html;
      }
    },
  };
}
