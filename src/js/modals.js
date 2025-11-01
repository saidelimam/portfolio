/**
 * Modal utilities
 * Shared functionality for all modals (project modals, lightbox, etc.)
 */

import { pauseAllMedia, hideIframeSpinner } from './utils.js';

/**
 * Set modal open state by adding classes to html and body
 */
export function setModalOpen() {
  document.documentElement.classList.add('modal-open');
  document.body.classList.add('modal-open');
}

/**
 * Remove modal open state by removing classes from html and body
 */
export function removeModalOpen() {
  document.documentElement.classList.remove('modal-open');
  document.body.classList.remove('modal-open');
}

/**
 * Close a modal by removing active class and clearing state
 * @param {string} modalId - The ID of the modal to close
 * @param {HTMLElement} [contentElement] - Optional content element to pause media in
 */
export function closeModal(modalId, contentElement = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Pause all media if content element is provided
  if (contentElement) {
    pauseAllMedia(contentElement);
  }

  modal.classList.remove('active');
  removeModalOpen();
}

/**
 * Open a modal by adding active class and setting state
 * @param {string} modalId - The ID of the modal to open
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('active');
  setModalOpen();
}

/**
 * Initialize modal close handlers (click outside, Escape key, close button)
 * @param {string} modalId - The ID of the modal
 * @param {Function} closeCallback - Callback function to call when closing
 * @param {string} [closeButtonSelector] - Selector for close button (default: '.modal-close')
 */
export function initializeModalCloseHandlers(modalId, closeCallback, closeButtonSelector = '.modal-close') {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Close button handler
  const closeButton = modal.querySelector(closeButtonSelector);
  if (closeButton) {
    closeButton.addEventListener('click', closeCallback);
  }

  // Click outside modal to close
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeCallback();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeCallback();
    }
  });
}

/**
 * Initialize browser navigation support for modals
 * Closes modal when browser back button is pressed
 * @param {string} modalId - The ID of the modal
 * @param {Function} closeCallback - Callback function to call when closing
 * @param {HTMLElement} [contentElement] - Optional content element to pause media in
 */
export function initializeModalNavigation(modalId, closeCallback, contentElement = null) {
  window.addEventListener('popstate', function(event) {
    const modal = document.getElementById(modalId);
    
    if (modal && modal.classList.contains('active')) {
      // Pause all media if content element is provided
      if (contentElement) {
        pauseAllMedia(contentElement);
      }
      
      closeCallback();
    }
  });
}

/**
 * Handle iframe loading spinner for a modal
 * @param {HTMLElement} container - Container element that has the iframe and spinner
 */
export function handleModalIframeSpinner(container) {
  const iframe = container.querySelector('iframe');
  const loadingSpinner = container.querySelector('.iframe-loading');

  if (iframe && loadingSpinner) {
    // Hide spinner when iframe loads
    iframe.addEventListener('load', () => {
      hideIframeSpinner(loadingSpinner);
    });

    // Fallback: hide spinner after 5 seconds if iframe doesn't load
    setTimeout(() => {
      hideIframeSpinner(loadingSpinner);
    }, 5000);
  }
}

