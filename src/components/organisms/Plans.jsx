import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Plans carousel.
 *
 * Redesigned with single round 3D art elements, sleek card aesthetics,
 * left-aligned controls, increased card height, prominent taglines,
 * and seamless full-bleed scrolling with pre-margin alignment.
 */

const reveal = (delay = 0) => ({
  initial: { opacity: 0, filter: 'blur(12px)', y: 24 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

const PLANS = [
  {
    id: 'free',
    lead: 'Free',
    name: 'Fleet',
    price: 'Free',
    tagline: 'Welcoming you, Honoring the commitment',
    art: '/plans/round/free.png',
    dark: false,
  },
  {
    id: 'basics',
    lead: 'Prime',
    name: 'Basics',
    price: '1,99 USD',
    tagline: 'Enjoy all the essentials, that you deserve',
    art: '/plans/round/basics.png',
    dark: false,
  },
  {
    id: 'gold',
    lead: 'Prime',
    name: 'Gold',
    price: '4,99 USD',
    tagline: 'Stand out, enjoying the top view',
    art: '/plans/round/gold.png',
    dark: false,
  },
  {
    id: 'onyx',
    lead: 'Prime',
    name: 'Onyx',
    price: '7,99 USD',
    tagline: 'Operating the system, with a luxurious endeavor',
    art: '/plans/round/onyx.png',
    dark: false,
  },
  {
    id: 'onlyfleet',
    lead: '',
    name: 'Onlyfleet',
    price: 'Invite-only',
    tagline: 'Not for everyone',
    art: '/plans/round/invite.png',
    dark: true,
  },
];

const Arrow = ({ dir, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'prev' ? 'Previous plan' : 'Next plan'}
    className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-300
      ${disabled
        ? 'border-black/10 text-black/20 cursor-not-allowed'
        : 'border-black/15 text-black/70 hover:border-black/40 hover:text-black hover:bg-black/5'}`}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  </button>
);

const Card = ({ plan }) => (
  <article
    className={`group relative shrink-0 snap-start w-[85vw] sm:w-[450px] md:w-[480px] lg:w-[510px]
               rounded-[30px] sm:rounded-[36px] py-7 sm:py-8 md:py-9 px-6 sm:px-8 md:px-9
               min-h-[190px] sm:min-h-[210px] md:min-h-[230px]
               flex items-center
               transition-all duration-500 ease-out
               ${plan.dark
                 ? 'bg-black text-white border border-white/10 hover:border-white/20 sm:hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]'
                 : 'bg-[#F4F4F7] text-black border border-black/[0.05] hover:border-black/[0.12] hover:bg-[#F7F7FA] sm:hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.14)]'}`}
  >
    {/* Soft top highlight catch-light */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px rounded-full
                 bg-gradient-to-r from-transparent via-white/80 to-transparent
                 opacity-40 transition-opacity duration-500 group-hover:opacity-100"
    />

    <div className="flex items-center gap-4 sm:gap-5 md:gap-6 w-full">
      {/* Single Round 3D Graphic Element */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
        <img
          src={plan.art}
          alt={plan.name}
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
        />
      </div>

      {/* Copy & Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex flex-col-reverse items-start sm:flex-row sm:items-center justify-start gap-2.5 sm:gap-3.5 sm:flex-nowrap">
          <h3 className={`text-2xl sm:text-3xl md:text-[32px] whitespace-nowrap tracking-tight leading-none ${plan.dark ? 'text-white' : 'text-black'}`}>
            {plan.lead && <span className="font-semibold">{plan.lead} </span>}
            <span className="font-normal">{plan.name}</span>
          </h3>
          <span className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs sm:text-sm font-normal transition-colors duration-300
                           ${plan.dark
                             ? 'border-white/25 text-white/90 group-hover:border-white/40'
                             : 'border-black/20 text-black/80 group-hover:border-black/35'}`}>
            {plan.price}
          </span>
        </div>
        <p className={`mt-3.5 sm:mt-4 text-base sm:text-[17px] font-light leading-relaxed max-w-[22rem]
                       ${plan.dark ? 'text-white/70' : 'text-black/65'}`}>
          {plan.tagline}
        </p>
      </div>
    </div>
  </article>
);

const Plans = () => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(1);
  const isInitialMount = useRef(true);

  // Read the track's own computed paddingLeft - always accurate because it's
  // set via responsive Tailwind classes that mirror the title container.
  const getTrackPadding = () => {
    const track = trackRef.current;
    if (!track) return 0;
    return parseFloat(getComputedStyle(track).paddingLeft) || 0;
  };

  const scrollToCard = useCallback((next) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, PLANS.length - 1));
    const card = track.children[clamped];
    if (card) {
      const pad = getTrackPadding();
      // Scroll so the card's left edge sits exactly at the track's paddingLeft
      track.scrollTo({ left: card.offsetLeft - pad, behavior: 'smooth' });
    }
    setIndex(clamped);
  }, []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    const pad = getTrackPadding();
    const anchor = track.scrollLeft + pad + (cards[0]?.offsetWidth || 0) / 2;

    let nearest = { d: Infinity, i: 0 };
    cards.forEach((card, i) => {
      const cardCentre = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(cardCentre - anchor);
      if (d < nearest.d) nearest = { d, i };
    });

    if (isInitialMount.current) {
      return;
    }

    setIndex(nearest.i);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.children[1];
    if (card) {
      const pad = getTrackPadding();
      track.scrollTo({ left: card.offsetLeft - pad, behavior: 'auto' });
    }

    isInitialMount.current = false;
    onScroll();
  }, [onScroll]);

  return (
    <section id="plans" className="w-full bg-white py-20 md:py-28 overflow-hidden">
      {/* Header - uses mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 mb-10 md:mb-14">
        <motion.div {...reveal(0)}>
          <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-normal tracking-tight text-black leading-[1.1]">
            Choose your fleet
          </h2>
          <p className="mt-3 max-w-[32rem] text-[14px] sm:text-[15px] font-light leading-relaxed text-black/50">
            Five tiers, one network. Start free and move up whenever you want more
            reach, sharper insight, and the room to host without limits.
          </p>

          {/* Left-aligned navigation arrows */}
          <div className="mt-6 sm:mt-8 flex items-center gap-3">
            <Arrow dir="prev" disabled={index === 0} onClick={() => scrollToCard(index - 1)} />
            <Arrow dir="next" disabled={index === PLANS.length - 1} onClick={() => scrollToCard(index + 1)} />
          </div>
        </motion.div>
      </div>

      {/* Scroll track - paddingLeft uses the exact same responsive values as
          the title container so the first card lines up with "Choose your fleet".
          On wide screens (≥ max-w-6xl) the lg value is overridden with a calc
          that adds the centering margin. Cards scroll uncropped past both edges. */}
      <motion.div {...reveal(0.15)}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4
                     pl-6 sm:pl-10 lg:pl-[max(4rem,calc((100vw-72rem)/2+4rem))]
                     pr-6 sm:pr-10 lg:pr-[max(4rem,calc((100vw-72rem)/2+4rem))]
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PLANS.map((plan) => (
            <Card key={plan.id} plan={plan} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Plans;
