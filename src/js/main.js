/**
 * Portfolio Website JavaScript
 * Handles smooth scrolling, header effects, and other interactive features
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScrolling();
    initializeHeaderScrollEffect();
    initializeAnimations();
});

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const navigationLinks = document.querySelectorAll('a[href^="#"]');
    
    navigationLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
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
    
    window.addEventListener('scroll', function() {
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
            navLinks.forEach(link => {
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
            navLinks.forEach(link => {
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
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .skill-tag, .company-tag, .section h2');
    animatedElements.forEach(el => observer.observe(el));
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
        mobileMenuButton.addEventListener('click', function() {
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
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
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
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 50) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    }, 100));
    
    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollToTop();
    initializeMobileMenu();
    initializeLazyLoading();
    
    // Initialize projects module
    if (window.ProjectsModule) {
        window.ProjectsModule.initializeProjectCards();
    }
});
