/**
 * Projects Module
 * Handles modal functionality for static project cards
 */

import { sanitizeHTML, sanitizeURL, sanitizeEmbed, pauseAllMedia, getProjectTypeIcon } from './utils.js';
import { setModalOpen, removeModalOpen, initializeModalCloseHandlers, initializeModalNavigation, handleModalIframeSpinner, initializeModalTouchSwipe, closeModal, resetModalStyles } from './modals.js';

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
    const allProjects = await response.json();
    // Filter out hidden projects (only show projects where hidden is false or doesn't exist)
    projectsData = allProjects.filter(project => project.hidden !== true);
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
  
  // Reset any inline styles that might interfere with animations
  // This ensures normal animations work even after swipe-close
  resetModalStyles(modal, modalContent);

  const project = projectsData[projectIndex];

  // Sanitize all input
  const title = sanitizeHTML(project.title || '');
  const headline = sanitizeHTML(project.headline || '');
  const rawType = project.type || '';
  const type = rawType ? sanitizeHTML(rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase()) : '';
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
          <div class="modal-meta">
            ${project.type ? `<p class="modal-type"><strong>Type:</strong> ${type}</p>` : ''}
            ${project.date ? `<p class="modal-date"><strong>Date:</strong> ${date}</p>` : ''}
            ${project.credits ? `<p class="modal-credits"><strong>Credits:</strong> ${credits}</p>` : ''}
          </div>
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

  // Handle iframe loading with delay to wait for animation to complete
  if (project.embed) {
    const embedContainer = modalContent.querySelector('.modal-embed, .modal-embed-responsive');
    if (embedContainer) {
      // Find all iframes in the embed container
      const iframes = embedContainer.querySelectorAll('iframe, embed, object');
      
      if (iframes.length > 0) {
        // Store original src values and clear them temporarily
        const originalSources = Array.from(iframes).map(iframe => {
          const src = iframe.getAttribute('src') || iframe.getAttribute('data');
          if (src) {
            iframe.removeAttribute('src');
            if (iframe.hasAttribute('data')) {
              iframe.removeAttribute('data');
            }
          }
          return src;
        });
        
        // Wait for modal animation to complete (300ms + 50ms buffer)
        setTimeout(() => {
          // Restore src attributes to start loading iframes
          iframes.forEach((iframe, index) => {
            if (originalSources[index]) {
              // Restore src or data attribute based on element type
              if (iframe.tagName === 'IFRAME' || iframe.tagName === 'EMBED') {
                iframe.setAttribute('src', originalSources[index]);
              } else if (iframe.tagName === 'OBJECT') {
                iframe.setAttribute('data', originalSources[index]);
              }
            }
          });
          
          // Handle loading spinner
          handleModalIframeSpinner(embedContainer);
        }, 350);
      } else {
        // If no embed elements, handle spinner immediately
        handleModalIframeSpinner(embedContainer);
      }
    }
  }

  // Initialize modal close handlers
  initializeModalCloseHandlers('project-modal', closeProjectModal);
  
  // Initialize touch swipe-down to close on mobile
  initializeModalTouchSwipe('project-modal', closeProjectModal);
}

/**
 * Close project modal
 * @param {string} [closeMethod='button'] - How the modal was closed: 'swipe' for swipe-down, 'button' for button/click outside
 */
function closeProjectModal(closeMethod = 'button') {
  const modalContent = document.getElementById('modal-content');
  
  // Use the generic closeModal function from modals.js
  closeModal('project-modal', modalContent, closeMethod);

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
