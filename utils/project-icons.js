/**
 * Project Type Icons Utility
 * Returns the SVG sprite icon key for a given project type. The key maps to a
 * <symbol id="i-{key}"> in the inline sprite (see layout.html), referenced via
 * <svg class="icon"><use href="#i-{key}" /></svg>.
 * @param {string} projectType - The project type (dev, film, music, community, etc.)
 * @returns {string} The sprite icon key (e.g., 'code', 'users')
 */
export function getProjectTypeIcon(projectType) {
  switch (projectType) {
    case 'dev':
      return 'code';
    case 'film':
      return 'video';
    case 'music':
      return 'music';
    case 'community':
      return 'users';
    default:
      return 'folder';
  }
}

