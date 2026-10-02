"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Plus } from "lucide-react";
import { faqs } from "@/data/faqs";
import { generalEnquiry, whatsappLink } from "@/lib/whatsapp";

const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

export default function Faq() {
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  const shown = category === "All" ? faqs : faqs.filter((f) => f.category === category);

  return (
    <section id="faq" className="container-x py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Left: heading, filters, nudge */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs uppercase tracking-[0.25em] text-moss">Good to know</p>
          <h2 className="font-display mt-3 text-4xl font-semibold text-ink md:text-5xl">
            Questions, answered
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink2">
            The things guests ask us most. Can&apos;t find yours? Just message us.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
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

          <a
            href={whatsappLink(generalEnquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest underline-offset-4 hover:underline"
          >
            <MessageCircle size={16} />
            Still curious? Ask on WhatsApp
          </a>
        </div>

        {/* Right: accordion */}
        <ul className="space-y-3">
          {shown.map((f, i) => {
            const isOpen = open === f.q;
            return (
              <motion.li
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="theme-t overflow-hidden rounded-2xl border border-line bg-card"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : f.q)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-lg text-ink">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-moss/15 text-moss"
                  >
                    <Plus size={18} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 pb-5 leading-relaxed text-ink2">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}