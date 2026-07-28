import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const IntroVideo = ({ onComplete }) => {
  const videoRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const videoSrc = isDesktop ? '/desktop.mp4' : '/mobile.mp4';
  const posterSrc = isDesktop
    ? '/intro-desktop-poster.webp'
    : '/intro-mobile-poster.webp';

  // The poster (an exact copy of the video's first frame) paints instantly and
  // stays under the video until real frames are on screen — so there is never a
  // black gap, and the handoff to video is seamless because the pixels match.
  const [playing, setPlaying] = useState(false);

  const handleVideoEnd = () => {
    if (onComplete) onComplete();
  };

  useEffect(() => {
    // Safety fallback if the video never plays or ends (20s margin).
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 20000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      // Poster as the background paint: the first frame is on screen the very
      // moment the intro mounts — no black flash, no glitch ramp.
      style={{
        backgroundColor: '#000',
        backgroundImage: `url(${posterSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        className="w-full h-full object-cover"
        style={{
          // Reveal only once real frames are decoding; until then the identical
          // poster background shows through, so the transition is invisible.
          opacity: playing ? 1 : 0,
          transition: 'opacity 120ms linear',
        }}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
        onPlaying={() => setPlaying(true)}
        onLoadedData={(e) => {
          e.target.play().catch(() => {});
        }}
        onCanPlay={(e) => {
          e.target.play().catch(() => {});
        }}
      />
    </motion.div>
  );
};

export default IntroVideo;
