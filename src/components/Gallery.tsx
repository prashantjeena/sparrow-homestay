"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { gallery, galleryCategories, type GalleryItem } from "@/data/gallery";
import { asset } from "@/lib/asset";

const ease = [0.22, 1, 0.36, 1] as const;

/** Tile shapes, matching the photo sizes in public/images/README.md */
const ratio: Record<GalleryItem["shape"], string> = {
  wide: "aspect-[16/10]",
  tall: "aspect-[5/7]",
  square: "aspect-square",
};

/** Same shapes as numbers, used to size the big viewer photo. */
const viewRatio: Record<GalleryItem["shape"], number> = { wide: 1.6, tall: 5 / 7, square: 1 };

type Category = (typeof galleryCategories)[number];

export default function Gallery() {
  const reduce = useReducedMotion() ?? false;
  const [category, setCategory] = useState<Category>("All");
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const shown = category === "All" ? gallery : gallery.filter((g) => g.category === category);
  const isOpen = open !== null;
  const current = open !== null ? shown[open] : null;

  const step = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
    [shown.length],
  );

  // Keyboard, scroll lock and focus handling while the viewer is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus();
    };
  }, [isOpen, step]);

  const onSwipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) step(1);
    else if (info.offset.x > 60) step(-1);
  };

  return (
    <section id="gallery" className="container-x py-16 md:py-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-moss">Gallery</p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-ink md:text-5xl">
            A look around
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-ink2">
            Rooms, views and the odd bonfire. Tap any photo to see it bigger.
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter photos">
          {galleryCategories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => {
                setCategory(c);
                setOpen(null);
              }}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                category === c
                  ? "border-forest bg-forest text-cream"
                  : "border-line text-ink2 hover:bg-paper2 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry: columns keep each tile's own shape, no cropping surprises */}
      <div key={category} className="mt-8 columns-2 gap-3 md:columns-3 md:gap-4">
        {shown.map((item, i) => (
          <motion.button
            key={item.src}
            type="button"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.06, ease }}
            onClick={(e) => {
              lastFocus.current = e.currentTarget;
              setOpen(i);
            }}
            aria-label={`Open photo: ${item.alt}`}
            className={`group relative mb-3 block w-full overflow-hidden rounded-2xl border border-line bg-paper2 text-left [break-inside:avoid] md:mb-4 ${ratio[item.shape]}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(item.src)}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/65 via-black/20 to-transparent p-3 pt-10 text-cream opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-lantern">
                  {item.category}
                </span>
                <span className="block text-sm leading-tight">{item.alt}</span>
              </span>
              <Expand size={16} className="shrink-0 opacity-80" />
            </span>
          </motion.button>
        ))}
      </div>

      {/* Viewer */}
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${current.alt}, photo ${open! + 1} of ${shown.length}`}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 px-4 py-6 backdrop-blur-sm"
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Close viewer"
              onClick={() => setOpen(null)}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-white/20"
            >
              <X size={20} />
            </button>

            {shown.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-white/20 sm:grid"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-white/20 sm:grid"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <motion.figure
              key={current.src}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={onSwipe}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full max-w-5xl cursor-grab flex-col items-center active:cursor-grabbing"
            >
              <div
                className="relative"
                style={{
                  aspectRatio: viewRatio[current.shape],
                  width: `min(calc(100vw - 2rem), calc(78vh * ${viewRatio[current.shape]}), 64rem)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(current.src)}
                  alt={current.alt}
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none rounded-xl object-contain"
                />
              </div>
              <figcaption className="mt-4 text-center text-cream">
                <span className="block text-[11px] uppercase tracking-[0.25em] text-lantern">
                  {current.category}
                </span>
                <span className="font-display mt-1 block text-lg">{current.alt}</span>
                <span className="mt-1 block text-xs text-cream/60">
                  {open! + 1} / {shown.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
