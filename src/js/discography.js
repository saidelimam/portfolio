/**
 * Discography Page JavaScript
 * Handles discography page specific functionality: album embeds with loading spinners
 */

import { hideIframeSpinner } from './utils.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
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

