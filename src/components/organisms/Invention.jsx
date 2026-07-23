import { lazy, Suspense } from 'react';
import { useTransform, motion } from 'framer-motion';
import { Download, ArrowUpRight } from 'lucide-react';
import StickyScene from '../animations/StickyScene';
import { useStickyScene } from '../animations/stickySceneContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

// Lazy-load the PDF viewer so the heavy PDF.js bundle (~450kB gzip) is only
// fetched when this section renders — keeps the initial page load lean.
const PdfViewer = lazy(() => import('../media/PdfViewer'));

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
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Left column — staggered text cascade.
  const tag = useReveal(progress, 0.02, 0.1, 24);
  const heading = useReveal(progress, 0.05, 0.14);
  const body = useReveal(progress, 0.08, 0.18);
  const buttons = useReveal(progress, 0.12, 0.22, 28);

  // Right viewer — appears early, slides in from the right (subtle drift).
  const viewerOpacity = useTransform(progress, [0.02, 0.14], [0, 1]);
  const viewerX = useTransform(progress, [0, 1], ['14%', '-4%']);

  const x = isDesktop ? viewerX : '0%';

  return (
    <section id="invention" className="w-full bg-white overflow-x-clip overflow-y-visible py-16 sm:py-24 lg:py-0 lg:h-full lg:flex lg:items-center">
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
            <a
              href="/sas.pdf"
              download="Meetfleet - Social Activation Score.pdf"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-light bg-[#0033FF] text-white rounded-[11px] hover:bg-[#0029cc] transition-colors"
            >
              <Download size={16} strokeWidth={1.75} />
              Research Paper
            </a>
            <a
              href="https://meetfleet.app/support/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-light bg-white text-black rounded-[11px] border border-black/15 hover:bg-black/[0.03] transition-colors"
            >
              <ArrowUpRight size={16} strokeWidth={1.75} />
              Peer Review
            </a>
          </motion.div>
        </div>

        {/* Right — Apple-style shadow container, centered on mobile, flush to the right edge on desktop. */}
        <motion.div
          className="relative w-full lg:justify-self-end will-change-transform"
          style={{ opacity: viewerOpacity, x }}
        >
          <div className="relative mx-auto lg:ml-auto lg:mr-0 w-[calc(100%-2rem)] sm:w-full max-w-[640px] bg-[#f6f7f9] rounded-[24px] sm:rounded-[36px] lg:rounded-l-[36px] lg:rounded-r-none shadow-[0_-20px_80px_rgba(0,0,0,0.14)] p-6 sm:p-8 lg:p-10">

            {/* Glassmorphism PDF viewer — rendered via PDF.js (no native
                browser toolbar, scrollbar, or side gutters). */}
            <div className="relative rounded-[20px] overflow-hidden border border-white/60 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.10)]">
              <Suspense fallback={<div className="w-full h-[560px] md:h-[680px] bg-white" />}>
                <PdfViewer file={pdf} className="w-full" />
              </Suspense>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const Invention = () => (
  <StickyScene trackVh={140}>
    <InventionScene />
  </StickyScene>
);

export default Invention;
