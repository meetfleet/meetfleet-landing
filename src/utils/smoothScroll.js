import { animate } from 'framer-motion';

/**
 * springScrollTo — smooth scroll with Framer Motion spring physics
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

  // Spring physics configuration — tuned for smooth, fluid Apple-style gliding
  const springConfig = {
    type: 'spring',
    stiffness: 65,
    damping: 16,
    mass: 0.7,
    restDelta: 0.5,
    onUpdate: (latestY) => {
      window.scrollTo(0, latestY);
    },
    ...customConfig,
  };

  animate(currentY, targetY, springConfig);
};
