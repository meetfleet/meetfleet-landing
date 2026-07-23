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
        className="absolute inset-0 block"
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
        className="absolute inset-0 block"
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

const COLS = 10;
const ROWS = 3;

// One ROWS×COLS plane of tiles. `seedBase` offsets the seeds so a second
// (mirrored) plane never looks like a duplicate. `rowY`/`rowScale` are shared
// motion values driving the per-row parallax/depth.
const GridPlane = ({ seedBase, size, rowY, rowScale }) => (
  <>
    {Array.from({ length: ROWS }, (_, row) => (
      <motion.div
        key={row}
        style={{ y: rowY[row], scale: rowScale[row], transformStyle: 'preserve-3d' }}
        className="flex gap-4 md:gap-6 will-change-transform"
      >
        {Array.from({ length: COLS }, (_, col) => (
          <GradientTile key={col} seed={seedBase + row * COLS + col} size={size} />
        ))}
      </motion.div>
    ))}
  </>
);

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

  // Intense tilt: steep → flat-ish → steep the other way as it passes through.
  const rotX = useTransform(progress, [0, 0.5, 1], [58, 20, 58]);
  const rotY = useTransform(progress, [0, 0.5, 1], [-2, -30, -58]);
  const rotZ = useTransform(progress, [0, 0.5, 1], [9, 2, -6]);

  // Big vertical travel + a deep Z sweep for dramatic perspective.
  const ty = useTransform(progress, [0, 1], ['22%', '-22%']);
  const scale = useTransform(progress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const tz = useTransform(progress, [0, 0.5, 1], [-360, 80, -360]);

  // Per-row parallax — strong, rows cascade at different depths.
  const rowY = [
    useTransform(progress, [0, 1], ['9%', '-9%']),
    useTransform(progress, [0, 1], ['0%', '0%']),
    useTransform(progress, [0, 1], ['-9%', '9%']),
  ];
  const rowScale = [
    useTransform(progress, [0, 1], [0.96, 1]),
    useTransform(progress, [0, 1], [1.0, 1.05]),
    useTransform(progress, [0, 1], [0.96, 1]),
  ];

  // Glass card — reveals as the grid settles near center, then holds (no exit fade).
  const cardOpacity = useTransform(progress, [0.3, 0.44], [0, 1]);
  const cardY = useTransform(progress, [0.3, 0.5], [28, 0]);
  const cardScale = useTransform(progress, [0.3, 0.5], [0.96, 1]);

  const tileSize = isDesktop ? 96 : 96;

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="relative w-full max-w-full min-h-screen py-16 lg:py-0 lg:h-screen bg-white overflow-hidden flex items-center justify-center"
    >
      {/* Perspective stage — overflow-hidden so wide 3D tile field is clipped to screen width */}
      <motion.div
        style={{
          opacity,
          filter: blur,
          perspective: 1400,
          perspectiveOrigin: '50% 50%',
        }}
        className="w-full max-w-full flex items-center justify-center will-change-transform overflow-hidden"
      >
        {/* Tilted plane: the original grid + a vertically-mirrored duplicate
            below it (offset seeds so tiles never look copied), centered as one. */}
        <motion.div
          style={{
            rotateX: rotX,
            rotateY: rotY,
            rotateZ: rotZ,
            scaleX: 1.22,
            scale,
            y: ty,
            z: tz,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
          className="flex flex-col items-center gap-4 md:gap-6"
        >
          {/* Original */}
          <GridPlane seedBase={0} size={tileSize} rowY={rowY} rowScale={rowScale} />
          {/* Inverted duplicate — mirrored vertically, fresh seeds */}
          <div style={{ transform: 'scaleY(-1)' }} className="flex flex-col items-center gap-4 md:gap-6">
            <GridPlane seedBase={ROWS * COLS} size={tileSize} rowY={rowY} rowScale={rowScale} />
          </div>
        </motion.div>
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
