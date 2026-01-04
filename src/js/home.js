/**
 * Home Page JavaScript Entry Point
 * Imports LESS styles and initializes transversal functionality, home-specific features,
 * and background animations
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';
import { initializePerformanceOptimizations, initializeSmoothScrolling, initializeHeaderScrollEffect, initializeScrollToTop, initializePageLoadingSpinner } from './core.js';
import { createScrollHandler } from './utils.js';
import { loadProjectsData, initializeProjectCards } from './projects.js';
import { BackgroundAnimation } from './background-canvas.js';

// Constants
const ANIMATION_PAUSE_SCROLL_THRESHOLD = 500; // Pause animations when scrolling past this pixel value

// Global instance of background animation
let bgAnimation = null;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Mark body as loaded to show content after CSS is ready
  document.body.classList.add('loaded');
  
  // Performance and browser detection
  initializePerformanceOptimizations();

  initializeSmoothScrolling();
  initializeHeaderScrollEffect();
  initializeScrollToTop();
  initializePageLoadingSpinner();
  initializeBackgroundAnimations();

  // Initialize projects module using imported functions
  try {
    // Load project data from JSON
    await loadProjectsData();
    // Initialize project cards after data is loaded
    initializeProjectCards();
  } catch (error) {
    console.error('Error initializing projects:', error);
  }
  
  // Initialize home-specific features
  initializeAboutReadMore();
});

/**
 * Initialize "Read more" functionality for about description
 */
export function initializeAboutReadMore() {
  const readMoreLink = document.querySelector('.about-read-more');
  if (!readMoreLink) return;

  readMoreLink.addEventListener('click', function(e) {
    e.preventDefault();
    const container = this.closest('.about-description-container');
    const truncated = container.querySelector('.about-description-truncated');
    const full = container.querySelector('.about-description-full');
    
    if (truncated && full) {
      const isExpanded = truncated.style.display === 'none';
      
      if (isExpanded) {
        // Collapse
        truncated.style.display = 'inline';
        full.style.display = 'none';
        this.textContent = 'Read more';
        this.setAttribute('aria-label', 'Read more about me');
      } else {
        // Expand
        truncated.style.display = 'none';
        full.style.display = 'inline';
        this.textContent = 'Read less';
        this.setAttribute('aria-label', 'Read less about me');
      }
    }
  });
}

/**
 * Initialize background animations control based on scroll position
 * Pauses all animations (body gradient, cinematic background, lights, dust particles) 
 * when user scrolls past the threshold
 */
function initializeBackgroundAnimations() {
  // Initialize the new canvas-based background animation
  bgAnimation = new BackgroundAnimation('background-canvas');
  bgAnimation.start();

  const scrollHandler = createScrollHandler(() => {
    const scrollY = window.scrollY;
    const shouldPause = scrollY > ANIMATION_PAUSE_SCROLL_THRESHOLD;

    // Add/remove class to body to pause all animations via CSS:
    // - Body gradient animation (gradientShift)
    if (shouldPause) {
      if (!document.body.classList.contains('animations-paused')) {
        document.body.classList.add('animations-paused');
        if (bgAnimation) bgAnimation.stop();
      }
    } else {
      if (document.body.classList.contains('animations-paused')) {
        document.body.classList.remove('animations-paused');
        if (bgAnimation) bgAnimation.start();
      }
    }
  });
  
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

