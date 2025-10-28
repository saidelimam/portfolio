/**
 * Gallery Lightbox functionality
 * Opens images in a full-screen modal when clicked
 */

// Animation duration in milliseconds
const SWIPE_ANIMATION_DURATION = 200;

let currentPhotoIndex = 0;
let allPhotos = [];
let touchStartX = null;
let touchStartY = null;
let touchEndX = null;
let touchEndY = null;

// Initialize gallery lightbox on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initializeGalleryLightbox();
});

/**
 * Initialize the gallery lightbox functionality
 */
function initializeGalleryLightbox() {
  const photoItems = document.querySelectorAll('.photo-item');
  const modal = document.getElementById('image-modal');
  const modalImg = modal?.querySelector('.image-modal-img');

  if (!modal || !modalImg) return;

  // Store all photos in array for navigation
  allPhotos = Array.from(photoItems).map(item => ({
    src: item.querySelector('img')?.getAttribute('src'),
    alt: item.querySelector('img')?.getAttribute('alt')
  })).filter(photo => photo.src);

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
    if (e.target === modal || 
        e.target.classList.contains('image-modal-backdrop') || 
        e.target.classList.contains('image-modal-img')) {
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
  const modalImg = modal?.querySelector('.image-modal-img');
  
  if (!modal || !modalImg || !allPhotos[index]) return;

  currentPhotoIndex = index;
  const photo = allPhotos[index];
  
  // Set image source and alt
  modalImg.setAttribute('src', photo.src);
  modalImg.setAttribute('alt', photo.alt);
  
  // Show modal - backdrop will animate automatically
  modal.classList.add('active');
  document.body.classList.add('modal-open');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

/**
 * Navigate to previous photo
 */
function navigateToPrevious() {
  const modal = document.getElementById('image-modal');
  const modalImg = modal?.querySelector('.image-modal-img');
  
  if (!modalImg) return;
  
  // Prevent multiple navigations during animation
  if (modalImg.classList.contains('slide-out-left') || modalImg.classList.contains('slide-out-right')) {
    return;
  }
  
  // Animate slide out
  modalImg.classList.add('slide-out-right');
  
  // Wait for animation to complete, then change image
  setTimeout(() => {
    modalImg.classList.remove('slide-out-right');
    currentPhotoIndex = (currentPhotoIndex - 1 + allPhotos.length) % allPhotos.length;
    const photo = allPhotos[currentPhotoIndex];
    
    // Change image src without removing the modal
    modalImg.setAttribute('src', photo.src);
    modalImg.setAttribute('alt', photo.alt);
    
    // Reset position for slide in
    modalImg.style.transform = 'translateX(0)';
    
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
  if (modalImg.classList.contains('slide-out-left') || modalImg.classList.contains('slide-out-right')) {
    return;
  }
  
  // Animate slide out
  modalImg.classList.add('slide-out-left');
  
  // Wait for animation to complete, then change image
  setTimeout(() => {
    modalImg.classList.remove('slide-out-left');
    currentPhotoIndex = (currentPhotoIndex + 1) % allPhotos.length;
    const photo = allPhotos[currentPhotoIndex];
    
    // Change image src without removing the modal
    modalImg.setAttribute('src', photo.src);
    modalImg.setAttribute('alt', photo.alt);
    
    // Reset position for slide in
    modalImg.style.transform = 'translateX(0)';
    
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

  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
  
  // Re-enable body scroll
  document.body.style.overflow = '';
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

