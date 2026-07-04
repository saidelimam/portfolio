/**
 * Core transversal functionality
 * Exports initialization functions for header, scroll-to-top, smooth scrolling, performance optimizations
 * This is imported by page-specific scripts as needed
 */

import { debounce, isInstagramBrowser, detectLowPerformanceDevice, createScrollHandler, initializeGlobalImageProtection } from './utils.js';

/**
 * Initialize performance optimizations
 * Disables animations for Opera browsers, in-app browsers, and low-performance devices
 * Also initializes global image protection
 */
export function initializePerformanceOptimizations() {
  const userAgent = navigator.userAgent || '';
  
  // Detect Opera browser
  const isOpera =
    (!!window.opr && !!opr.addons) || !!window.opera || userAgent.indexOf(' OPR/') >= 0;

  // Detect low-performance devices
  const isLowPerformance = detectLowPerformanceDevice();

  // Apply performance optimizations
  if (isOpera || isLowPerformance) {
    document.body.classList.add('opera-no-animations');
    if (isLowPerformance) {
      document.body.classList.add('low-performance');
    }

    // Disable smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto';
  }

  // Initialize global image protection (right-click and drag prevention for all images)
  initializeGlobalImageProtection();
}

/**
 * Initialize smooth scrolling for navigation links
 */
export function initializeSmoothScrolling() {
  const navigationLinks = document.querySelectorAll('a[href^="#"]');

  navigationLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Update URL without triggering scroll
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Initialize header scroll effect
 * The dark theme keeps a single light logo and lets CSS handle nav link
 * colors, so we only toggle the `scrolled` class for the glass intensity.
 * Also wires up the responsive mobile navigation.
 */
export function initializeHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;

  let isScrolled = false;

  const updateScrolled = () => {
    const shouldBeScrolled = window.scrollY > 80;
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      header.classList.toggle('scrolled', shouldBeScrolled);
    }
  };

  if (isInstagramBrowser()) {
    // Simplified, debounced handling to reduce flicker in the in-app browser
    window.addEventListener('scroll', debounce(updateScrolled, 100), { passive: true });
  } else {
    window.addEventListener('scroll', createScrollHandler(updateScrolled), { passive: true });
  }

  updateScrolled();
  initializeMobileNav();
}

/**
 * Initialize the responsive mobile navigation (hamburger toggle).
 * Toggles `nav-open` on the header and keeps ARIA state in sync.
 */
export function initializeMobileNav() {
  const header = document.querySelector('header');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!header || !toggle) return;

  const setOpen = (open) => {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!header.classList.contains('nav-open'));
  });

  // Close after choosing a destination
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (header.classList.contains('nav-open') && !header.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) {
      setOpen(false);
    }
  });
}

/**
 * Add scroll-to-top functionality
 */
export function initializeScrollToTop() {
  // Create scroll-to-top button
  const scrollToTopButton = document.createElement('button');
  // Build the chevron as an inline SVG that references the sprite symbol
  // (#i-chevron-up). Using the DOM API (not innerHTML) keeps this injection safe.
  const svgNS = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(svgNS, 'svg');
  icon.setAttribute('class', 'icon');
  icon.setAttribute('aria-hidden', 'true');
  const iconUse = document.createElementNS(svgNS, 'use');
  iconUse.setAttribute('href', '#i-chevron-up');
  icon.appendChild(iconUse);
  scrollToTopButton.appendChild(icon);
  scrollToTopButton.className = 'scroll-to-top';
  scrollToTopButton.setAttribute('aria-label', 'Scroll to top');

  document.body.appendChild(scrollToTopButton);

  // Show/hide button based on scroll position
  const scrollHandler = createScrollHandler(() => {
    if (window.scrollY > 50) {
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }
  });
  
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Scroll to top functionality
  scrollToTopButton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/**
 * Initialize page loading spinner for internal navigation
 * Shows spinner when clicking internal links and hides it when page loads
 */
export function initializePageLoadingSpinner() {
  const spinner = document.getElementById('page-loading-spinner');
  
  if (!spinner) return;

  // Store timeout reference to clear it if needed
  let timeoutId = null;

  // Function to show spinner
  function showSpinner() {
    spinner.classList.add('active');
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Set timeout to hide spinner after 5 seconds if page hasn't loaded yet
    timeoutId = setTimeout(() => {
      hideSpinner();
      timeoutId = null;
    }, 5000);
  }

  // Function to hide spinner
  function hideSpinner() {
    spinner.classList.remove('active');
    
    // Clear timeout if spinner is hidden before timeout expires
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  // Check if a link is internal (same origin and not external)
  function isInternalLink(link) {
    // Skip if link has target="_blank" (external link)
    if (link.target === '_blank') {
      return false;
    }

    // Skip anchor links (hash links)
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) {
      return false;
    }

    // Check if link is same origin
    try {
      const url = new URL(href, window.location.origin);
      return url.origin === window.location.origin;
    } catch (e) {
      // If URL parsing fails, check if it's a relative path
      return href.startsWith('/') || !href.startsWith('http');
    }
  }

  // Handle clicks on internal links
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    
    if (!link) return;
    
    // Only handle internal links
    if (!isInternalLink(link)) return;

    // Show spinner when internal link is clicked
    showSpinner();
  }, true); // Use capture phase to catch clicks early

  // Hide spinner immediately on initialization (in case page was restored from cache)
  hideSpinner();

  // Handle clicks on spinner backdrop to hide spinner
  const backdrop = spinner.querySelector('.page-loading-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', hideSpinner);
  }

  // Hide spinner when navigating backwards/forwards using browser navigation
  window.addEventListener('popstate', hideSpinner);

  // Handle pageshow event (fires when page is loaded, including from bfcache)
  // This is crucial for handling browser back/forward cache
  window.addEventListener('pageshow', function (e) {
    // If page was restored from cache (bfcache), hide spinner immediately
    if (e.persisted) {
      hideSpinner();
    }
  });

  // Hide spinner when page finishes loading
  if (document.readyState === 'complete') {
    // Page already loaded
    hideSpinner();
  } else {
    // Wait for page to load
    window.addEventListener('load', hideSpinner);
    // Also hide on DOMContentLoaded as fallback
    document.addEventListener('DOMContentLoaded', hideSpinner);
  }
}

