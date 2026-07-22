import { motion } from 'framer-motion';
import logo from '../../assets/logo.svg';

const devices = '/devices.webp';       // device lineup (1300 x 454 ≈ 2.86:1)
const appStore = '/appstore.png';      // App Store download badge

// Blur-in reveal, consistent with the rest of the site.
const reveal = (delay = 0) => ({
  initial: { opacity: 0, filter: 'blur(12px)', y: 24 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

const Download = () => {
  return (
    <section className="w-full bg-white px-3 sm:px-5 md:p-6">
      {/* Extra bottom padding so the overhanging devices aren't clipped */}
      <div className="mx-auto max-w-6xl pt-6 pb-[17vw] sm:pb-[14vw] md:pb-[12vw]">
        {/* Card — rounded white surface, soft shadow. NOT overflow-hidden,
            so the devices can straddle the bottom edge. */}
        <div className="relative bg-white rounded-[24px] md:rounded-[35px] shadow-[0_4px_100px_rgba(0,0,0,0.08)] px-6 pt-12 md:pt-16 pb-[21vw] sm:pb-[17vw] md:pb-[15vw] flex flex-col items-center text-center">

          {/* Logo badge */}
          <motion.div
            className="w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-full bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-black/[0.04] flex items-center justify-center mb-7"
            {...reveal(0)}
          >
            <img src={logo} alt="Meetfleet" className="w-8 h-8 md:w-9 md:h-9" />
          </motion.div>

          {/* Wordmark */}
          <motion.h2
            className="text-[32px] md:text-[40px] font-normal text-black tracking-tight mb-3.5"
            {...reveal(0.05)}
          >
            Meetfleet
          </motion.h2>

          {/* Tagline */}
          <motion.p
            className="text-[15px] md:text-base text-black/45 font-light max-w-lg mb-9"
            {...reveal(0.1)}
          >
            Download the history&rsquo;s first social operating system, works with all your devices
          </motion.p>

          {/* App Store badge — drop applestore.png in /public */}
          <motion.a href="#" aria-label="Download on the App Store" className="mb-8 md:mb-10" {...reveal(0.15)}>
            <img src={appStore} alt="Download on the App Store" className="h-[52px] md:h-[58px] w-auto" />
          </motion.a>

          {/* Devices — straddle the card's bottom edge (centered on it, floating) */}
          <motion.img
            src={devices}
            alt="Meetfleet on all your devices"
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[30%] w-[86%] max-w-[860px] h-auto pointer-events-none select-none"
            initial={{ opacity: 0, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
};

export default Download;
