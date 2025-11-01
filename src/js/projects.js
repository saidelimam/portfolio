/**
 * Projects Module
 * Handles modal functionality for static project cards
 */

import { sanitizeHTML, sanitizeURL, sanitizeEmbed, pauseAllMedia, preventImageDragAndRightClick, getProjectTypeIcon } from './utils.js';
import { setModalOpen, removeModalOpen, initializeModalCloseHandlers, initializeModalNavigation, handleModalIframeSpinner } from './modals.js';

// Project data loaded from JSON file
let projectsData = [];

/**
 * Load project data from JSON file
 */
async function loadProjectsData() {
  try {
    const response = await fetch('/api/projects.json');
    if (!response.ok) {
      throw new Error('Failed to load projects data');
    }
    projectsData = await response.json();
    return projectsData;
  } catch (error) {
    console.error('Error loading projects data:', error);
    return [];
  }
}

/**
 * Initialize project cards by adding click handlers to existing static cards
 */
function initializeProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card, index) => {
    card.style.cursor = 'pointer';

    card.addEventListener('click', (e) => {
      // Don't open modal if clicking on a link
      if (e.target.closest('a')) {
        return;
      }

      openProjectModal(index);
    });
  });
}

/**
 * Open project modal with detailed information
 */
function openProjectModal(projectIndex) {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');

  if (!modal || !modalContent) return;

  const project = projectsData[projectIndex];

  // Sanitize all input
  const title = sanitizeHTML(project.title || '');
  const headline = sanitizeHTML(project.headline || '');
  const type = sanitizeHTML(project.type || '');
  const date = sanitizeHTML(project.date || '');
  const credits = sanitizeHTML(project.credits || '');
  const details = sanitizeHTML(project.details || '');

  // Sanitize URLs
  const iconURL = sanitizeURL(project.icon);
  const snapshotURL = sanitizeURL(project.snapshot);

  // Create modal content HTML
  const modalHTML = `
    <div class="modal-header">
      <div class="modal-title-container">
        ${
          project.icon
            ? `<img src="${iconURL}" alt="${title} icon" class="modal-icon">`
            : `<i class="fas ${getProjectTypeIcon(project.type)}" class="modal-icon-fallback" aria-hidden="true"></i>`
        }
        <h2 class="modal-title">${title}</h2>
      </div>
      <button class="modal-close" aria-label="Close details">&times;</button>
    </div>
    <div class="modal-body">
      ${
        project.embed
          ? `<div class="${project.type === 'film' ? 'modal-embed-responsive' : 'modal-embed'}">
        <div class="iframe-loading">
          <div class="loading-spinner"></div>
        </div>
        ${sanitizeEmbed(project.embed)}
      </div>`
          : `<p class="modal-description">${headline}</p>`
      }
      <div class="modal-content-wrapper">
        <div class="modal-details">
          <h3>Project Details</h3>
          ${project.type ? `<p class="modal-type"><strong>Type:</strong> ${type}</p>` : ''}
          ${project.date ? `<p class="modal-date"><strong>Date:</strong> ${date}</p>` : ''}
          ${project.credits ? `<p class="modal-credits"><strong>Credits:</strong> ${credits}</p>` : ''}
          <p class="modal-details-text">${details}</p>
        </div>
        ${project.snapshot ? `<img src="${snapshotURL}" alt="${title} snapshot" class="modal-screenshot" draggable="false">` : ''}
      </div>
      <div class="modal-technologies">
        <h3>Tags</h3>
        <div class="tech-tags">
          ${project.tags.map((tag) => `<span class="tech-tag">${sanitizeHTML(tag)}</span>`).join('')}
        </div>
      </div>
      <div class="modal-links">
        <h3>Links</h3>
        <div class="project-links">
          ${project.links.map((link) => `<a href="${sanitizeURL(link.url)}" class="project-link" target="_blank" rel="noopener noreferrer">${sanitizeHTML(link.text)}</a>`).join('')}
        </div>
      </div>
    </div>
  `;

  // Set modal content
  modalContent.innerHTML = modalHTML;

  // Show modal
  modal.classList.add('active');
  setModalOpen();

  // Add browser history entry for modal
  history.pushState({ modalOpen: true, projectIndex: projectIndex }, '', '#' + projectIndex);

  // Scroll modal content to top
  modalContent.scrollTop = 0;

  // Handle iframe loading spinner
  if (project.embed) {
    const embedContainer = modalContent.querySelector('.modal-embed, .modal-embed-responsive');
    if (embedContainer) {
      handleModalIframeSpinner(embedContainer);
    }
  }

  // Secure snapshot image (prevent drag and right-click)
  if (project.snapshot) {
    const snapshotImg = modalContent.querySelector('.modal-screenshot');
    if (snapshotImg) {
      preventImageDragAndRightClick(snapshotImg);
    }
  }

  // Initialize modal close handlers
  initializeModalCloseHandlers('project-modal', closeProjectModal);
}

/**
 * Close project modal
 */
function closeProjectModal() {
  const modalContent = document.getElementById('modal-content');

  // Pause all media (videos, audio, iframes) when closing modal
  pauseAllMedia(modalContent);

  const modal = document.getElementById('project-modal');
  modal.classList.remove('active');
  removeModalOpen();

  // Restore URL to original without adding history entry
  history.replaceState(null, '', window.location.pathname);
}

/**
 * Initialize browser navigation support for modals
 */
function initializeProjectModalNavigation() {
  const modalContent = document.getElementById('modal-content');
  if (!modalContent) return; // DOM not ready yet
  
  initializeModalNavigation('project-modal', () => {
    pauseAllMedia(modalContent);
    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    removeModalOpen();
  }, modalContent);
}

// Initialize modal navigation support when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProjectModalNavigation);
} else {
  // DOM already loaded
  initializeProjectModalNavigation();
}

// Export functions as ESM module exports
export { loadProjectsData, initializeProjectCards, openProjectModal, closeProjectModal };
