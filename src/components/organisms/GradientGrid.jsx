import { useTransform, useSpring, motion } from 'framer-motion';
import StickyScene from '../animations/StickyScene';
import { useStickyScene } from '../animations/stickySceneContext';

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
    opacity: 0.55 + rand() * 0.45,
  }));
  const overlay = OVERLAYS[seed % OVERLAYS.length];
  const base = BASE[seed % BASE.length];
  const radius = size * 0.225; // 55.25/246 ≈ 0.225

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: size, height: size, borderRadius: radius, backgroundImage: base }}
    >
      {/* Blurred hue blobs */}
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

const GradientGridScene = () => {
  const raw = useStickyScene();

  // A second, softer spring on top of the scene progress — extra weight and
  // glide so the plane eases rather than tracking scroll 1:1. This is what
  // makes the motion feel classy instead of mechanical.
  const progress = useSpring(raw, { stiffness: 60, damping: 26, mass: 1.1, restDelta: 0.0004 });

  // Reveal — long, soft fade + un-blur.
  const opacity = useTransform(progress, [0.03, 0.28], [0, 1]);
  const blur = useTransform(progress, [0.03, 0.3], ['blur(20px)', 'blur(0px)']);

  // Tilt eases in and out (intermediate keyframes) rather than moving linearly.
  const rotX = useTransform(progress, [0, 0.5, 1], [42, 26, 20]);
  const rotY = useTransform(progress, [0, 0.5, 1], [-12, -22, -27]);

  // Gentle float: drifts up, settles to full scale, lifts slightly in Z.
  const ty = useTransform(progress, [0, 1], ['9%', '-7%']);
  const scale = useTransform(progress, [0, 0.5, 1], [0.92, 0.99, 1]);
  const tz = useTransform(progress, [0, 1], [-120, 40]);

  // Per-row parallax — rows glide at slightly different rates so the plane
  // feels alive and layered, not rigid. One entry per row (ROWS = 3).
  const rowY = [
    useTransform(progress, [0, 1], ['3%', '-3%']),
    useTransform(progress, [0, 1], ['0%', '0%']),
    useTransform(progress, [0, 1], ['-3%', '3%']),
  ];

  // Glass card — reveals a touch after the grid, settling gently into place.
  const cardOpacity = useTransform(progress, [0.18, 0.4], [0, 1]);
  const cardY = useTransform(progress, [0.18, 0.5], [28, 0]);
  const cardScale = useTransform(progress, [0.18, 0.5], [0.96, 1]);

  return (
    <section className="relative h-full w-full bg-white flex items-center justify-center overflow-hidden">
      {/* Perspective stage */}
      <motion.div
        style={{ opacity, filter: blur, perspective: 1400, perspectiveOrigin: '50% 40%' }}
        className="w-full flex items-center justify-center will-change-transform"
      >
        {/* Tilted plane — the 3D "stretched float" look */}
        <motion.div
          style={{
            rotateX: rotX,
            rotateY: rotY,
            rotateZ: 3,
            scaleX: 1.22,
            scale,
            y: ty,
            z: tz,
            transformStyle: 'preserve-3d',
          }}
          className="flex flex-col gap-5 md:gap-6 will-change-transform"
        >
          {Array.from({ length: ROWS }, (_, row) => (
            <motion.div
              key={row}
              style={{ y: rowY[row], transformStyle: 'preserve-3d' }}
              className="flex gap-5 md:gap-6 will-change-transform"
            >
              {Array.from({ length: COLS }, (_, col) => (
                <GradientTile key={col} seed={row * COLS + col} size={118} />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Frosted glass card — centered overlay above the tilted grid.
          SVG spec: 662.5×401, rx 94, white @ 0.7, 1px white border,
          backdrop-blur 50px, soft 0 4px 250px shadow. */}
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

const GradientGrid = () => (
  <StickyScene trackVh={200}>
    <GradientGridScene />
  </StickyScene>
);

export default GradientGrid;
