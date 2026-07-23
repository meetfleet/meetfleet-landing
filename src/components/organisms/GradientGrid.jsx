import { useRef } from 'react';
import { useTransform, useSpring, useScroll, motion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/* --------------------------------------------------------------------------
 * GradientGrid — a 3D-tilted grid of gradient "app icon" tiles.
 * Decoded from the reference: each tile is a rounded square with a layered
 * base gradient (blues/purples/greens) + several blurred ellipse "blobs"
 * (mix-blend-mode: hue) + a vivid overlay (mix-blend-mode: difference/overlay).
 * The whole grid is tilted with rotateX/Y/Z + scaleX under perspective.
 * ------------------------------------------------------------------------ */

// Base gradient stacks (matches the source's layered linear-gradients).
const BASE = [
  'linear-gradient(0deg, #0BFF06 0%, #00A4AE 100%), linear-gradient(0deg, #443BA6 0%, #8838ED 100%), linear-gradient(0deg, #1400F4 0%, #7E1AFF 100%)',
  'linear-gradient(0deg, #0BFF06 0%, #00A4AE 100%), linear-gradient(0deg, #1400F4 0%, #7E1AFF 100%)',
];

// Vivid overlay colors + blend modes cycled per tile (from the source overlays).
const OVERLAYS = [
  { c: '#FD0000', b: 'difference' },
  { c: '#D900FD', b: 'difference' },
  { c: '#00B1FD', b: 'difference' },
  { c: '#EE0000', b: 'difference' },
  { c: '#8500EE', b: 'difference' },
  { c: '#4CEE00', b: 'difference' },
  { c: '#A2EE00', b: 'difference' },
  { c: '#E900EE', b: 'difference' },
  { c: '#00EEC3', b: 'difference' },
  { c: '#00EE18', b: 'exclusion' },
  { c: '#30EE00', b: 'difference' },
  { c: '#00EE5F', b: 'difference' },
];

// Blob palette pulled from the source (hue-blended color splotches).
const BLOB_COLORS = [
  '#FF0000', '#CCFF00', '#1F6BFF', '#EB06F0', '#8727C1', '#0487FF',
  '#A5FF7A', '#60AC13', '#6FDC18', '#FFB800', '#FF6A3C', '#42FF00',
  '#EBFF00', '#957AFF', '#8204FF', '#FF007A', '#3CADFF', '#27F006',
];

// Deterministic pseudo-random from a seed — keeps tiles varied but stable.
const rng = (seed) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// One tile: base gradient + blurred hue blobs + vivid overlay.
const GradientTile = ({ seed, size = 150 }) => {
  const rand = rng(seed + 1);
  const blobCount = 4 + Math.floor(rand() * 2); // 4–5 blobs
  const blobs = Array.from({ length: blobCount }, () => ({
    cx: rand() * size,
    cy: rand() * size,
    rx: size * (0.28 + rand() * 0.35),
    ry: size * (0.22 + rand() * 0.32),
    rot: rand() * 360,
    color: BLOB_COLORS[Math.floor(rand() * BLOB_COLORS.length)],
    opacity: 0.7 + rand() * 0.3,
  }));
  const overlay = OVERLAYS[seed % OVERLAYS.length];
  const base = BASE[seed % BASE.length];
  const radius = size * 0.225; // 55.25/246 ≈ 0.225

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundImage: base,
        // Push saturation/brightness so the tiles read vivid, not washed out.
        filter: 'saturate(1.6) brightness(1.06)',
        // Perf: a tile's internals (gradients + blurred blobs) are STATIC.
        // `contain: paint` lets the browser rasterize each tile once and cache
        // it — the pricey SVG blurs never re-render during scroll.
        contain: 'layout paint style',
        transform: 'translateZ(0)',
      }}
    >
      {/* Blurred hue blobs — borrow hue from the vivid palette */}
      <svg
        className="absolute inset-0 block animate-spin-slow"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ mixBlendMode: 'hue', filter: 'blur(14px)' }}
      >
        {blobs.map((b, i) => (
          <ellipse
            key={i}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={b.color}
            fillOpacity={b.opacity}
            transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}
          />
        ))}
      </svg>
      {/* Second blob layer with 'color' blend — injects real chroma
          (not just hue), so the splotches stay bright and saturated. */}
      <svg
        className="absolute inset-0 block animate-spin-slow-reverse"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ mixBlendMode: 'color', filter: 'blur(16px)', opacity: 0.65 }}
      >
        {blobs.map((b, i) => (
          <ellipse
            key={`c${i}`}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx * 0.9}
            ry={b.ry * 0.9}
            fill={b.color}
            fillOpacity={b.opacity}
            transform={`rotate(${b.rot} ${b.cx} ${b.cy})`}
          />
        ))}
      </svg>
      {/* Vivid overlay — this drives the saturated, varied per-tile look */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlay.c, mixBlendMode: overlay.b }}
      />
    </div>
  );
};

