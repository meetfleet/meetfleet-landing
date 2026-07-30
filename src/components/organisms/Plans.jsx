import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Plans carousel.
 *
 * Mirrors the subscription screen in the app: each tier's 3D artwork rests in a
 * glass tray, with the tier name, price pill and a one-line description beside
 * it. Onyx desaturates its tray; Onlyfleet is a special invite-only card whose
 * artwork bleeds the full height of the card with no vertical padding.
 */

// Blur-in reveal, matching the rest of the site.
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
    tagline: 'Welcoming you, honouring the commitment',
    art: '/plans/free.png',
    tray: '/plans/tray.png',
  },
  {
    id: 'basics',
    lead: 'Prime',
    name: 'Basics',
    price: '1.99 USD',
    tagline: 'Enjoy all the essentials that you deserve',
    art: '/plans/basic.png',
    tray: '/plans/tray.png',
  },
  {
    id: 'gold',
    lead: 'Prime',
    name: 'Gold',
    price: '4.99 USD',
    tagline: 'Stand out, enjoying the top view',
    art: '/plans/gold.png',
    tray: '/plans/tray.png',
  },
  {
    id: 'onyx',
    lead: 'Prime',
    name: 'Onyx',
    price: '7.99 USD',
    tagline: 'Operating the system, with a luxurious endeavour',
    art: '/plans/onyx.png',
    tray: '/plans/tray-onyx.png',
  },
  {
    id: 'onlyfleet',
    lead: '',
    name: 'Onlyfleet',
    price: 'Invite-only',
    tagline: 'Not for everyone',
    // No tray: the orb bleeds the full card height.
    art: '/plans/onlyfleet.png',
    tray: null,
    bleed: true,
  },
];

const Arrow = ({ dir, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'prev' ? 'Previous plan' : 'Next plan'}
    className={`grid h-11 w-11 place-items-center rounded-full border transition
      ${disabled
        ? 'border-black/10 text-black/20 cursor-not-allowed'
        : 'border-black/15 text-black/70 hover:border-black/30 hover:text-black active:scale-95'}`}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  </button>
);

