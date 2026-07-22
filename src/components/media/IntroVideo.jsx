import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const IntroVideo = ({ onComplete }) => {
  const videoRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const videoSrc = isDesktop ? '/desktop.mp4' : '/mobile.mp4';

  useEffect(() => {
    const handleVideoEnd = () => {
      if (onComplete) onComplete();
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', handleVideoEnd);
      // Also auto-complete after 5 seconds in case video fails
      const timeout = setTimeout(() => onComplete(), 5000);

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        clearTimeout(timeout);
      };
    }
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onCanPlay={(e) => e.target.play()}
      />
    </motion.div>
  );
};

export default IntroVideo;
