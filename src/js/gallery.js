/**
 * Gallery Lightbox functionality
 * Opens images in a full-screen modal when clicked
 */

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

  // Add click handlers to all photo items
  photoItems.forEach((item) => {
    const img = item.querySelector('img');
    if (img) {
      item.style.cursor = 'pointer';
      
      item.addEventListener('click', () => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        
        // Set image source and alt
        modalImg.setAttribute('src', src);
        modalImg.setAttribute('alt', alt);
        
        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
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

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeImageModal();
    }
  });
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

