"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { generalEnquiry, whatsappLink } from "@/lib/whatsapp";

/* ------------------------------------------------------------------
   Scenery data. Mountain colours come from CSS variables (--m1..--m5),
   so the sunrise / dusk switch recolours everything without JS.
------------------------------------------------------------------- */
const ridges = [
  {
    fill: "var(--m1)",
    scroll: 200,
    mouse: 10,
    path: "M0 260 L90 210 L180 250 L300 150 L420 235 L520 190 L640 120 L760 220 L870 170 L990 240 L1100 160 L1220 230 L1330 190 L1440 240 L1440 600 L0 600 Z",
  },
  {
    fill: "var(--m2)",
    scroll: 160,
    mouse: 18,
    path: "M0 320 L110 270 L220 310 L340 230 L470 300 L580 250 L700 310 L820 210 L950 290 L1060 240 L1180 310 L1300 250 L1440 300 L1440 600 L0 600 Z",
  },
  {
    fill: "var(--m3)",
    scroll: 120,
    mouse: 28,
    path: "M0 380 L120 330 L250 380 L380 300 L500 370 L640 320 L760 390 L900 310 L1030 380 L1160 320 L1290 385 L1440 340 L1440 600 L0 600 Z",
  },
  {
    fill: "var(--m4)",
    scroll: 80,
    mouse: 40,
    path: "M0 440 L140 390 L280 450 L420 380 L560 445 L700 400 L840 455 L980 385 L1120 450 L1260 400 L1440 445 L1440 600 L0 600 Z",
  },
];

const forestRidge =
  "M0 500 L200 470 L400 510 L600 480 L820 515 L1040 475 L1240 510 L1440 480 L1440 600 L0 600 Z";
const ground = "M0 552 Q360 516 720 546 T1440 534 L1440 600 L0 600 Z";

/** A small two-tier pine silhouette. */
const pine = (x: number, base: number, s: number) =>
  `M${x} ${base - 62 * s} L${x - 15 * s} ${base - 26 * s} L${x - 7 * s} ${base - 26 * s} L${x - 19 * s} ${base} L${x + 19 * s} ${base} L${x + 7 * s} ${base - 26 * s} L${x + 15 * s} ${base - 26 * s} Z`;

const pines = Array.from({ length: 26 }, (_, i) => ({
  x: 30 + i * 56,
  s: 0.8 + ((i * 37) % 5) / 10,
}));

const birds = [
  { top: "17%", size: 28, duration: 34, delay: 0 },
  { top: "25%", size: 19, duration: 43, delay: 9 },
  { top: "11%", size: 15, duration: 52, delay: 18 },
];

const clouds = [
  { top: "13%", left: "6%", w: 230, h: 56, duration: 38 },
  { top: "23%", left: "56%", w: 320, h: 70, duration: 52 },
  { top: "8%", left: "76%", w: 190, h: 44, duration: 44 },
];

// Deterministic "random" so server and client render identical stars.
const stars = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 9301 + n * 49297) * 233280;
    return Number((v - Math.floor(v)).toFixed(2));
  };
  return { left: r(1) * 100, top: r(2) * 52, size: 1 + r(3) * 2, delay: r(4) * 4 };
});

/* ------------------------------------------------------------------ */

type LayerProps = {
  fill: string;
  path: string;
  scrollShift: number;
  mouseShift: number;
  scroll: MotionValue<number>;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  still: boolean;
  children?: ReactNode;
};

