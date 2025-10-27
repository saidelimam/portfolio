/**
 * Gallery Lightbox functionality
 * Opens images in a full-screen modal when clicked
 */

let currentPhotoIndex = 0;
let allPhotos = [];

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
      }, 300);
    });
  }, 300);
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
      }, 300);
    });
  }, 300);
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

