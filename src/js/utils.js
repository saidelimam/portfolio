/**
 * Utilities for sanitization and security
 * Re-exports from shared utils file
 */

export { sanitizeHTML, sanitizeURL, sanitizeEmbed } from '../../utils/sanitize.js';
export { getProjectTypeIcon } from '../../utils/project-icons.js';

/**
 * Prevents dragging and right-clicking on an image element
 * @param {HTMLImageElement} imgElement - The image element to secure
 * @param {Function} [selectStartCheck] - Optional function to check if selectstart should be prevented (returns boolean)
 */
export function preventImageDragAndRightClick(imgElement, selectStartCheck = null) {
  if (!imgElement || imgElement.tagName !== 'IMG') {
    return;
  }

  // Allow re-protection if a different selectStartCheck is provided (for special cases like photography modal)
  const needsReprotection = imgElement._imageProtected && 
    imgElement._selectStartCheck !== selectStartCheck;
  
  // Skip if already protected with same parameters (to avoid duplicate handlers)
  if (imgElement._imageProtected && !needsReprotection) {
    return;
  }

  // Set draggable to false
  imgElement.setAttribute('draggable', 'false');

  // Remove old listeners if they exist to avoid duplicates
  if (imgElement._dragStartHandler) {
    imgElement.removeEventListener('dragstart', imgElement._dragStartHandler);
  }
  if (imgElement._contextMenuHandler) {
    imgElement.removeEventListener('contextmenu', imgElement._contextMenuHandler);
  }
  if (imgElement._selectStartHandler) {
    imgElement.removeEventListener('selectstart', imgElement._selectStartHandler);
  }

  // Create new handlers (contextmenu and dragstart are mouse-only, so safe to prevent)
  imgElement._dragStartHandler = (e) => e.preventDefault();
  imgElement._contextMenuHandler = (e) => e.preventDefault();
  
  // selectstart might interfere with touch, so use optional check
  imgElement._selectStartHandler = (e) => {
    if (selectStartCheck && typeof selectStartCheck === 'function') {
      if (selectStartCheck()) {
        e.preventDefault();
      }
    } else {
      // Default: always prevent if no check function provided
      e.preventDefault();
    }
  };

  // Add event listeners
  imgElement.addEventListener('dragstart', imgElement._dragStartHandler, { passive: false });
  imgElement.addEventListener('contextmenu', imgElement._contextMenuHandler, { passive: false });
  imgElement.addEventListener('selectstart', imgElement._selectStartHandler, { passive: false });

  // Mark as protected and store the selectStartCheck function for comparison
  imgElement._imageProtected = true;
  imgElement._selectStartCheck = selectStartCheck;
}

/**
 * Initialize global image protection for all images on the page
 * Protects all existing images and watches for dynamically added images
 */
export function initializeGlobalImageProtection() {
  // Protect all existing images
  const allImages = document.querySelectorAll('img');
  allImages.forEach((img) => {
    preventImageDragAndRightClick(img);
  });

  // Watch for dynamically added images using MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // If the added node is an image, protect it
        if (node.nodeType === 1 && node.tagName === 'IMG') {
          preventImageDragAndRightClick(node);
        }
        // If the added node contains images, protect them
        if (node.nodeType === 1 && node.querySelectorAll) {
          const images = node.querySelectorAll('img');
          images.forEach((img) => {
            preventImageDragAndRightClick(img);
          });
        }
      });
    });
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} The debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Detect Instagram/Facebook in-app browser
 * @returns {boolean} True if Instagram browser is detected
 */
export function isInstagramBrowser() {
  const userAgent = navigator.userAgent || '';
  return (
    userAgent.indexOf('Instagram') >= 0 || 
    userAgent.indexOf('FBAN') >= 0 || 
    userAgent.indexOf('FBAV') >= 0 ||
    (userAgent.indexOf('Android') >= 0 && userAgent.indexOf('Version/') >= 0 && userAgent.indexOf('Chrome') < 0)
  );
}

/**
 * Detect low-performance devices based on hardware specs
 * @returns {boolean} True if device is considered low-performance
 */
export function detectLowPerformanceDevice() {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // Check device memory (if available)
  const memory = navigator.deviceMemory || 4;

  // Check connection speed (if available)
  const connection = navigator.connection;
  const slowConnection =
    connection &&
    (connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData === true);

  // Consider device low-performance if:
  // - Less than 4 CPU cores
  // - Less than 4GB RAM
  // - Slow connection
  return cores < 4 || memory < 4 || slowConnection;
}

/**
 * Creates an optimized scroll event handler using requestAnimationFrame
 * @param {Function} callback - The function to call on scroll
 * @returns {Function} A function that can be used to add/remove the scroll listener
 */
export function createScrollHandler(callback) {
  let rafId = null;
  
  const scrollHandler = function() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      callback();
    });
  };
  
  return scrollHandler;
}


/**
 * Hide iframe loading spinner with smooth transition
 * @param {HTMLElement} spinner - The spinner element to hide
 * @param {number} [transitionDelay=300] - Delay in milliseconds before hiding
 */
export function hideIframeSpinner(spinner, transitionDelay = 300) {
  if (!spinner) return;
  
  spinner.style.opacity = '0';
  spinner.style.pointerEvents = 'none';
  setTimeout(() => {
    if (spinner && spinner.parentElement) {
      spinner.style.display = 'none';
    }
  }, transitionDelay);
}

/**
 * Pause all media (videos, audio) and stop iframes in a container
 * @param {HTMLElement} container - The container element to search for media
 */
export function pauseAllMedia(container) {
  if (!container) return;
  
  // Pause videos
  const videos = container.querySelectorAll('video');
  videos.forEach((video) => video.pause());
  
  // Pause audio
  const audios = container.querySelectorAll('audio');
  audios.forEach((audio) => audio.pause());
  
  // Stop iframes by clearing their src
  const iframes = container.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    iframe.src = '';
  });
}
