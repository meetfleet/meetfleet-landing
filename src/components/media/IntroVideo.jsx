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
    </motion.div>
  );
};

export default IntroVideo;
