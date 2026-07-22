import { useTransform, motion } from 'framer-motion';
import { Download, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import StickyScene from '../animations/StickyScene';
import { useStickyScene } from '../animations/stickySceneContext';

const pdf = '/sas.pdf';

// Reveal an element across a scroll-progress window [start, end].
const useReveal = (progress, start, end, rise = 40) => {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const filter = useTransform(progress, [start, end], ['blur(14px)', 'blur(0px)']);
  const y = useTransform(progress, [start, end], [rise, 0]);
  return { opacity, filter, y };
};

const InventionScene = () => {
  const progress = useStickyScene();

  // Left column — staggered text cascade.
  const tag = useReveal(progress, 0.04, 0.18, 24);
  const heading = useReveal(progress, 0.1, 0.26);
  const body = useReveal(progress, 0.18, 0.36);
  const buttons = useReveal(progress, 0.28, 0.46, 28);

  // Right viewer — slides in from the right edge (side parallax) then drifts.
  const viewerOpacity = useTransform(progress, [0.05, 0.28], [0, 1]);
  const viewerX = useTransform(progress, [0, 1], ['22%', '-4%']);

  return (
    <section className="w-full bg-white overflow-hidden py-20 lg:py-0 lg:h-full lg:flex lg:items-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-0">

        {/* Left — text column (padded, Apple-style symmetric margins) */}
        <div className="flex flex-col items-start pl-6 sm:pl-10 lg:pl-16 xl:pl-24 pr-6 sm:pr-10 lg:pr-8 max-w-2xl">

          {/* Outlined blue tag */}
          <motion.span
            className="inline-flex items-center rounded-[11px] border border-[#0033FF] text-[#0033FF] text-[13px] md:text-sm font-light px-4 py-2 mb-8 will-change-transform"
            style={tag}
          >
            Invention &amp; Science
          </motion.span>

          {/* Heading */}
          <motion.h2
            className="text-[30px] md:text-[40px] leading-[1.15] text-black tracking-tight mb-6 will-change-transform"
            style={{ ...heading, fontFamily: '"Times New Roman", Times, serif', fontWeight: 400, fontStyle: 'normal' }}
          >
            A Never-Before-Seen Invention to Cure Loneliness
          </motion.h2>

          {/* Body */}
          <motion.p
            className="text-[15px] md:text-[16px] text-black/60 leading-relaxed mb-10 will-change-transform"
            style={{ ...body, fontFamily: '"Times New Roman", Times, serif', fontWeight: 400, fontStyle: 'normal' }}
          >
            We built MeetFleet around a totally new concept we invented called Ascience,
            which powers our Social Activation Score (SAS). Most platforms just match you
            based on surface-level hobbies, but we wanted to solve the real problem: getting
            people to actually get off the couch and hang out. To do that, SAS looks way past
            basic interests to see if your personalities genuinely vibe, if you&rsquo;re both
            actually down for the same activity, how easy the commute is, and whether the
            meetup spot is safe and verified. It boils all those messy, complicated moving
            parts down into one simple number, giving you a clear green light on exactly if,
            when, and where a great real-world connection is going to happen.
          </motion.p>

          {/* Buttons — hero radius, non-functional for now */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            style={buttons}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-light bg-[#0033FF] text-white rounded-[11px] hover:bg-[#0029cc] transition-colors"
            >
              <Download size={16} strokeWidth={1.75} />
              Research Paper
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-light bg-white text-black rounded-[11px] border border-black/15 hover:bg-black/[0.03] transition-colors"
            >
              <ArrowUpRight size={16} strokeWidth={1.75} />
              Peer Review
            </button>
          </motion.div>
        </div>

        {/* Right — Apple-style shadow container, flush to the right edge.
            Left corners rounded, right corners square (no gap with viewport edge). */}
        <motion.div
          className="relative w-full lg:justify-self-end will-change-transform"
          style={{ opacity: viewerOpacity, x: viewerX }}
        >
          <div className="relative ml-auto w-full max-w-[640px] bg-[#f6f7f9] rounded-l-[36px] rounded-r-none shadow-[0_20px_80px_rgba(0,0,0,0.14)] p-6 sm:p-8 lg:p-10">

            {/* Glassmorphism PDF viewer — native chrome fully hidden */}
            <div className="relative rounded-[20px] overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.10)]">
              {/* Slightly oversized + clipped so any residual scrollbar/toolbar is cropped away */}
              <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
                <iframe
                  title="SAS — Technical White Paper"
                  src={`${pdf}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH`}
                  scrolling="no"
                  className="block bg-white border-0 absolute -top-2 -left-2 w-[calc(100%+1.1rem)] h-[calc(100%+1rem)]"
                />
              </div>

              {/* Three floating glass buttons — no bar/pill */}
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-3">
                <button
                  type="button"
                  aria-label="Previous page"
                  className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-xl text-black/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-white/80 transition-colors"
                >
                  <ChevronLeft size={18} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-xl text-black/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-white/80 transition-colors"
                >
                  <ChevronRight size={18} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="Fullscreen"
                  className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/50 backdrop-blur-xl text-black/70 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-white/80 transition-colors"
                >
                  <Maximize2 size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const Invention = () => (
  <StickyScene trackVh={220}>
    <InventionScene />
  </StickyScene>
);

export default Invention;
