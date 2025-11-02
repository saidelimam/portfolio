/**
 * Core transversal functionality
 * Exports initialization functions for header, scroll-to-top, smooth scrolling, performance optimizations
 * This is imported by page-specific scripts as needed
 */

import { debounce, isInstagramBrowser, detectLowPerformanceDevice, createScrollHandler } from './utils.js';

/**
 * Initialize performance optimizations
 * Disables animations for Opera browsers, in-app browsers, and low-performance devices
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

