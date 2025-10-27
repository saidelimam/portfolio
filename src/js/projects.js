/**
 * Projects Module
 * Handles modal functionality for static project cards
 */

// Project data loaded from JSON file
let projectsData = [];

/**
 * Sanitize HTML to prevent XSS attacks
 */
function sanitizeHTML(str) {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/gi;
  return String(str).replace(reg, (match) => map[match]);
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 */
function sanitizeURL(url) {
  if (!url) return '#';
  url = String(url).trim();
  // Prevent javascript: and data: URLs
  if (url.toLowerCase().startsWith('javascript:') || url.toLowerCase().startsWith('data:')) {
    return '#';
  }
  return url;
}

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
            : `<i class="fas ${project.type === 'dev' ? 'fa-code' : project.type === 'film' ? 'fa-video' : project.type === 'music' ? 'fa-music' : 'fa-folder'}" class="modal-icon-fallback" aria-hidden="true"></i>`
        }
        <h2 class="modal-title">${title}</h2>
      </div>
      <button class="modal-close" aria-label="Close details">&times;</button>
    </div>
    <div class="modal-body">
      ${project.embed ? `<div class="${project.type === 'film' ? 'modal-embed-responsive' : 'modal-embed'}">
        <div class="iframe-loading">
          <div class="loading-spinner"></div>
        </div>
        ${project.embed}
      </div>` : `<p class="modal-description">${headline}</p>`}
      <div class="modal-content-wrapper">
        <div class="modal-details">
          <h3>Project Details</h3>
          ${project.type ? `<p class="modal-type"><strong>Type:</strong> ${type}</p>` : ''}
          ${project.date ? `<p class="modal-date"><strong>Date:</strong> ${date}</p>` : ''}
          ${project.credits ? `<p class="modal-credits"><strong>Credits:</strong> ${credits}</p>` : ''}
          <p class="modal-details-text">${details}</p>
        </div>
        ${project.snapshot ? `<img src="${snapshotURL}" alt="${title} snapshot" class="modal-screenshot">` : ''}
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
  document.body.classList.add('modal-open');

  // Scroll modal content to top
  modalContent.scrollTop = 0;

  // Handle iframe loading spinner
  if (project.embed) {
    const iframe = modalContent.querySelector('iframe');
    const loadingSpinner = modalContent.querySelector('.iframe-loading');
    
    if (iframe && loadingSpinner) {
      // Check if iframe is already loaded
      if (iframe.complete) {
        loadingSpinner.style.display = 'none';
      } else {
        // Hide spinner when iframe loads
        iframe.addEventListener('load', () => {
          loadingSpinner.style.display = 'none';
        });
        
        // Fallback: hide spinner after 5 seconds if iframe doesn't load
        setTimeout(() => {
          if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
          }
        }, 5000);
      }
    }
  }

  // Add close handlers
  const closeBtn = modalContent.querySelector('.modal-close');
  closeBtn.addEventListener('click', closeProjectModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

/**
 * Close project modal
 */
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');

  // Pause all media (videos, audio, iframes) when closing modal
  const videos = modalContent.querySelectorAll('video');
  videos.forEach((video) => video.pause());

  const audios = modalContent.querySelectorAll('audio');
  audios.forEach((audio) => audio.pause());

  // Remove iframes to stop playback (YouTube, Spotify, etc.)
  const iframes = modalContent.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    // Save the src to restore later if needed
    iframe.src = '';
  });

  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Export functions for use in main.js
window.ProjectsModule = {
  loadProjectsData,
  initializeProjectCards,
  openProjectModal,
  closeProjectModal,
};
