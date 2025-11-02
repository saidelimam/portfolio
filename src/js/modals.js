/**
 * Modal utilities
 * Shared functionality for all modals (project modals, lightbox, etc.)
 */

import { pauseAllMedia, hideIframeSpinner } from './utils.js';

// Animation constants
const SWIPE_ANIMATION_DURATION = 300;
const SWIPE_SNAP_BACK_DURATION = 300;
const SWIPE_CLOSE_THRESHOLD = 100;
const SWIPE_MAX_DRAG = 150;

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
 * Reset modal inline styles to ensure clean state for animations
 * @param {HTMLElement} modal - The modal element
 * @param {HTMLElement} modalContent - The modal content element
 */
export function resetModalStyles(modal, modalContent) {
  if (modal) {
    modal.style.transition = '';
    modal.style.opacity = '';
    modal.style.visibility = '';
    modal.style.backgroundColor = '';
    modal.style.backdropFilter = '';
    modal.style.webkitBackdropFilter = '';
  }
  if (modalContent) {
    modalContent.style.transition = '';
    modalContent.style.transform = '';
  }
}

/**
 * Close a modal by removing active class and clearing state
 * @param {string} modalId - The ID of the modal to close
 * @param {HTMLElement} [contentElement] - Optional content element to pause media in
 * @param {string} [closeMethod='button'] - How the modal was closed: 'swipe' for swipe-down, 'button' for button/click outside
 */
export function closeModal(modalId, contentElement = null, closeMethod = 'button') {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Get modal content element
  const modalContent = contentElement || modal.querySelector('.modal-content') || document.getElementById('modal-content');

  // Pause all media if content element is provided
  if (modalContent) {
    pauseAllMedia(modalContent);
  }

  if (closeMethod === 'swipe') {
    // Swipe-down animation: already handled by initializeModalTouchSwipe
    // Just ensure the modal is properly closed
    modal.classList.remove('active');
    removeModalOpen();
  } else {
    // Button/click outside: zoom-out fade animation
    // Reset styles to ensure CSS transitions work properly
    resetModalStyles(modal, modalContent);
    
    // Trigger the CSS zoom-out fade animation
    modal.classList.remove('active');
    removeModalOpen();
  }
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

/**
 * Initialize touch swipe-down to close modal on mobile
 * Only works when modal content is scrolled to the top
 * @param {string} modalId - The ID of the modal
 * @param {Function} closeCallback - Callback function to call when closing
 */
export function initializeModalTouchSwipe(modalId, closeCallback) {
  const modal = document.getElementById(modalId);
  const modalContent = document.getElementById('modal-content');
  
  if (!modal || !modalContent) return;
  
  let touchStartY = 0;
  let touchCurrentY = 0;
  let isDragging = false;
  let scrollAtTop = false;
  
  // Check if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return;
  
  /**
   * Reset touch state
   */
  function resetTouchState() {
    touchStartY = 0;
    touchCurrentY = 0;
  }
  
  /**
   * Snap modal back to original position
   */
  function snapBack() {
    modalContent.style.transition = 'transform 0.3s ease-out';
    modalContent.style.transform = '';
    modal.style.transition = 'background-color 0.3s ease-out';
    modal.style.backgroundColor = '';
    
    setTimeout(() => {
      modalContent.style.transition = '';
      modal.style.transition = '';
    }, SWIPE_SNAP_BACK_DURATION);
  }
  
  /**
   * Animate modal close with slide-down
   */
  function animateClose(deltaY) {
    modalContent.style.transition = 'transform 0.3s ease-out';
    modalContent.style.transform = `scale(1) translateY(100vh)`;
    modal.style.transition = 'background-color 0.3s ease-out, backdrop-filter 0.3s ease-out, -webkit-backdrop-filter 0.3s ease-out, opacity 0.3s ease-out';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    modal.style.backdropFilter = 'blur(0px)';
    modal.style.webkitBackdropFilter = 'blur(0px)';
    modal.style.opacity = '0';
    
    setTimeout(() => {
      const modalElement = document.getElementById(modalId);
      
      // Disable transitions before final state changes
      modalElement.style.transition = 'none';
      modalContent.style.transition = 'none';
      modalElement.style.visibility = 'hidden';
      modalContent.style.transform = 'scale(0.8) translateY(100vh)';
      
      // Close modal
      closeModal(modalId, modalContent, 'swipe');
      
      // Reset styles for next opening
      requestAnimationFrame(() => {
        modalContent.style.transform = '';
        modal.style.backgroundColor = '';
        modal.style.backdropFilter = '';
        modal.style.webkitBackdropFilter = '';
        
        setTimeout(() => {
          resetModalStyles(modalElement, modalContent);
        }, 50);
      });
      
      closeCallback('swipe');
    }, SWIPE_ANIMATION_DURATION);
  }
  
  // Touch start - only allow if scrolled to top
  modalContent.addEventListener('touchstart', function(e) {
    scrollAtTop = modalContent.scrollTop === 0;
    
    if (scrollAtTop && e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      isDragging = true;
      modalContent.style.transition = 'none';
    }
  }, { passive: true });
  
  // Touch move - drag modal down
  modalContent.addEventListener('touchmove', function(e) {
    if (!isDragging || !scrollAtTop) return;
    
    touchCurrentY = e.touches[0].clientY;
    const deltaY = touchCurrentY - touchStartY;
    
    if (deltaY > 0) {
      modalContent.style.transform = `scale(1) translateY(${deltaY}px)`;
      
      const opacity = Math.max(0, 1 - (deltaY / SWIPE_MAX_DRAG));
      modal.style.backgroundColor = `rgba(0, 0, 0, ${0.8 * opacity})`;
      
      e.preventDefault();
    }
  }, { passive: false });
  
  // Touch end - close if dragged far enough, otherwise snap back
  modalContent.addEventListener('touchend', function() {
    if (!isDragging) return;
    
    isDragging = false;
    const deltaY = touchCurrentY - touchStartY;
    
    if (deltaY > SWIPE_CLOSE_THRESHOLD) {
      animateClose(deltaY);
    } else {
      snapBack();
    }
    
    resetTouchState();
  }, { passive: true });
  
  // Reset if touch is cancelled
  modalContent.addEventListener('touchcancel', function() {
    if (isDragging) {
      isDragging = false;
      snapBack();
      resetTouchState();
    }
  }, { passive: true });
}

