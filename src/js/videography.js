/**
 * Videography Gallery functionality
 * Loads YouTube videos when clicking on cover images
 */

let currentPlayingVideo = null;

document.addEventListener('DOMContentLoaded', () => {
  initializeVideoGallery();
});

/**
 * Initialize the video gallery
 */
function initializeVideoGallery() {
  const videoItems = document.querySelectorAll('.video-item');

  videoItems.forEach((item) => {
    const cover = item.querySelector('.video-cover');
    const playButton = item.querySelector('.play-button');
    const coverImg = cover?.querySelector('img');

    if (!cover || !playButton) return;

    // Add click handler to cover and play button
    const handleClick = () => {
      loadVideo(item);
    };

    cover.addEventListener('click', handleClick);
    playButton.addEventListener('click', handleClick);

    // Prevent dragging and right-click on cover images (only for mouse events, not touch)
    if (coverImg) {
      coverImg.setAttribute('draggable', 'false');
      
      // Remove old listeners if they exist to avoid duplicates
      if (coverImg._dragStartHandler) {
        coverImg.removeEventListener('dragstart', coverImg._dragStartHandler);
      }
      if (coverImg._contextMenuHandler) {
        coverImg.removeEventListener('contextmenu', coverImg._contextMenuHandler);
      }
      if (coverImg._selectStartHandler) {
        coverImg.removeEventListener('selectstart', coverImg._selectStartHandler);
      }
      
      // Create new handlers (contextmenu and dragstart are mouse-only, so safe to prevent)
      coverImg._dragStartHandler = (e) => e.preventDefault();
      coverImg._contextMenuHandler = (e) => e.preventDefault();
      // selectstart might interfere with touch, but since we're only on images and touch uses separate events, it should be safe
      coverImg._selectStartHandler = (e) => e.preventDefault();
      
      coverImg.addEventListener('dragstart', coverImg._dragStartHandler, { passive: false });
      coverImg.addEventListener('contextmenu', coverImg._contextMenuHandler, { passive: false });
      coverImg.addEventListener('selectstart', coverImg._selectStartHandler, { passive: false });
    }
  });
}

/**
 * Reset video to cover state
 */
function resetVideoToCover(videoItem) {
  const cover = videoItem.querySelector('.video-cover');
  const playButton = videoItem.querySelector('.play-button');
  const iframe = videoItem.querySelector('iframe');

  if (iframe) {
    // Pause the video by removing the iframe
    iframe.remove();
  }

  // Show cover and play button
  if (cover) cover.style.display = '';
  if (playButton) playButton.style.display = '';
}

/**
 * Load YouTube video embed
 */
function loadVideo(videoItem) {
  const videoId = videoItem.getAttribute('data-video-id');
  const cover = videoItem.querySelector('.video-cover');
  const playButton = videoItem.querySelector('.play-button');

  if (!videoId || !cover || !playButton) return;

  // If this video is already playing, do nothing
  if (currentPlayingVideo === videoItem) return;

  // Reset the previously playing video
  if (currentPlayingVideo) {
    resetVideoToCover(currentPlayingVideo);
  }

  // Set as current playing video
  currentPlayingVideo = videoItem;

  // Hide cover and play button
  cover.style.display = 'none';
  playButton.style.display = 'none';

  // Create loading spinner
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'iframe-loading';
  loadingSpinner.innerHTML = '<div class="loading-spinner"></div>';
  videoItem.appendChild(loadingSpinner);

  // Create iframe for YouTube embed
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  );
  iframe.setAttribute('frameborder', '0');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';

  // Append iframe to video item
  videoItem.appendChild(iframe);

  // Hide spinner when iframe loads
  iframe.addEventListener('load', () => {
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
  });

  // Fallback: hide spinner after 5 seconds if iframe doesn't load
  setTimeout(() => {
    if (loadingSpinner && loadingSpinner.parentElement) {
      loadingSpinner.style.display = 'none';
    }
  }, 5000);
}
