/**
 * Home Page JavaScript Entry Point
 * Imports LESS styles and initializes transversal functionality, home-specific features,
 * background animations, and profile picture security
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';
import { initializePerformanceOptimizations, initializeSmoothScrolling, initializeHeaderScrollEffect, initializeScrollToTop } from './core.js';
import { createScrollHandler, preventImageDragAndRightClick } from './utils.js';
// Import projects module to ensure ProjectsModule is available
import './projects.js';

// Constants
const ANIMATION_PAUSE_SCROLL_THRESHOLD = 500; // Pause animations when scrolling past this pixel value

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Mark body as loaded to show content after CSS is ready
  document.body.classList.add('loaded');
  
  // Performance and browser detection
  initializePerformanceOptimizations();

  initializeSmoothScrolling();
  initializeHeaderScrollEffect();
  initializeScrollToTop();
  initializeBackgroundAnimations();

  // Initialize projects module (projects.js is imported above, so ProjectsModule should be available)
  // Import statement executes before this code, so window.ProjectsModule should be set
  if (window.ProjectsModule) {
    try {
      // Load project data from JSON
      await window.ProjectsModule.loadProjectsData();
      // Initialize project cards after data is loaded
      window.ProjectsModule.initializeProjectCards();
    } catch (error) {
      console.error('Error initializing projects:', error);
    }
  } else {
    console.error('ProjectsModule not available. Make sure projects.js is imported correctly.');
  }
  
  // Initialize home-specific features
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
 * Initialize background animations control based on scroll position
 * Pauses all animations (body gradient, cinematic background, lights, dust particles) 
 * when user scrolls past the threshold
 */
function initializeBackgroundAnimations() {
  const cinematicBackground = document.querySelector('.cinematic-background');
  const dustParticles = document.querySelectorAll('.dust-particles');

  if (!cinematicBackground) return;

  const scrollHandler = createScrollHandler(() => {
    const scrollY = window.scrollY;
    const shouldPause = scrollY > ANIMATION_PAUSE_SCROLL_THRESHOLD;

    // Add/remove class to body to pause all animations via CSS:
    // - Body gradient animation (gradientShift)
    // - Cinematic background and lights
    // - Dust particles
    if (shouldPause) {
      if (!document.body.classList.contains('animations-paused')) {
        document.body.classList.add('animations-paused');
      }
    } else {
      document.body.classList.remove('animations-paused');
    }
  });
  
  window.addEventListener('scroll', scrollHandler, { passive: true });
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

