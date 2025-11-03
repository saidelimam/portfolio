/**
 * Discography Page JavaScript Entry Point
 * Imports LESS styles and initializes transversal functionality and discography embeds
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';
import { initializePerformanceOptimizations, initializeSmoothScrolling, initializeHeaderScrollEffect, initializeScrollToTop, initializePageLoadingSpinner } from './core.js';
import { hideIframeSpinner } from './utils.js';

// Initialize transversal functionality and discography embeds on DOM load
document.addEventListener('DOMContentLoaded', function () {
  // Mark body as loaded to show content after CSS is ready
  document.body.classList.add('loaded');
  
  // Performance and browser detection
  initializePerformanceOptimizations();

  initializeSmoothScrolling();
  initializeHeaderScrollEffect();
  initializeScrollToTop();
  initializePageLoadingSpinner();
  
  // Initialize discography embeds
  initializeDiscographyEmbeds();
});

/**
 * Initialize discography embeds with loading spinners
 */
function initializeDiscographyEmbeds() {
  const albumEmbeds = document.querySelectorAll('.album-embed');

  albumEmbeds.forEach((embed) => {
    const iframe = embed.querySelector('iframe');
    const loadingSpinner = embed.querySelector('.iframe-loading');

    if (!iframe || !loadingSpinner) return;

    // Function to hide spinner
    const hideSpinner = () => hideIframeSpinner(loadingSpinner, 300);

    // Hide spinner when iframe loads
    iframe.addEventListener('load', hideSpinner);

    // For Spotify embeds, hide spinner quickly to ensure iframe is visible
    // Use a short timeout to allow iframe to start rendering
    setTimeout(hideSpinner, 500);
  });
}

