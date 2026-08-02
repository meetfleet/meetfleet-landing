import { animate } from 'framer-motion';

// Shared spring physics - tuned for smooth, fluid Apple-style gliding.
// Reused by every spring-driven scroll so section travel and scroll-to-top
// feel identical.
const SPRING_CONFIG = {
  type: 'spring',
  stiffness: 65,
  damping: 16,
  mass: 0.7,
  restDelta: 0.5,
};

/**
 * springScrollTo - smooth scroll with Framer Motion spring physics
 * @param {HTMLElement|string} target - target element or element ID / selector
 * @param {Object} customConfig - optional spring physics overrides
 */
export const springScrollTo = (target, customConfig = {}) => {
  const el = typeof target === 'string'
    ? document.getElementById(target.replace('#', ''))
    : target;

  if (!el) return;

  const currentY = window.scrollY || window.pageYOffset;
  const elementTop = el.getBoundingClientRect().top + currentY;

  // Calculate vertical centering offset so target section is centered in viewport
  const windowHeight = window.innerHeight;
  const elementHeight = el.offsetHeight;
  const centeringOffset = elementHeight < windowHeight
    ? (windowHeight - elementHeight) / 2
    : 0;

  const targetY = Math.max(0, elementTop - centeringOffset);

  const springConfig = {
    ...SPRING_CONFIG,
    onUpdate: (latestY) => {
      window.scrollTo(0, latestY);
    },
    ...customConfig,
  };

  animate(currentY, targetY, springConfig);
};

/**
 * springScrollToTop - glide back to the top of the page using the exact same
 * spring physics as section-to-section travel.
 * @param {Object} customConfig - optional spring physics overrides
 */
export const springScrollToTop = (customConfig = {}) => {
  const currentY = window.scrollY || window.pageYOffset;
  if (currentY === 0) return;

  animate(currentY, 0, {
    ...SPRING_CONFIG,
    onUpdate: (latestY) => {
      window.scrollTo(0, latestY);
    },
    ...customConfig,
  });
};