const TILE_COUNT = 35; // Adjust for density
const tilesData = Array.from({ length: TILE_COUNT }, (_, i) => {
  const r1 = rng(i * 100 + 42)();
  const r2 = rng(i * 101 + 43)();
  const r3 = rng(i * 102 + 44)();
  const r4 = rng(i * 103 + 45)();
  const r5 = rng(i * 104 + 46)();
  const r6 = rng(i * 105 + 47)();
  
  return {
    id: i,
    seed: i,
    // Scatter further out so they enter/exit edges cleanly
    left: `${-10 + r1 * 120}%`,
    top: `${-20 + r2 * 140}%`,
    scale: 0.3 + r3 * 1.1, // 0.3 to 1.4 for deeper field of view
    parallaxY: (r4 - 0.5) * 1200, // Massive vertical drift (-600px to +600px)
    parallaxX: (r5 - 0.5) * 400,  // Subtle horizontal drift
    baseRotation: (r6 - 0.5) * 120, // Initial random rotation
    rotationSpeed: (r1 - 0.5) * 180, // Spin dynamically while scrolling
  };
});

const FloatingTile = ({ t, progress, tileSize }) => {
  const y = useTransform(progress, [0, 1], [-t.parallaxY, t.parallaxY]);
  const x = useTransform(progress, [0, 1], [-t.parallaxX, t.parallaxX]);
  const rotate = useTransform(progress, [0, 1], [t.baseRotation - t.rotationSpeed, t.baseRotation + t.rotationSpeed]);
  
  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: t.left,
        top: t.top,
        scale: t.scale,
        x,
        y,
        rotate,
        zIndex: Math.round(t.scale * 10)
      }}
    >
      <GradientTile seed={t.seed} size={tileSize} />
    </motion.div>
  );
};

const GradientGridScene = () => {
  const sectionRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Self-driven scroll progress across the whole section — works on BOTH web
  // and mobile (no frozen fallback), so the tiles animate intensely everywhere.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 24, mass: 1.05, restDelta: 0.0004 });

  // Reveal in, then HOLD — no fade/blur-out on exit; the tiles stay present.
  const opacity = useTransform(progress, [0.08, 0.32], [0, 1]);
  const blur = useTransform(progress, [0.08, 0.3], ['blur(24px)', 'blur(0px)']);

  // Glass card — reveals as the grid settles near center, then holds (no exit fade).
  const cardOpacity = useTransform(progress, [0.3, 0.44], [0, 1]);
  const cardY = useTransform(progress, [0.3, 0.5], [28, 0]);
  const cardScale = useTransform(progress, [0.3, 0.5], [0.96, 1]);

  const tileSize = isDesktop ? 128 : 100;

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="relative w-full max-w-full min-h-screen py-16 lg:py-0 lg:h-screen bg-white overflow-x-clip overflow-y-visible flex items-center justify-center"
    >
      <motion.div
        style={{
          opacity,
          filter: blur,
        }}
        className="absolute inset-0 w-full h-full overflow-x-clip overflow-y-visible"
      >
        {tilesData.map((t) => (
          <FloatingTile key={t.id} t={t} progress={progress} tileSize={tileSize} />
        ))}
      </motion.div>

      {/* Edge blur — progressively blur + fade the outer columns on the left
          and right so the tile field dissolves at its horizontal extremes.
          backdrop-blur blurs the tiles behind; the mask ramps it from strong
          at the edge to none by ~28% in. Desktop only. */}
      <div
        aria-hidden
        className="hidden lg:block absolute inset-y-0 left-0 w-[28%] z-[5] pointer-events-none backdrop-blur-[10px]"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, black, transparent)',
          maskImage: 'linear-gradient(to right, black, transparent)',
        }}
      />
      <div
        aria-hidden
        className="hidden lg:block absolute inset-y-0 right-0 w-[28%] z-[5] pointer-events-none backdrop-blur-[10px]"
        style={{
          WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
          maskImage: 'linear-gradient(to left, black, transparent)',
        }}
      />

      {/* Frosted glass card — centered overlay, intense white surface. */}
      <motion.div
        style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-6 will-change-transform"
      >
        <div
          className="pointer-events-auto w-full max-w-[560px] rounded-[64px] border border-white/90 bg-white/90 backdrop-blur-[50px] shadow-[0_4px_250px_rgba(0,0,0,0.10)] px-10 pt-14 pb-24 sm:px-14 flex flex-col items-start"
        >
          {/* Outlined blue tag (SVG: stroke #0033FF, rx 27.5) */}
          <span className="inline-flex items-center rounded-full border border-[#0033FF] text-[#0033FF] text-[15px] md:text-base font-light px-6 py-2.5 mb-8">
            Our Technology
          </span>

          {/* Heading */}
          <h2 className="text-[30px] md:text-[38px] leading-[1.1] font-semibold text-black tracking-tight mb-5">
            Your People. Your Palette
          </h2>

          {/* Body */}
          <p className="text-[15px] md:text-[16px] text-black/70 leading-relaxed font-light">
            Unleash the full spectrum of who you are, we hold the palette that brings
            your truest colors to life.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

const GradientGrid = () => <GradientGridScene />;

export default GradientGrid;
