import { motion } from 'framer-motion';
import heroImage from '../../assets/hero.webp';
import logo from '../../assets/logo.svg';

const Hero = () => {
  return (
    <motion.section
      id="hero"
      className="w-full min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8 pt-6 pb-16 sm:pb-20 md:pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Card — rounded white surface, soft uncropped shadow */}
      <div className="w-full max-w-7xl min-h-[660px] lg:h-[calc(100vh-4rem)] bg-white rounded-[24px] md:rounded-[35px] shadow-[0_12px_60px_rgba(0,0,0,0.08)] flex flex-col items-center gap-8 overflow-hidden relative p-6 sm:p-12 md:p-14">

        {/* Content group — centered in the available vertical space */}
        <div className="flex-grow flex flex-col items-center justify-center gap-2 sm:gap-4 w-full max-w-2xl">
          {/* Logo */}
          <motion.img
            src={logo}
            alt="Meetfleet Logo"
            className="w-9 h-9 sm:w-[52px] sm:h-[52px]"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          />

          {/* Heading */}
          <motion.h1
            className="text-[26px] sm:text-3xl md:text-[32px] font-normal text-black tracking-tight text-center leading-[1.22]"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            The History's First Social OS
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            className="text-base md:text-[17px] text-black/60 text-center leading-[1.35] font-light"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            Meetfleet is hyper-local coordination for the spontaneous era, a social OS connecting you instantly with real-time activities around you, from golf foursomes and romantic dates to group shopping, skiing, riding, and beach sessions.
          </motion.p>

          {/* TestFlight download badge */}
          <motion.div
            className="flex flex-col items-center z-10 mt-6 sm:mt-8 md:mt-10"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          >
            <a
              href="https://testflight.apple.com/join/nXyfPMSc"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <img 
                src="/testflight.webp" 
                alt="Available on TestFlight" 
                className="h-[48px] md:h-[54px] w-auto cursor-pointer" 
              />
            </a>
          </motion.div>
        </div>

        {/* Image — zoomed in */}
        <motion.div
          className="w-full max-w-4xl lg:max-w-5xl mt-auto flex justify-center overflow-visible"
          initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
        >
          <img
            src={heroImage}
            alt="Meetfleet App Interface"
            className="w-full h-auto object-contain drop-shadow-2xl origin-bottom scale-110 sm:scale-125 md:scale-135 translate-y-3 sm:translate-y-6"
          />
        </motion.div>

      </div>
    </motion.section>
  );
};

export default Hero;
