import { motion } from 'framer-motion';
import heroImage from '../../assets/hero.webp';
import logo from '../../assets/logo.svg';

const Hero = () => {
  return (
    <motion.section
      id="hero"
      className="min-h-screen w-full bg-white flex items-center justify-center p-3 sm:p-5 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Card — SVG: rounded white surface, soft shadow, fills the frame */}
      <div className="w-full h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-2.5rem)] md:h-[calc(100vh-3rem)] min-h-[720px] bg-white rounded-[24px] md:rounded-[35px] shadow-[0_4px_100px_rgba(0,0,0,0.1)] flex flex-col items-center gap-8 overflow-hidden relative p-8 sm:p-12 md:p-14">

        {/* Content group — centered in the available vertical space */}
        <div className="flex-grow flex flex-col items-center justify-center gap-4 sm:gap-8 w-full max-w-2xl">
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
            className="text-base md:text-[18px] text-black/50 text-center leading-[1.17] font-light"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            Meetfleet is an inclusive R&D infrastructure designed to solve loneliness for everyone,
            from students looking for study partners to neighbors wanting to explore local
            markets together.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 z-10"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
          >
            <a
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('download');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-[29px] py-[14px] text-[14px] leading-none font-light bg-[#0033FF] text-white rounded-[11px] hover:bg-[#0029cc] transition-colors w-full sm:w-auto text-center"
            >
              Download
            </a>
            <a
              href="#message"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('message');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-[29px] py-[14px] text-[14px] leading-none font-light bg-white text-black/70 rounded-[11px] border border-black/15 hover:bg-black/[0.03] transition-colors shadow-[0_3px_16px_rgba(0,0,0,0.06)] w-full sm:w-auto text-center"
            >
              Learn More
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
