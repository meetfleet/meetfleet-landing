import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Plans carousel.
 *
 * Redesigned with single round 3D art elements, sleek card aesthetics,
 * left-aligned controls, and seamless full-bleed scrolling.
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
        : 'border-black/15 text-black/70 hover:border-black/40 hover:text-black hover:bg-black/5 active:scale-95'}`}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  </button>
);

const Card = ({ plan }) => (
  <article
    className={`group relative shrink-0 snap-start w-[88vw] sm:w-[500px] md:w-[540px] lg:w-[580px]
               rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 md:p-9
               transition-all duration-500 ease-out
               ${plan.dark
                 ? 'bg-black text-white border border-white/10 hover:border-white/20 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]'
                 : 'bg-[#F4F4F7] text-black border border-black/[0.05] hover:border-black/[0.12] hover:bg-[#F7F7FA] hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.14)]'}`}
  >
    {/* Soft top highlight catch-light */}
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-8 top-0 z-20 h-px rounded-full
                 bg-gradient-to-r from-transparent via-white/80 to-transparent
                 opacity-40 transition-opacity duration-500 group-hover:opacity-100`}
    />

    <div className="flex items-center gap-6 sm:gap-8 md:gap-9">
      {/* Single Round 3D Graphic Element */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden flex items-center justify-center">
        <img
          src={plan.art}
          alt={plan.name}
          className="w-full h-full object-cover rounded-full transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Copy & Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <h3 className={`text-2xl sm:text-3xl md:text-[32px] tracking-tight leading-none ${plan.dark ? 'text-white' : 'text-black'}`}>
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
        <p className={`mt-3 sm:mt-4 text-sm sm:text-base font-light leading-relaxed max-w-[20rem]
                       ${plan.dark ? 'text-white/65' : 'text-black/60'}`}>
          {plan.tagline}
        </p>
      </div>
    </div>
  </article>
);

const Plans = () => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const scrollToCard = useCallback((next) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, PLANS.length - 1));
    const card = track.children[clamped];
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
    setIndex(clamped);
  }, []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    const centre = track.scrollLeft + track.clientWidth / 2;

    let nearest = { d: Infinity, i: 0 };
    cards.forEach((card, i) => {
      const cardCentre = card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(cardCentre - centre);
      if (d < nearest.d) nearest = { d, i };
    });

    setIndex(nearest.i);
  }, []);

  useEffect(() => { onScroll(); }, [onScroll]);

  return (
    <section id="plans" className="w-full bg-white py-20 md:py-28 overflow-hidden">
      {/* Header section with title, description, and left-aligned arrows */}
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

      {/* Full-bleed scroll track with zero awkward gap before card 1 */}
      <motion.div {...reveal(0.15)}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            paddingLeft: 'max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))',
            paddingRight: 'max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))',
          }}
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
