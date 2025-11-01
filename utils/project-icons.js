/**
 * Project Type Icons Utility
 * Returns the appropriate Font Awesome icon class for a given project type
 * @param {string} projectType - The project type (dev, film, music, community, etc.)
 * @returns {string} The Font Awesome icon class name (e.g., 'fa-code', 'fa-users')
 */
export function getProjectTypeIcon(projectType) {
  switch (projectType) {
    case 'dev':
      return 'fa-code';
    case 'film':
      return 'fa-video';
    case 'music':
      return 'fa-music';
    case 'community':
      return 'fa-users';
    default:
      return 'fa-folder';
  }
}

