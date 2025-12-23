/**
 * Videography Gallery JavaScript Entry Point
 * Imports LESS styles and initializes transversal functionality and video gallery
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';
import { initializePerformanceOptimizations, initializeSmoothScrolling, initializeHeaderScrollEffect, initializeScrollToTop, initializePageLoadingSpinner } from './core.js';
import { hideIframeSpinner } from './utils.js';

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
  initializePageLoadingSpinner();
  
  // Initialize video gallery
  initializeVideoGallery();
  
  // Initialize video filters
  initializeVideoFilters();
  
  // Initialize filter section toggle
  initializeFilterSectionToggle();
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
 * Get URL parameter value
 * @param {string} name - Parameter name
 * @returns {string|null} - Parameter value or null
 */
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Apply project filter from URL parameter
 * @param {Set<string>} activeProjectFilters - Set of active project filters
 * @param {NodeList} filterButtons - All filter buttons
 * @returns {Set<string>} - Updated set of active project filters
 */
function applyProjectFilterFromURL(activeProjectFilters, filterButtons) {
  const projectParam = getURLParameter('project');
  
  if (projectParam) {
    // Find matching project filter button (case-insensitive)
    const projectButtons = Array.from(filterButtons).filter(
      (button) => button.getAttribute('data-filter') === 'project'
    );
    
    const matchingButton = projectButtons.find((button) => {
      const buttonValue = button.getAttribute('data-value');
      return buttonValue && buttonValue.toLowerCase() === projectParam.toLowerCase();
    });
    
    if (matchingButton) {
      const projectValue = matchingButton.getAttribute('data-value');
      activeProjectFilters.add(projectValue);
      matchingButton.setAttribute('aria-pressed', 'true');
      matchingButton.classList.add('active');
    }
  }
  
  return activeProjectFilters;
}

/**
 * Initialize video type and project filters
 */
function initializeVideoFilters() {
  const filterButtons = document.querySelectorAll('.video-filter-btn');
  const videoTypeSections = document.querySelectorAll('.video-type-section');
  const videoItems = document.querySelectorAll('.video-item');

  if (filterButtons.length === 0 || videoTypeSections.length === 0) return;

  // Track active filters for both type and project
  const activeTypeFilters = new Set();
  const activeProjectFilters = new Set();

  // Apply project filter from URL parameter on page load
  applyProjectFilterFromURL(activeProjectFilters, filterButtons);

  // Apply initial filters if URL parameter was set
  if (activeProjectFilters.size > 0) {
    applyVideoFilters(activeTypeFilters, activeProjectFilters, videoTypeSections, videoItems);
  }

  // Add click handler to each filter button
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filterType = button.getAttribute('data-filter') || 'type';
      const type = button.getAttribute('data-type');
      const project = button.getAttribute('data-value');
      const isPressed = button.getAttribute('aria-pressed') === 'true';

      // Stop any currently playing video when filters change
      if (currentPlayingVideo) {
        resetVideoToCover(currentPlayingVideo);
        currentPlayingVideo = null;
      }

      // Toggle filter based on filter type
      if (filterType === 'project') {
        if (isPressed) {
          // Deselect project filter
          activeProjectFilters.delete(project);
          button.setAttribute('aria-pressed', 'false');
          button.classList.remove('active');
        } else {
          // Select project filter
          activeProjectFilters.add(project);
          button.setAttribute('aria-pressed', 'true');
          button.classList.add('active');
        }
      } else {
        // Type filter (legacy support)
        if (isPressed) {
          // Deselect type filter
          activeTypeFilters.delete(type);
          button.setAttribute('aria-pressed', 'false');
          button.classList.remove('active');
        } else {
          // Select type filter
          activeTypeFilters.add(type);
          button.setAttribute('aria-pressed', 'true');
          button.classList.add('active');
        }
      }

      // Apply filters
      applyVideoFilters(activeTypeFilters, activeProjectFilters, videoTypeSections, videoItems);
    });
  });

  // Clear filters button
  const clearFiltersBtn = document.querySelector('.clear-filters-btn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      // Stop any currently playing video
      if (currentPlayingVideo) {
        resetVideoToCover(currentPlayingVideo);
        currentPlayingVideo = null;
      }

      // Clear all active filters
      activeTypeFilters.clear();
      activeProjectFilters.clear();

      // Reset all filter buttons
      filterButtons.forEach((button) => {
        button.setAttribute('aria-pressed', 'false');
        button.classList.remove('active');
      });

      // Apply filters (which will show all videos)
      applyVideoFilters(activeTypeFilters, activeProjectFilters, videoTypeSections, videoItems);
    });
  }
}

/**
 * Initialize filter section expand/collapse functionality
 */
function initializeFilterSectionToggle() {
  const filterHeader = document.querySelector('.filter-section-header');
  const filterContent = document.getElementById('filter-content');

  if (!filterHeader || !filterContent) return;

  filterHeader.addEventListener('click', () => {
    const isExpanded = filterHeader.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      // Collapse
      filterHeader.setAttribute('aria-expanded', 'false');
      filterContent.setAttribute('aria-hidden', 'true');
    } else {
      // Expand
      filterHeader.setAttribute('aria-expanded', 'true');
      filterContent.setAttribute('aria-hidden', 'false');
    }
  });
}

/**
 * Apply video type and project filters to show/hide sections and items
 * @param {Set<string>} activeTypeFilters - Set of active filter types
 * @param {Set<string>} activeProjectFilters - Set of active project filters
 * @param {NodeList} videoTypeSections - All video type sections
 * @param {NodeList} videoItems - All video items
 */
function applyVideoFilters(activeTypeFilters, activeProjectFilters, videoTypeSections, videoItems) {
  const hasTypeFilters = activeTypeFilters.size > 0;
  const hasProjectFilters = activeProjectFilters.size > 0;

  // Apply type filters to sections
  videoTypeSections.forEach((section) => {
    if (!hasTypeFilters) {
      // No type filters active: show section
      section.style.display = '';
    } else {
      // Type filters active: show only matching sections
      const sectionType = section.getAttribute('data-type');
      if (activeTypeFilters.has(sectionType)) {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    }
  });

  // Apply project filters to individual video items
  // This works in combination with type filters (AND logic)
  videoItems.forEach((item) => {
    if (!hasProjectFilters) {
      // No project filters active: show item (if its section is visible)
      item.style.display = '';
    } else {
      // Project filters active: show only matching items
      const itemProject = item.getAttribute('data-project');
      if (itemProject && activeProjectFilters.has(itemProject)) {
        item.style.display = '';
      } else {
        // Hide item if it doesn't match project filter
        item.style.display = 'none';
      }
    }
  });
}