const Card = ({ plan, parallax = 0 }) => (
  <article
    className="group relative shrink-0 snap-start w-[86vw] sm:w-[30rem] lg:w-[34rem]
               rounded-[28px] border border-black/[0.06] bg-[#F4F4F7]
               transition-[box-shadow,border-color,background-color]
               duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]
               hover:border-black/[0.10] hover:bg-[#F7F7FA]
               hover:shadow-[0_18px_50px_-24px_rgba(15,23,42,0.28)]"
  >
    {/* Specular sheen — a soft diagonal highlight that fades in and drifts
        across on hover. This is the whole hover effect: no scaling, no pulsing.
        pointer-events-none so it never intercepts the cursor. */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[28px]"
    >
      <span
        className="absolute -inset-y-[40%] -left-[60%] w-[45%] rotate-[18deg]
                   bg-gradient-to-r from-transparent via-white/55 to-transparent
                   opacity-0 blur-[2px]
                   transition-[opacity,transform] duration-[900ms]
                   ease-[cubic-bezier(0.22,1,0.36,1)]
                   group-hover:translate-x-[320%] group-hover:opacity-100"
      />
    </span>

    {/* Hairline top edge, brighter on hover — reads as glass catching light. */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-6 top-0 z-20 h-px rounded-full
                 bg-gradient-to-r from-transparent via-white to-transparent
                 opacity-50 transition-opacity duration-[600ms] group-hover:opacity-100"
    />

    <div className="flex items-center gap-6 sm:gap-8">
      {/* Artwork. The invite-only card bleeds past the card's top and bottom
          edges with only a left gap; every other card sits its art inside a
          padded glass tray. */}
      {plan.bleed ? (
        // Taller than the card and vertically centred, so the orb overflows both
        // edges rather than being cut flat by them.
        <div className="relative h-[15rem] sm:h-[17rem] w-[42%] shrink-0 pl-5 sm:pl-7">
          <img
            src={plan.art}
            alt=""
            className="absolute left-5 sm:left-7 top-1/2 h-[132%] max-w-none
                       object-contain object-left will-change-transform"
            style={{ transform: `translate3d(${parallax}px, -50%, 0)` }}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="grid h-[15rem] sm:h-[17rem] w-[42%] shrink-0 place-items-center p-5 sm:p-7">
          {/* Tray and art occupy the same grid cell, so both stay centred without
              absolute positioning or transform hacks. */}
          <img
            src={plan.tray}
            alt=""
            className="col-start-1 row-start-1 h-full w-full object-contain will-change-transform"
            // Tray moves at ~35% of the artwork's rate; the difference between
            // the two layers is what reads as depth.
            style={{ transform: `translate3d(${parallax * 0.35}px, 0, 0)` }}
            loading="lazy"
          />
          <img
            src={plan.art}
            alt=""
            className="col-start-1 row-start-1 h-[54%] w-[54%] object-contain will-change-transform"
            style={{ transform: `translate3d(${parallax}px, 0, 0)` }}
            loading="lazy"
          />
        </div>
      )}

      {/* Copy */}
      <div className="relative z-10 flex-1 pr-6 sm:pr-8 py-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-[26px] sm:text-[32px] tracking-tight text-black leading-none">
            {plan.lead && <span className="font-semibold">{plan.lead} </span>}
            <span className="font-normal">{plan.name}</span>
          </h3>
          <span className="whitespace-nowrap rounded-full border border-black/15 px-3.5 py-1.5
                           text-[13px] sm:text-[14px] font-normal text-black/80
                           transition-colors duration-[600ms]
                           group-hover:border-black/25">
            {plan.price}
          </span>
        </div>
        <p className="mt-3 max-w-[18rem] text-[14px] sm:text-[15px] font-light leading-relaxed text-black/45">
          {plan.tagline}
        </p>
      </div>
    </div>
  </article>
);

const Plans = () => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  // Per-card parallax offsets, in px. Recomputed on scroll and applied as a
  // transform on each card's artwork.
  const [offsets, setOffsets] = useState([]);

  const scrollToCard = useCallback((next) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(next, PLANS.length - 1));
    const card = track.children[clamped];
    if (card) {
      // scrollIntoView would also scroll the page vertically; scrollTo keeps the
      // movement horizontal and inside the track.
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
    setIndex(clamped);
  }, []);

  // Keep the arrows in step when the user swipes, and compute parallax.
  //
  // Each card's artwork is shifted opposite its distance from the viewport
  // centre, so nearer cards appear to sit deeper than the card face — the same
  // trick the app's carousel uses, done here off scroll position.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children);
    const centre = track.scrollLeft + track.clientWidth / 2;

    let nearest = { d: Infinity, i: 0 };
    const next = cards.map((card, i) => {
      const cardCentre = card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
      const delta = cardCentre - centre;
      const d = Math.abs(delta);
      if (d < nearest.d) nearest = { d, i };
      // Normalise by card width so the effect is resolution-independent, then
      // clamp so far-off cards don't drift arbitrarily far.
      const norm = Math.max(-1.4, Math.min(1.4, delta / card.offsetWidth));
      return -norm * 34;
    });

    setOffsets(next);
    setIndex(nearest.i);
  }, []);

  // Seed offsets on mount so the first paint is already parallaxed.
  useEffect(() => { onScroll(); }, [onScroll]);

  return (
    <section id="plans" className="w-full bg-white py-24 md:py-32 overflow-hidden">
      {/* Heading stays inside the site's content width... */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">

        {/* Heading, with the arrows sitting opposite it */}
        <div className="mb-10 md:mb-14 flex items-end justify-between gap-8">
          <motion.div {...reveal(0)}>
            <h2 className="text-[30px] md:text-[40px] font-normal tracking-tight text-black leading-[1.1]">
              Choose your fleet
            </h2>
            <p className="mt-3 max-w-[30rem] text-[14px] md:text-[15px] font-light leading-relaxed text-black/45">
              Five tiers, one network. Start free and move up whenever you want more
              reach, sharper insight, and the room to host without limits.
            </p>
          </motion.div>

          <motion.div className="hidden sm:flex shrink-0 items-center gap-3" {...reveal(0.1)}>
            <Arrow dir="prev" disabled={index === 0} onClick={() => scrollToCard(index - 1)} />
            <Arrow dir="next" disabled={index === PLANS.length - 1} onClick={() => scrollToCard(index + 1)} />
          </motion.div>
        </div>
      </div>

      {/* ...but the TRACK is full-bleed: cards run off both edges instead of
          stopping at the content width. Leading padding matches the site gutter
          so the first card lines up with the heading; trailing padding lets the
          last card scroll clear of the right edge. */}
      <motion.div {...reveal(0.15)}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory
                     px-6 sm:px-10 lg:px-16 pb-2
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            // The gutter is derived from the same max-width the heading uses, so
            // card 1 aligns with the title on wide screens.
            paddingLeft: 'max(1.5rem, calc((100vw - 72rem) / 2 + 4rem))',
            paddingRight: '1.5rem',
          }}
        >
          {PLANS.map((plan, i) => (
            <Card key={plan.id} plan={plan} parallax={offsets[i] ?? 0} />
          ))}
        </div>
      </motion.div>

      {/* Mobile arrows, below the track where they're reachable */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="mt-8 flex sm:hidden items-center justify-center gap-3">
          <Arrow dir="prev" disabled={index === 0} onClick={() => scrollToCard(index - 1)} />
          <Arrow dir="next" disabled={index === PLANS.length - 1} onClick={() => scrollToCard(index + 1)} />
        </div>
      </div>
    </section>
  );
};

export default Plans;
