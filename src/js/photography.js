/**
 * Photography Gallery JavaScript Entry Point
 * Imports LESS styles and initializes transversal functionality and lightbox
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';
import { initializePerformanceOptimizations, initializeSmoothScrolling, initializeHeaderScrollEffect, initializeScrollToTop, initializePageLoadingSpinner } from './core.js';
import { preventImageDragAndRightClick } from './utils.js';
import { setModalOpen, removeModalOpen } from './modals.js';

// Initialize transversal functionality on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Mark body as loaded to show content after CSS is ready
  document.body.classList.add('loaded');
  
  // Performance and browser detection
  initializePerformanceOptimizations();

  initializeSmoothScrolling();
  initializeHeaderScrollEffect();
  initializeScrollToTop();
  initializePageLoadingSpinner();
  
  // Initialize lightbox
  initializeGalleryLightbox();
  
  // Preload HD images after page is fully loaded
  if (document.readyState === 'complete') {
    preloadHDImages();
  } else {
    window.addEventListener('load', preloadHDImages);
  }
});

// Animation duration in milliseconds
const SWIPE_ANIMATION_DURATION = 200;

let currentPhotoIndex = 0;
let allPhotos = [];
let touchStartX = null;
let touchStartY = null;
let touchEndX = null;
let touchEndY = null;
const preloadedImages = new Set(); // Track preloaded image URLs

/**
 * Initialize the gallery lightbox functionality
 */
function initializeGalleryLightbox() {
  const photoItems = document.querySelectorAll('.photo-item');
  const modal = document.getElementById('image-modal');
  const modalImg = modal?.querySelector('.image-modal-img');

  if (!modal || !modalImg) {
    console.warn('Lightbox: Modal or modal image not found');
    return;
  }

  if (photoItems.length === 0) {
    console.warn('Lightbox: No photo items found');
    return;
  }

  // Store all photos in array for navigation
  // Use HD version for lightbox if available, otherwise use gallery image
  allPhotos = Array.from(photoItems)
    .map((item) => {
      const img = item.querySelector('img');
      const hdSrc = item.getAttribute('data-hd-src');
      return {
        src: hdSrc || img?.getAttribute('src'), // Use HD version for lightbox, fallback to gallery image
        alt: img?.getAttribute('alt'),
      };
    })
    .filter((photo) => photo.src);

  // Add click handlers to all photo items
  photoItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      item.style.cursor = 'pointer';

      item.addEventListener('click', () => {
        openPhotoModal(index);
      });
    }
  });

  // Close modal when clicking backdrop or image
  modal.addEventListener('click', (e) => {
    if (
      e.target === modal ||
      e.target.classList.contains('image-modal-backdrop') ||
      e.target.classList.contains('image-modal-img')
    ) {
      closeImageModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowLeft') {
        navigateToPrevious();
      } else if (e.key === 'ArrowRight') {
        navigateToNext();
      }
    }
  });

  // Touch/swipe navigation
  modal.addEventListener('touchstart', handleTouchStart, { passive: true });
  modal.addEventListener('touchmove', handleTouchMove, { passive: true });
  modal.addEventListener('touchend', handleTouchEnd, { passive: true });
}

/**
 * Open photo modal at specific index
 */
function openPhotoModal(index) {
  const modal = document.getElementById('image-modal');
  const modalContent = modal?.querySelector('.image-modal-content');
  const modalImg = modal?.querySelector('.image-modal-img');

  if (!modal || !modalContent || !modalImg || !allPhotos[index]) return;

  currentPhotoIndex = index;
  const photo = allPhotos[index];

  // Show spinner
  modalContent.classList.remove('image-loaded');

  // Set image source and alt
  modalImg.setAttribute('src', photo.src);
  modalImg.setAttribute('alt', photo.alt);
  
  // Hide spinner when image is loaded
  if (modalImg.complete) {
    // Image already loaded (from cache)
    modalContent.classList.add('image-loaded');
  } else {
    // Wait for image to load
    modalImg.addEventListener('load', () => {
      modalContent.classList.add('image-loaded');
    }, { once: true });

    // Fallback: hide spinner after timeout
    setTimeout(() => {
      modalContent.classList.add('image-loaded');
    }, 5000);
  }
  
  // Apply touch-aware image protection (selectstart only prevented for mouse events, not touch)
  preventImageDragAndRightClick(modalImg, () => !touchStartX && !touchEndX);

  // Show modal - backdrop will animate automatically
  modal.classList.add('active');
  setModalOpen();
}

