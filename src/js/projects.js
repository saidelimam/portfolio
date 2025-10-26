/**
 * Projects Module
 * Handles modal functionality for static project cards
 */

// Project data
const projectsData = [
  {
    title: 'Short Film Production',
    description: 'A compelling short film showcasing innovative cinematography and storytelling techniques. Directed, filmed, and edited with original musical score composition.',
    details: 'This project involved extensive pre-production planning, location scouting, and post-production editing. The film explores themes of human connection through innovative visual storytelling techniques.',
    technologies: ['Cinematography', 'Video Editing', 'Sound Design', 'Color Grading'],
    links: [
      { text: 'View Film', url: '#' },
      { text: 'Behind the Scenes', url: '#' }
    ]
  },
  {
    title: 'Original Music Composition',
    description: 'An original musical score blending electronic and orchestral elements, created for independent film projects and multimedia installations.',
    details: 'This composition combines traditional orchestral instruments with modern electronic elements, creating a unique soundscape that enhances the visual narrative.',
    technologies: ['Music Production', 'Orchestration', 'Sound Design', 'Audio Mixing'],
    links: [
      { text: 'Listen', url: '#' },
      { text: 'Spotify', url: '#' }
    ]
  },
  {
    title: 'Technical Innovation Project',
    description: 'Engineering solutions for audio-visual production, including custom software development and hardware integration for creative workflows.',
    details: 'Developed custom tools and workflows to streamline the creative process, integrating hardware and software solutions for enhanced productivity.',
    technologies: ['Python', 'JavaScript', 'C++', 'Digital Signal Processing'],
    links: [
      { text: 'Case Study', url: '#' },
      { text: 'GitHub', url: '#' }
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
      <h2 class="modal-title">${project.title}</h2>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <p class="modal-description">${project.description}</p>
      <div class="modal-details">
        <h3>Project Details</h3>
        <p class="modal-details-text">${project.details}</p>
      </div>
      <div class="modal-technologies">
        <h3>Technologies Used</h3>
        <div class="tech-tags">
          ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
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
