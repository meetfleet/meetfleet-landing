import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const LazyVideo = ({ 
  src, 
  poster, 
  title, 
  className, 
  autoplay = true, 
  muted = true, 
  loop = true, 
  playsInline = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && videoRef.current && autoplay) {
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    }
  }, [isLoaded, autoplay]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {!isLoaded && poster && (
        <img
          src={poster}
          alt={title || 'Video preview'}
          className="w-full h-full object-cover"
        />
      )}
      {isLoaded && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          title={title}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          className="w-full h-full object-cover"
          {...props}
        />
      )}
    </motion.div>
  );
};

export default LazyVideo;
