import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { springScrollToTop } from '../../utils/smoothScroll';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal once the user is well past the hero.
      setIsVisible(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={() => springScrollToTop()}
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100000] flex items-center justify-center w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full bg-white/60 backdrop-blur-[22px] backdrop-saturate-[180%] border border-white/70 text-gray-700 hover:text-[#0033FF] shadow-[0_2px_28px_rgba(0,0,0,0.12)] transition-colors will-change-transform"
        >
          <ArrowUp size={20} strokeWidth={2.25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
