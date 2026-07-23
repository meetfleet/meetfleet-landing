import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const icon = '/SAS.webp'; // SAS chip icon

const Sas = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const iconY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']); // gentle parallax drift

  return (
    <section id="sas" ref={sectionRef} className="w-full min-h-screen bg-white flex items-center justify-center py-12 sm:py-16 md:py-20">
      {/* Apple-style: centered, symmetric responsive side margins */}
      <div className="mx-auto w-full max-w-3xl px-6 sm:px-10 text-center flex flex-col items-center">

        {/* SAS icon */}
        <motion.img
          src={icon}
          alt="SAS"
          className="w-[88px] md:w-[104px] h-auto mb-10 will-change-transform"
          style={{ y: iconY }}
        />

        {/* Main quote */}
        <blockquote className="text-[19px] md:text-[26px] leading-snug text-black font-light tracking-tight max-w-2xl">
          &ldquo;SAS is a multi-dimensional activation function that scores the real-world
          feasibility of two people doing something together, accounting for psychological
          alignment, intent fit, logistical friction, and agent-verified environmental
          safety, simultaneously.
        </blockquote>

        {/* Attribution */}
        <div
          className="mt-10 text-[13px] md:text-sm text-black/35 leading-relaxed"
          style={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 400, fontStyle: 'normal' }}
        >
          <p>MeetFleet · Proprietary Patent</p>
          <p>From R&amp;D Series - Technical White Paper No. 003 · Mar 2026</p>
        </div>

      </div>
    </section>
  );
};

export default Sas;