/**
 * Preload HD images for faster lightbox display
 * Preloads images progressively to avoid overwhelming the network
 */
function preloadHDImages() {
  const photoItems = document.querySelectorAll('.photo-item');
  if (photoItems.length === 0) return;

  // Collect all HD image sources
  const hdImages = Array.from(photoItems)
    .map((item) => {
      const hdSrc = item.getAttribute('data-hd-src');
      const gallerySrc = item.querySelector('img')?.getAttribute('src');
      // Only preload if HD version exists and is different from gallery image
      return hdSrc && hdSrc !== gallerySrc ? hdSrc : null;
    })
    .filter(Boolean);

  if (hdImages.length === 0) return;

  // Preload images progressively (a few at a time to avoid network congestion)
  const BATCH_SIZE = 3;
  const DELAY_BETWEEN_BATCHES = 100; // ms

  let currentIndex = 0;

  function preloadBatch() {
    const batch = hdImages.slice(currentIndex, currentIndex + BATCH_SIZE);
    
    batch.forEach((src) => {
      // Skip if already preloaded
      if (preloadedImages.has(src)) return;

      // Create Image object to preload and cache the image
      const img = new Image();
      
      img.onload = () => {
        // Mark as preloaded once loaded
        preloadedImages.add(src);
      };
      
      img.onerror = () => {
        // Silently handle errors
      };
      
      // Set src to trigger loading (browser will cache it)
      img.src = src;
    });

    currentIndex += BATCH_SIZE;

    // Continue with next batch if there are more images
    if (currentIndex < hdImages.length) {
      setTimeout(preloadBatch, DELAY_BETWEEN_BATCHES);
    }
  }

  // Start preloading after a short delay to ensure page is fully interactive
  setTimeout(preloadBatch, 500);
}

/**
 * Navigate to previous photo
 */
function navigateToPrevious() {
  const modal = document.getElementById('image-modal');
  const modalImg = modal?.querySelector('.image-modal-img');

  if (!modalImg) return;

  // Prevent multiple navigations during animation
  if (
    modalImg.classList.contains('slide-out-left') ||
    modalImg.classList.contains('slide-out-right')
  ) {
    return;
  }

  // Animate slide out
  modalImg.classList.add('slide-out-right');

  // Wait for animation to complete, then change image
  setTimeout(() => {
    const modalContent = modal?.querySelector('.image-modal-content');
    
    // Show spinner
    if (modalContent) {
      modalContent.classList.remove('image-loaded');
    }

    modalImg.classList.remove('slide-out-right');
    currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
    const photo = allPhotos[currentPhotoIndex];

    // Change image src without removing the modal
    modalImg.setAttribute('src', photo.src);
    modalImg.setAttribute('alt', photo.alt);

    // Reset position for slide in
    modalImg.style.transform = 'translateX(0)';

    // Hide spinner when image is loaded
    if (modalImg.complete) {
      if (modalContent) {
        modalContent.classList.add('image-loaded');
      }
    } else {
      const handleLoad = () => {
        if (modalContent) {
          modalContent.classList.add('image-loaded');
        }
      };
      modalImg.addEventListener('load', handleLoad, { once: true });
      setTimeout(() => {
        if (modalContent) {
          modalContent.classList.add('image-loaded');
        }
      }, 5000);
    }

    // Trigger slide in animation
    requestAnimationFrame(() => {
      modalImg.classList.add('slide-in-left');
      setTimeout(() => {
        modalImg.classList.remove('slide-in-left');
      }, SWIPE_ANIMATION_DURATION);
    });
  }, SWIPE_ANIMATION_DURATION);
}

