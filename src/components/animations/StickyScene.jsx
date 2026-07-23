import { useRef } from 'react';
import { useScroll, useSpring, useMotionValue, motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { StickySceneContext } from './stickySceneContext';

/**
 * StickyScene — an Apple-style sticky scroll scene (desktop) with a safe
 * mobile fallback.
 *
 * DESKTOP (lg+): a tall scroll track (`height = 100 * trackVh`) with a
 * viewport-height panel pinned via `position: sticky`. Scroll progress
 * (0→1, spring-smoothed) drives child transforms via useStickyScene().
 *
 * MOBILE (< lg): the pin/clip breaks when content is taller than the
 * viewport — the top (heading SVGs, mockups) gets cut off. So on mobile we
 * drop the pin entirely: the section flows normally (auto height, natural
 * top gap, nothing clipped) and progress is frozen at a "fully revealed"
 * value (0.5) so reveal transforms resolve to their visible mid-state and
 * never hide content.
 */
const StickyScene = ({ children, trackVh = 200, className = '', stiffness = 120, damping = 30 }) => {
  const trackRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Smooth the raw scroll progress so motion feels weighty, not twitchy.
  const smooth = useSpring(scrollYProgress, { stiffness, damping, restDelta: 0.0005 });

  // Mobile: a static, fully-revealed progress so transforms don't clip content.
  const staticProgress = useMotionValue(0.5);
  const progress = isDesktop ? smooth : staticProgress;

  if (!isDesktop) {
    // Natural document flow — no pin, no clip, content sets its own height.
    return (
      <div className={`relative ${className}`}>
        <StickySceneContext.Provider value={progress}>
          {children}
        </StickySceneContext.Provider>
      </div>
    );
  }

  return (
    <div ref={trackRef} style={{ height: `${trackVh}vh` }} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen w-full overflow-visible">
        <StickySceneContext.Provider value={progress}>
          <motion.div className="h-full w-full flex items-center justify-center">{children}</motion.div>
        </StickySceneContext.Provider>
      </div>
    </div>
  );
};

export default StickyScene;
