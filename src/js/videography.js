/**
 * Videography Gallery functionality
 * Loads YouTube videos when clicking on cover images
 */

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
    
    if (!cover || !playButton) return;
    
    // Add click handler to cover and play button
    const handleClick = () => {
      loadVideo(item);
    };
    
    cover.addEventListener('click', handleClick);
    playButton.addEventListener('click', handleClick);
  });
}

/**
 * Load YouTube video embed
 */
function loadVideo(videoItem) {
  const videoId = videoItem.getAttribute('data-video-id');
  const cover = videoItem.querySelector('.video-cover');
  const playButton = videoItem.querySelector('.play-button');
  
  if (!videoId || !cover || !playButton) return;
  
  // Hide cover and play button
  cover.style.display = 'none';
  playButton.style.display = 'none';
  
  // Create iframe for YouTube embed
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('frameborder', '0');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  
  // Append iframe to video item
  videoItem.appendChild(iframe);
}

