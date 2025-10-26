/**
 * Projects Module
 * Handles modal functionality for static project cards
 */

// Project data
const projectsData = [
  {
    title: 'GoCollab.cc',
    description: 'Social Network for Creative Professionals',
    details: 'GoCollab is a comprehensive platform designed to connect creative professionals, streamline project workflows, and facilitate collaboration across different creative disciplines. The platform features real-time communication, project tracking, resource management, and portfolio showcasing capabilities.',
    date: 'Jan 2025',
    tags: ['React', 'Node.js', 'Cloudflare', 'PostgreSQL'],
    icon: 'img/icon/gocollab.ico',
    screenshot: 'img/screenshot/gocollab.jpg',
    type: 'dev',
    links: [
      { text: 'Visit Platform', url: 'https://gocollab.cc' },
    ]
  }
];

/**
 * Initialize project cards by adding click handlers to existing static cards
 */
function initializeProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openProjectModal(index));
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
  
  // Create modal content HTML
  const modalHTML = `
    <div class="modal-header">
      <div class="modal-title-container">
        ${project.icon ? `<img src="${project.icon}" alt="${project.title} icon" class="modal-icon">` : ''}
        <h2 class="modal-title">${project.title}</h2>
      </div>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <p class="modal-description">${project.description}</p>
      <div class="modal-content-wrapper">
        <div class="modal-details">
          <h3>Project Details</h3>
          ${project.type ? `<p class="modal-type"><strong>Type:</strong> ${project.type === 'dev' ? 'Development' : project.type}</p>` : ''}
          ${project.date ? `<p class="modal-date"><strong>Date:</strong> ${project.date}</p>` : ''}
          <p class="modal-details-text">${project.details}</p>
        </div>
        ${project.screenshot ? `<img src="${project.screenshot}" alt="${project.title} screenshot" class="modal-screenshot">` : ''}
      </div>
      <div class="modal-technologies">
        <h3>Tags</h3>
        <div class="tech-tags">
          ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="modal-links">
        <h3>Links</h3>
        <div class="project-links">
          ${project.links.map(link => `<a href="${link.url}" class="project-link" target="_blank">${link.text}</a>`).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Set modal content
  modalContent.innerHTML = modalHTML;
  
  // Show modal
  modal.classList.add('active');
  document.body.classList.add('modal-open');
  
  // Add close handlers
  const closeBtn = modalContent.querySelector('.modal-close');
  closeBtn.addEventListener('click', closeProjectModal);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeProjectModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
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
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Export functions for use in main.js
window.ProjectsModule = {
  initializeProjectCards,
  openProjectModal,
  closeProjectModal
};
