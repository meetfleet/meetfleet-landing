import { motion } from 'framer-motion';

const layers = '/layers.svg'; // overlapping-circles diagram (351 x 351)

// Blur-in reveal, matching the rest of the site.
const reveal = (delay = 0) => ({
  initial: { opacity: 0, filter: 'blur(12px)', y: 24 },
  whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.7, ease: 'easeOut', delay },
});

const Block = ({ title, children, align = 'left', delay }) => (
  <motion.div
    className={`flex flex-col items-start text-left ${align === 'right' ? 'lg:items-end lg:text-right' : ''}`}
    {...reveal(delay)}
  >
    <h3 className="text-[22px] md:text-[26px] font-normal text-black tracking-tight mb-4">
      {title}
    </h3>
    <p className="text-[14px] md:text-[15px] text-black/45 leading-relaxed font-light max-w-[22rem]">
      {children}
    </p>
  </motion.div>
);

const Ecosystem = () => {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-24 md:py-32">
        {/* 3-column grid on desktop: text | diagram | text.
            Collapses to diagram-on-top, stacked blocks on mobile. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-x-12 gap-y-16 md:gap-y-24">

          {/* Left column — top-left + bottom-left blocks */}
          <div className="order-2 lg:order-1 flex flex-col gap-16 md:gap-32">
            <Block title="Trust Infrastructure" align="right" delay={0}>
              User opens app. Before they ever see a plan, the system has already worked.
              Every profile carries a live Trust Score, built from post-plan ratings, badge
              milestones, and our ongoing authenticity investigations. You always know who
              you&rsquo;re actually meeting.
            </Block>
            <Block title="Invisible Concierge" align="right" delay={0.1}>
              Our technology matches user to a verified person with compatible intent +
              energy + trust level. The optimal audited venue is assigned automatically.
              &ldquo;You&rsquo;re studying together at [Cafe]. Corner table reserved.&rdquo;
              They never searched for a venue. They never worried about who&rsquo;d show up.
            </Block>
          </div>

          {/* Center — overlapping-circles diagram with logo at its core */}
          <motion.div
            className="order-1 lg:order-2 relative mx-auto w-[280px] h-[280px] md:w-[360px] md:h-[360px]"
            {...reveal(0.05)}
          >
            <img src={layers} alt="" className="w-full h-full" />
          </motion.div>

          {/* Right column — top-right + bottom-right blocks */}
          <div className="order-3 flex flex-col gap-16 md:gap-32">
            <Block title="Intent Engine" align="left" delay={0.05}>
              User selects a Plan, not a location. &ldquo;Co-Study,&rdquo; &ldquo;Sunday
              Shopping,&rdquo; &ldquo;Evening Coffee.&rdquo; The system reads their social
              battery score and energy weight to surface plans, and people, matched to where
              they are mentally, not just physically.
            </Block>
            <Block title="Invisible Accountability" align="left" delay={0.15}>
              After every plan ends, both participants rate each other. No ghosts, no
              throwaway interactions. Each rating feeds a live Trust Score and unlocks
              verified Badges, earned through real behavior, not purchases. The loop closes:
              better behavior builds a stronger profile, a stronger profile attracts better
              matches. The system self-polices over time.
            </Block>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
