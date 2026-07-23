import { useTransform, motion } from 'framer-motion';
import StickyScene from '../animations/StickyScene';
import { useStickyScene } from '../animations/stickySceneContext';

const icon = '/SAS.webp'; // SAS chip icon

// Reveal an element across a scroll-progress window [start, end]:
// blur + fade + slide-up in, holding sharp once revealed.
const useReveal = (progress, start, end, rise = 40) => {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const filter = useTransform(progress, [start, end], ['blur(14px)', 'blur(0px)']);
  const y = useTransform(progress, [start, end], [rise, 0]);
  return { opacity, filter, y };
};

const SasScene = () => {
  const progress = useStickyScene();

  // Icon leads: reveals + settles from a slightly larger scale.
  const iconReveal = useReveal(progress, 0.04, 0.2, 20);
  const iconScale = useTransform(progress, [0.04, 0.24], [1.15, 1]);
  const iconY = useTransform(progress, [0, 1], ['-6%', '6%']); // gentle parallax drift

  // Quote reveals in two overlapping halves for a line-by-line feel.
  const quote = useReveal(progress, 0.14, 0.34);
  const attribution = useReveal(progress, 0.3, 0.5, 24);

  return (
    <section id="sas" className="w-full bg-white py-24 lg:py-0 lg:h-full lg:flex lg:items-center">
      {/* Apple-style: centered, symmetric responsive side margins */}
      <div className="mx-auto w-full max-w-3xl px-6 sm:px-10 text-center flex flex-col items-center">

        {/* SAS icon */}
        <motion.img
          src={icon}
          alt="SAS"
          className="w-[88px] md:w-[104px] h-auto mb-10 will-change-transform"
          style={{ ...iconReveal, scale: iconScale, y: iconY }}
        />

        {/* Main quote */}
        <motion.blockquote
          className="text-[19px] md:text-[26px] leading-snug text-black font-light tracking-tight max-w-2xl will-change-transform"
          style={quote}
        >
          &ldquo;SAS is a multi-dimensional activation function that scores the real-world
          feasibility of two people doing something together, accounting for psychological
          alignment, intent fit, logistical friction, and agent-verified environmental
          safety, simultaneously.
        </motion.blockquote>

        {/* Attribution */}
        <motion.div
          className="mt-10 text-[13px] md:text-sm text-black/35 leading-relaxed will-change-transform"
          style={{ ...attribution, fontFamily: '"Times New Roman", Times, serif', fontWeight: 400, fontStyle: 'normal' }}
        >
          <p>MeetFleet · Proprietary Patent</p>
          <p>From R&amp;D Series - Technical White Paper No. 003 · Mar 2026</p>
        </motion.div>

      </div>
    </section>
  );
};

const Sas = () => (
  <StickyScene trackVh={140}>
    <SasScene />
  </StickyScene>
);

export default Sas;
