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
 */
export function initializeHeaderScrollEffect() {
  const header = document.querySelector('header');
  const logoImg = document.querySelector('.logo img');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!header || !logoImg) return;

  let isScrolled = false;

  // Check if Instagram browser for simplified scroll handling
  const isInstaBrowser = isInstagramBrowser();
  
  if (isInstaBrowser) {
    // Simplified scroll handling for Instagram browser - only update on significant scroll
    let lastScrollY = 0;
    window.addEventListener('scroll', debounce(function () {
      const scrollY = window.scrollY;
      const shouldBeScrolled = scrollY > 100;
      
      // Only update if scroll changed significantly or state changed
      if (Math.abs(scrollY - lastScrollY) > 50 || shouldBeScrolled !== isScrolled) {
        lastScrollY = scrollY;
        isScrolled = shouldBeScrolled;
        
        if (shouldBeScrolled) {
          header.classList.add('scrolled');
          navLinks.forEach((link) => {
            link.style.color = '#333';
          });
          // Skip logo switching on Instagram browser to reduce flicker
        } else {
          header.classList.remove('scrolled');
          navLinks.forEach((link) => {
            link.style.color = '#fff';
          });
          // Skip logo switching on Instagram browser to reduce flicker
        }
      }
    }, 100), { passive: true });
  } else {
    // Normal optimized scroll handling
    const scrollHandler = createScrollHandler(() => {
      const scrollY = window.scrollY;
      const shouldBeScrolled = scrollY > 100;

      // Only update if state changed to avoid unnecessary repaints
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;

        if (shouldBeScrolled) {
          header.classList.add('scrolled');

          // Change to black logo when scrolled
          if (!logoImg.src.includes('logo-black.webp')) {
            logoImg.style.opacity = '0.7';
            setTimeout(() => {
              logoImg.src = '/img/logo-black.webp';
              logoImg.style.opacity = '1';
            }, 150);
          }

          // Change nav links to black when scrolled
          navLinks.forEach((link) => {
            link.style.color = '#333';
          });
        } else {
          header.classList.remove('scrolled');

          // Change to white logo when at top
          if (!logoImg.src.includes('logo-white.webp')) {
            logoImg.style.opacity = '0.7';
            setTimeout(() => {
              logoImg.src = '/img/logo-white.webp';
              logoImg.style.opacity = '1';
            }, 150);
          }

          // Change nav links to white when at top
          navLinks.forEach((link) => {
            link.style.color = '#fff';
          });
        }
      }
    });
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }
}

/**
 * Add scroll-to-top functionality
 */
export function initializeScrollToTop() {
  // Create scroll-to-top button
  const scrollToTopButton = document.createElement('button');
  // Create icon element with Font Awesome chevron up icon and set aria-hidden to true for accessibility
  // This is a more secure way to add the icon than using innerHTML
  const icon = document.createElement('i');
  icon.className = 'fas fa-chevron-up';
  icon.setAttribute('aria-hidden', 'true');
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