/**
 * Navigate to next photo
 */
function navigateToNext() {
  const modal = document.getElementById('image-modal');
  const modalImg = modal?.querySelector('.image-modal-img');

  if (!modalImg) return;

  // Prevent multiple navigations during animation
  if (
    modalImg.classList.contains('slide-out-left') ||
    modalImg.classList.contains('slide-out-right')
  ) {
    return;
  }

  // Animate slide out
  modalImg.classList.add('slide-out-left');

  // Wait for animation to complete, then change image
  setTimeout(() => {
    const modalContent = modal?.querySelector('.image-modal-content');
    
    // Show spinner
    if (modalContent) {
      modalContent.classList.remove('image-loaded');
    }

    modalImg.classList.remove('slide-out-left');
    currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
    const photo = allPhotos[currentPhotoIndex];

    // Change image src without removing the modal
    modalImg.setAttribute('src', photo.src);
    modalImg.setAttribute('alt', photo.alt);

    // Reset position for slide in
    modalImg.style.transform = 'translateX(0)';

    // Hide spinner when image is loaded
    if (modalImg.complete) {
      if (modalContent) {
        modalContent.classList.add('image-loaded');
      }
    } else {
      const handleLoad = () => {
        if (modalContent) {
          modalContent.classList.add('image-loaded');
        }
      };
      modalImg.addEventListener('load', handleLoad, { once: true });
      setTimeout(() => {
        if (modalContent) {
          modalContent.classList.add('image-loaded');
        }
      }, 5000);
    }

    // Trigger slide in animation
    requestAnimationFrame(() => {
      modalImg.classList.add('slide-in-right');
      setTimeout(() => {
        modalImg.classList.remove('slide-in-right');
      }, SWIPE_ANIMATION_DURATION);
    });
  }, SWIPE_ANIMATION_DURATION);
}

/**
 * Close the image modal
 */
function closeImageModal() {
  const modal = document.getElementById('image-modal');
  if (!modal) return;

  const modalContent = modal.querySelector('.image-modal-content');
  
  // Hide spinner when closing modal
  if (modalContent) {
    modalContent.classList.add('image-loaded');
  }

  modal.classList.remove('active');
  removeModalOpen();
}

/**
 * Handle touch start event
 */
function handleTouchStart(e) {
  const modal = document.getElementById('image-modal');
  if (!modal?.classList.contains('active')) return;

  // Get the first touch point
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

/**
 * Handle touch move event
 */
function handleTouchMove(e) {
  if (touchStartX === null || touchStartY === null) return;

  // Get current touch position
  const touch = e.touches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;
}

/**
 * Handle touch end event and detect swipe gesture
 */
function handleTouchEnd(e) {
  if (touchStartX === null || touchStartY === null || touchEndX === null || touchEndY === null) {
    return;
  }

  const modal = document.getElementById('image-modal');
  if (!modal?.classList.contains('active')) return;

  // Calculate swipe distance
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Minimum swipe distance (in pixels) to trigger navigation
  const minSwipeDistance = 50;

  // Check if it's a horizontal swipe (more horizontal than vertical)
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Swipe left (negative deltaX) = next photo
    if (deltaX < -minSwipeDistance) {
      navigateToNext();
    }
    // Swipe right (positive deltaX) = previous photo
    else if (deltaX > minSwipeDistance) {
      navigateToPrevious();
    }
  }

  // Reset touch coordinates
  touchStartX = null;
  touchStartY = null;
  touchEndX = null;
  touchEndY = null;
}

