/**
 * Portfolio Website JavaScript
 * Handles smooth scrolling, header effects, and other interactive features
 */

// Import LESS styles for processing by Vite
import '../styles/main.less';

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

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      header.style.background = 'rgba(255, 255, 255, 0.6)';
      header.classList.add('scrolled');

      // Change to black logo when scrolled
      if (logoImg.src !== window.location.origin + '/img/logo-black.webp') {
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
      header.style.background = 'rgba(255, 255, 255, 0.1)';
      header.classList.remove('scrolled');

      // Change to white logo when at top
      if (logoImg.src !== window.location.origin + '/img/logo-white.webp') {
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
  });
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
 * Disables animations for Opera browsers and low-performance devices
 */
function initializePerformanceOptimizations() {
  // Detect Opera browser
  const isOpera =
    (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

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
 * Detect low-performance devices based on hardware concurrency and memory
 */
function detectLowPerformanceDevice() {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // Check device memory (if available)
  const memory = navigator.deviceMemory || 4;

  // Check connection speed (if available)
  const connection = navigator.connection;
  const slowConnection =
    connection &&
    (connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData === true);

  // Consider device low-performance if:
  // - Less than 4 CPU cores
  // - Less than 4GB RAM
  // - Slow connection
  return cores < 4 || memory < 4 || slowConnection;
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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
  window.addEventListener(
    'scroll',
    debounce(function () {
      if (window.scrollY > 50) {
        scrollToTopButton.classList.add('visible');
      } else {
        scrollToTopButton.classList.remove('visible');
      }
    }, 100)
  );

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

  window.addEventListener('scroll', function () {
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
    const hideSpinner = () => {
      if (loadingSpinner) {
        loadingSpinner.style.opacity = '0';
        loadingSpinner.style.pointerEvents = 'none';
        // Remove after transition
        setTimeout(() => {
          if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
          }
        }, 300);
      }
    };

    // Hide spinner when iframe loads
    iframe.addEventListener('load', hideSpinner);

    // For Spotify embeds, hide spinner quickly to ensure iframe is visible
    // Use a short timeout to allow iframe to start rendering
    setTimeout(hideSpinner, 500);
  });
}
