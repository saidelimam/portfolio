/**
 * Home Page JavaScript
 * Handles home page specific functionality: profile picture security, social links
 * Background animations control is in main.js (transversal)
 */

import { preventImageDragAndRightClick } from './utils.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  initializeProfilePictureSecurity();
  initializeSocialLinks();
});

/**
 * Secure profile picture from drag and right-click
 */
function initializeProfilePictureSecurity() {
  const profilePicture = document.querySelector('.profile-picture img');
  if (profilePicture) {
    preventImageDragAndRightClick(profilePicture);
  }
}

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

