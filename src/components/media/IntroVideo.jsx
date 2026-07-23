import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const IntroVideo = ({ onComplete }) => {
  const videoRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const videoSrc = isDesktop ? '/desktop.mp4' : '/mobile.mp4';

  const handleVideoEnd = () => {
    if (onComplete) onComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safety fallback if video fails to load altogether (20s safety margin)
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 20000);

    return () => {
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
        onCanPlay={(e) => {
          e.target.play().catch(() => {});
        }}
      />
    </motion.div>
  );
};

export default IntroVideo;