function Layer({
  fill,
  path,
  scrollShift,
  mouseShift,
  scroll,
  mx,
  my,
  still,
  children,
}: LayerProps) {
  const x = useTransform(mx, (v) => (still ? 0 : v * -mouseShift));
  const y = useTransform([scroll, my], ([s, m]: number[]) =>
    still ? 0 : s * scrollShift + m * -mouseShift * 0.4,
  );

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMax slice"
      className="absolute bottom-0 left-[-5%] h-[66%] w-[110%]"
      style={{ x, y }}
    >
      <path d={path} style={{ fill, transition: "fill 0.8s ease" }} />
      {children}
    </motion.svg>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });

  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
    >
      {/* sky */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--sky-top) 0%, var(--sky-mid) 55%, var(--sky-bottom) 100%)",
        }}
      />

      {/* stars (only visible at dusk) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ opacity: "var(--night)", transition: "opacity 1.2s ease" }}
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className="star absolute rounded-full bg-cream"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: `twinkle ${3 + s.delay}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* sun (sinks lower at dusk) */}
      <div
        aria-hidden
        className="absolute left-[64%] h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          top: "var(--sun-y)",
          background:
            "radial-gradient(circle, var(--sun) 0 30%, color-mix(in srgb, var(--sun) 35%, transparent) 42%, transparent 70%)",
          transition: "top 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* moon (only visible at dusk) */}
      <div
        aria-hidden
        className="absolute right-[14%] top-[13%] h-14 w-14 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, #fffbe8, #e7dcb0)",
          boxShadow: "0 0 50px 8px rgba(246, 231, 184, 0.35)",
          opacity: "var(--night)",
          transition: "opacity 1.2s ease",
        }}
      />

      {/* clouds */}
      {clouds.map((c, i) => (
        <div
          key={i}
          aria-hidden
          className="cloud absolute rounded-full bg-white blur-xl"
          style={{
            top: c.top,
            left: c.left,
            width: c.w,
            height: c.h,
            opacity: "calc(0.55 - var(--night) * 0.42)",
            transition: "opacity 1.2s ease",
            animation: `drift ${c.duration}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* birds */}
      {birds.map((b, i) => (
        <div
          key={i}
          aria-hidden
          className="bird"
          style={{
            top: b.top,
            animationDuration: `${b.duration}s`,
            animationDelay: `-${b.delay}s`,
          }}
        >
          <svg
            width={b.size}
            height={b.size / 2}
            viewBox="0 0 24 12"
            fill="none"
            stroke="var(--m5)"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M1 8 Q6 1 12 7 Q18 1 23 8" />
          </svg>
        </div>
      ))}

      {/* mountains, back to front */}
      {ridges.map((r) => (
        <Layer
          key={r.fill}
          fill={r.fill}
          path={r.path}
          scrollShift={r.scroll}
          mouseShift={r.mouse}
          scroll={scrollYProgress}
          mx={smx}
          my={smy}
          still={reduce}
        />
      ))}

      <Layer
        fill="var(--m5)"
        path={forestRidge}
        scrollShift={40}
        mouseShift={55}
        scroll={scrollYProgress}
        mx={smx}
        my={smy}
        still={reduce}
      >
        {pines.map((p) => (
          <path
            key={p.x}
            d={pine(p.x, 528, p.s)}
            style={{ fill: "var(--m5)", transition: "fill 0.8s ease" }}
          />
        ))}
      </Layer>

      <Layer
        fill="var(--paper)"
        path={ground}
        scrollShift={0}
        mouseShift={0}
        scroll={scrollYProgress}
        mx={smx}
        my={smy}
        still
      />

      {/* content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="container-x relative z-10 flex h-full flex-col items-center pt-[19svh] text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="theme-t rounded-full border border-line bg-card/40 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-ink2 backdrop-blur"
        >
          {site.location.place}, {site.location.region} · {site.location.altitude}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="theme-t mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] text-ink md:text-7xl"
        >
          {site.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="theme-t mt-5 max-w-xl text-lg text-ink2 md:text-xl"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#book"
            className="rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-cream shadow-lg shadow-black/10 transition hover:scale-105 hover:bg-moss"
          >
            Check availability
          </a>
          <a
            href={whatsappLink(generalEnquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="theme-t inline-flex items-center gap-2 rounded-full border border-line bg-card/50 px-6 py-3.5 text-sm font-medium text-ink backdrop-blur transition hover:scale-105 hover:border-lantern"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
