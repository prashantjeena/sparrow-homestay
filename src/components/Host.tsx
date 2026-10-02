"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Bird,
  Coffee,
  MessageCircle,
  ShoppingBasket,
  Sunrise,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import { host, type HostTipIcon } from "@/data/host";
import { whatsappLink } from "@/lib/whatsapp";

const ease = [0.22, 1, 0.36, 1] as const;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const tipIcons: Record<HostTipIcon, LucideIcon> = {
  sunrise: Sunrise,
  coffee: Coffee,
  trail: TreePine,
  market: ShoppingBasket,
};

const initials = host.name
  .split(" ")
  .filter(Boolean)
  .map((w) => w[0])
  .slice(0, 2)
  .join("");

/** Counts up to a number the first time it scrolls into view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion() ?? false;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>{n}</span>;
}

/** Arched photo that leans toward the mouse. Falls back to initials if the file is missing. */
function Portrait() {
  const reduce = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 18 });

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      style={{ perspective: 1000 }}
      className="relative mx-auto w-full max-w-sm"
    >
      {/* Soft shapes behind the photo */}
      <div aria-hidden className="absolute -left-4 top-6 h-full w-full -rotate-3 rounded-t-[999px] rounded-b-3xl bg-moss/25" />
      <div aria-hidden className="absolute -right-3 -top-3 h-24 w-24 rounded-full bg-lantern/30 blur-2xl" />

      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        className="theme-t relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-3xl border border-line bg-paper2 shadow-xl shadow-black/10"
      >
        {failed ? (
          <div className="grid h-full w-full place-items-center bg-forest font-display text-7xl text-cream">
            {initials}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${basePath}${host.photo}`}
            alt={`${host.name}, your host`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top"
          />
        )}

        {/* Name plate */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-5 pt-16 text-cream">
          <p className="font-display text-xl leading-tight">{host.name}</p>
          <p className="text-sm text-cream/80">{host.role}</p>
        </div>
      </motion.div>

      {/* Little sparrow badge */}
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { y: [0, -6, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-2 top-20 grid h-14 w-14 place-items-center rounded-full bg-lantern text-forest shadow-lg sm:-right-5"
      >
        <Bird size={26} />
      </motion.div>
    </motion.div>
  );
}

export default function Host() {
  const reduce = useReducedMotion() ?? false;
  const years = new Date().getFullYear() - host.since;

  const reveal = (delay = 0) => ({
    initial: reduce ? (false as const) : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section id="about" className="container-x py-16 md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Portrait />

        <div>
          <motion.p {...reveal()} className="text-xs uppercase tracking-[0.25em] text-moss">
            Your host
          </motion.p>
          <motion.h2 {...reveal(0.05)} className="font-display mt-3 text-4xl font-semibold text-ink md:text-5xl">
            Meet your host
          </motion.h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink2 md:text-lg">
            {host.bio.map((p, i) => (
              <motion.p key={i} {...reveal(0.1 + i * 0.08)}>
                {p}
              </motion.p>
            ))}
          </div>

          {/* Quick facts */}
          <motion.dl {...reveal(0.2)} className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-5 text-center">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink2">Hosting since</dt>
              <dd className="font-display mt-1 text-3xl font-semibold text-forest">{host.since}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink2">Years of stories</dt>
              <dd className="font-display mt-1 text-3xl font-semibold text-forest">
                <CountUp to={years} />
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-ink2">Speaks</dt>
              <dd className="mt-2 text-sm font-medium leading-snug text-forest">{host.languages.join(" · ")}</dd>
            </div>
          </motion.dl>

          {/* Local tips */}
          <motion.h3 {...reveal(0.1)} className="font-display mt-9 text-2xl text-ink">
            Local tips from {host.name.split(" ")[0]}
          </motion.h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {host.tips.map((tip, i) => {
              const Icon = tipIcons[tip.icon];
              return (
                <motion.li
                  key={tip.title}
                  {...reveal(0.1 + i * 0.08)}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="theme-t flex gap-3 rounded-2xl border border-line bg-card p-4 transition-shadow hover:shadow-lg hover:shadow-black/10"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-moss/15 text-moss">
                    <Icon size={20} />
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{tip.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-ink2">{tip.text}</span>
                  </span>
                </motion.li>
              );
            })}
          </ul>

          <motion.div {...reveal(0.2)} className="mt-8">
            <a
              href={whatsappLink(host.enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
            >
              <MessageCircle size={18} />
              Ask {host.name.split(" ")[0]} a question
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
