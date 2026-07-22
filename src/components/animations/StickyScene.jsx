import { useRef } from 'react';
import { useScroll, useSpring, motion } from 'framer-motion';
import { StickySceneContext } from './stickySceneContext';

/**
 * StickyScene — an Apple-style sticky scroll scene.
 *
 * Renders a tall scroll track (`height = 100 * trackVh`) with a viewport-height
 * panel pinned via `position: sticky`. As you scroll through the track, the panel
 * stays fixed and `progress` (a smoothed 0→1 MotionValue) advances. Children read
 * it via `useStickyScene()` and map it to any transform (scale, opacity, blur, y…).
 *
 * offset ['start start', 'end end'] means: progress = 0 the moment the track's top
 * hits the viewport top (panel becomes stuck), and 1 when the track's bottom does
 * (panel about to release) — so the full animation range == the sticky duration.
 */
const StickyScene = ({ children, trackVh = 200, className = '', stiffness = 120, damping = 30 }) => {
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Smooth the raw scroll progress so motion feels weighty, not twitchy.
  const progress = useSpring(scrollYProgress, {
    stiffness,
    damping,
    restDelta: 0.0005,
  });

  return (
    <div ref={trackRef} style={{ height: `${trackVh}vh` }} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <StickySceneContext.Provider value={progress}>
          <motion.div className="h-full w-full">{children}</motion.div>
        </StickySceneContext.Provider>
      </div>
    </div>
  );
};

export default StickyScene;
