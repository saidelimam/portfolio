/**
 * Scroll Reveal
 * Progressively reveals elements marked with [data-reveal] as they
 * enter the viewport, using a single IntersectionObserver for
 * performance. Elements inside a [data-reveal-group] container are
 * auto-staggered. Falls back to showing everything immediately when
 * motion is undesired (reduced-motion / low-performance) or when
 * IntersectionObserver is unavailable.
 */

const REVEAL_SELECTOR = '[data-reveal]';
const MAX_STAGGER = 0.6; // seconds
const STAGGER_STEP = 0.08; // seconds per item

/**
 * Reveal every target immediately (no animation).
 * @param {Element[]} elements
 */
function revealAll(elements) {
  elements.forEach((el) => el.classList.add('is-visible'));
}

/**
 * Apply incremental reveal delays to staggered groups.
 */
function applyStaggerDelays() {
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll(':scope > [data-reveal]');
    items.forEach((item, index) => {
      if (!item.style.getPropertyValue('--reveal-delay')) {
        const delay = Math.min(index * STAGGER_STEP, MAX_STAGGER);
        item.style.setProperty('--reveal-delay', `${delay}s`);
      }
    });
  });
}

/**
 * Initialize scroll reveal.
 * @param {Object} [options]
 * @param {number} [options.threshold=0.12] - Intersection ratio to trigger.
 * @param {string} [options.rootMargin='0px 0px -8% 0px'] - Observer root margin.
 */
export function initializeScrollReveal(options = {}) {
  const elements = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
  if (elements.length === 0) return;

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lowPerformance =
    document.body.classList.contains('low-performance') ||
    document.body.classList.contains('opera-no-animations');

  if (prefersReducedMotion || lowPerformance || !('IntersectionObserver' in window)) {
    revealAll(elements);
    return;
  }

  applyStaggerDelays();

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: options.threshold ?? 0.12,
      rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}
