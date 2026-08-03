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

  const [playing, setPlaying] = useState(false);

  const handleVideoEnd = () => {
    if (onComplete) onComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If autoplay fails on low-power mobile, complete gracefully
          handleVideoEnd();
        });
      }
    }

    // Safety fallback if video stalls or takes too long (16s max)
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 16000);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black transform-gpu"
      style={{
        backgroundColor: '#000',
        backgroundImage: `url(${posterSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        className="w-full h-full object-cover transform-gpu"
        style={{
          opacity: playing ? 1 : 0,
          transition: 'opacity 150ms linear',
          willChange: 'opacity',
        }}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        disablePictureInPicture
        disableRemotePlayback
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

      {/* Backdrop Glassmorphism Skip Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        onClick={handleVideoEnd}
        className="absolute top-5 right-5 sm:top-8 sm:right-8 z-50 flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md bg-black/40 hover:bg-black/60 border border-white/20 hover:border-white/40 text-white/90 hover:text-white text-xs sm:text-sm font-medium tracking-wide shadow-lg cursor-pointer transition-all duration-200 select-none"
        aria-label="Skip intro video"
      >
        <span>Skip</span>
        <svg
          className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current opacity-80"
          viewBox="0 0 24 24"
        >
          <path d="M5 4l10 8-10 8V4zm11 0h3v16h-3V4z" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default IntroVideo;
