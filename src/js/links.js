/**
 * Social Links functionality
 * Handles social media links initialization and interactions
 */

// Initialize social links on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initializeSocialLinks();
});

/**
 * Initialize social links functionality
 * Currently, links are injected via Vite plugin, but this can be used
 * for any future enhancements like analytics tracking or interaction handling
 */
function initializeSocialLinks() {
  const socialLinks = document.querySelectorAll('.hero-social-links a');

  // Future: Add analytics tracking, click handlers, etc.
  socialLinks.forEach((link) => {
    // Links are already set up with proper attributes via Vite plugin
    // This function can be extended for analytics or other enhancements
  });
}

