/**
 * Portfolio Website JavaScript
 * Handles smooth scrolling, header effects, and other interactive features
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';
import { debounce, isInstagramBrowser, detectLowPerformanceDevice, createScrollHandler, hideIframeSpinner } from './utils.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function () {
  // Mark body as loaded to show content after CSS is ready
  document.body.classList.add('loaded');
  
  // Performance and browser detection
  initializePerformanceOptimizations();

  initializeSmoothScrolling();
  initializeHeaderScrollEffect();
  // initializeAnimations(); // Disabled animations on home
  initializeScrollToTop();
  initializeBackgroundAnimations();
  initializeDiscographyEmbeds();

  // Initialize projects module
  if (window.ProjectsModule) {
    // Load project data from JSON
    await window.ProjectsModule.loadProjectsData();
    // Initialize project cards after data is loaded
    window.ProjectsModule.initializeProjectCards();
  }
});

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
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
function initializeHeaderScrollEffect() {
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
 * Initialize scroll-triggered animations
 */
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    '.project-card, .skill-tag, .company-tag, .section h2'
  );
  animatedElements.forEach((el) => observer.observe(el));
}

/**
 * Initialize performance optimizations
 * Disables animations for Opera browsers, in-app browsers, and low-performance devices
 */
function initializePerformanceOptimizations() {
  const userAgent = navigator.userAgent || '';
  
  // Detect Opera browser
  const isOpera =
    (!!window.opr && !!opr.addons) || !!window.opera || userAgent.indexOf(' OPR/') >= 0;

  // Detect Instagram/Facebook in-app browser (Android)
  const isInstaBrowser = isInstagramBrowser();

  // Detect low-performance devices
  const isLowPerformance = detectLowPerformanceDevice();

  // Apply performance optimizations
  if (isOpera || isLowPerformance || isInstaBrowser) {
    document.body.classList.add('opera-no-animations');
    if (isLowPerformance || isInstaBrowser) {
      document.body.classList.add('low-performance');
    }
    if (isInstaBrowser) {
      document.body.classList.add('instagram-browser');
    }

    // Disable smooth scrolling
    document.documentElement.style.scrollBehavior = 'auto';
  }
}


/**
 * Handle mobile menu toggle (for future enhancement)
 */
function initializeMobileMenu() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuButton && navLinks) {
    mobileMenuButton.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
}

/**
 * Initialize lazy loading for images (for future enhancement)
 */
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Add scroll-to-top functionality
 */
function initializeScrollToTop() {
  // Create scroll-to-top button
  const scrollToTopButton = document.createElement('button');
  scrollToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
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
 * Initialize background animations control based on scroll position
 * Stops animations when user scrolls past 500px
 */
function initializeBackgroundAnimations() {
  const cinematicBackground = document.querySelector('.cinematic-background');
  const dustParticles = document.querySelectorAll('.dust-particles');

  if (!cinematicBackground) return;

  const scrollHandler = createScrollHandler(() => {
    const scrollY = window.scrollY;
    const shouldPause = scrollY > 500;

    // Add/remove class to body to pause all animations via CSS
    if (shouldPause) {
      if (!document.body.classList.contains('animations-paused')) {
        document.body.classList.add('animations-paused');
      }
    } else {
      document.body.classList.remove('animations-paused');
    }
  });
  
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

/**
 * Initialize discography embeds with loading spinners
 */
function initializeDiscographyEmbeds() {
  const albumEmbeds = document.querySelectorAll('.album-embed');

  albumEmbeds.forEach((embed) => {
    const iframe = embed.querySelector('iframe');
    const loadingSpinner = embed.querySelector('.iframe-loading');

    if (!iframe || !loadingSpinner) return;

    // Function to hide spinner
    const hideSpinner = () => hideIframeSpinner(loadingSpinner, 300);

    // Hide spinner when iframe loads
    iframe.addEventListener('load', hideSpinner);

    // For Spotify embeds, hide spinner quickly to ensure iframe is visible
    // Use a short timeout to allow iframe to start rendering
    setTimeout(hideSpinner, 500);
  });
}
