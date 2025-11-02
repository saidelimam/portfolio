/**
 * Videography Gallery JavaScript Entry Point
 * Imports LESS styles and initializes transversal functionality and video gallery
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';
import { initializePerformanceOptimizations, initializeSmoothScrolling, initializeHeaderScrollEffect, initializeScrollToTop } from './core.js';
import { preventImageDragAndRightClick, hideIframeSpinner } from './utils.js';

let currentPlayingVideo = null;

// Initialize transversal functionality and video gallery on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Mark body as loaded to show content after CSS is ready
  document.body.classList.add('loaded');
  
  // Performance and browser detection
  initializePerformanceOptimizations();

  initializeSmoothScrolling();
  initializeHeaderScrollEffect();
  initializeScrollToTop();
  
  // Initialize video gallery
  initializeVideoGallery();
  
  // Initialize video filters
  initializeVideoFilters();
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
      preventImageDragAndRightClick(coverImg);
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
  // Create spinner element with loading-spinner class and set aria-hidden to true for accessibility
  // This is a more secure way to add the spinner than using innerHTML
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  loadingSpinner.appendChild(spinner);
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
    hideIframeSpinner(loadingSpinner);
  });

  // Fallback: hide spinner after 5 seconds if iframe doesn't load
  setTimeout(() => {
    hideIframeSpinner(loadingSpinner);
  }, 5000);
}

/**
 * Initialize video type filters
 */
function initializeVideoFilters() {
  const filterButtons = document.querySelectorAll('.video-filter-btn');
  const videoTypeSections = document.querySelectorAll('.video-type-section');

  if (filterButtons.length === 0 || videoTypeSections.length === 0) return;

  // Track active filters
  const activeFilters = new Set();

  // Add click handler to each filter button
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-type');
      const isPressed = button.getAttribute('aria-pressed') === 'true';

      // Stop any currently playing video when filters change
      if (currentPlayingVideo) {
        resetVideoToCover(currentPlayingVideo);
        currentPlayingVideo = null;
      }

      // Toggle filter
      if (isPressed) {
        // Deselect filter
        activeFilters.delete(type);
        button.setAttribute('aria-pressed', 'false');
        button.classList.remove('active');
      } else {
        // Select filter
        activeFilters.add(type);
        button.setAttribute('aria-pressed', 'true');
        button.classList.add('active');
      }

      // Apply filters
      applyVideoFilters(activeFilters, videoTypeSections);
    });
  });
}

/**
 * Apply video type filters to show/hide sections
 * @param {Set<string>} activeFilters - Set of active filter types
 * @param {NodeList} videoTypeSections - All video type sections
 */
function applyVideoFilters(activeFilters, videoTypeSections) {
  if (activeFilters.size === 0) {
    // No filters active: show all sections
    videoTypeSections.forEach((section) => {
      section.style.display = '';
    });
  } else {
    // Filters active: show only matching sections
    videoTypeSections.forEach((section) => {
      const sectionType = section.getAttribute('data-type');
      if (activeFilters.has(sectionType)) {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    });
  }
}
