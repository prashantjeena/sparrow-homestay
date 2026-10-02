"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { site } from "@/data/site";
import { generalEnquiry, whatsappLink } from "@/lib/whatsapp";
import MoodToggle from "./MoodToggle";

const links = [
  { href: "#rooms", label: "Rooms" },
  { href: "#gallery", label: "Gallery" },
  { href: "#nearby", label: "Explore" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu with Escape, or when the screen grows to desktop size.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled || open
          ? "border-line bg-paper/90 py-3 backdrop-blur-md"
          : "border-transparent py-5"
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4">
        <a href="#top" className="font-display text-xl font-semibold text-ink">
          {site.name}
        </a>

        <nav className="font-display text-lg font-semibold text-ink sm:text-xl">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <MoodToggle />
          <a
            href={whatsappLink(generalEnquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-cream transition hover:scale-105 hover:bg-moss"
          >
            <MessageCircle size={16} />
            <span className="hidden sm:inline">Enquire</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:bg-paper2 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="container-x lg:hidden"
          >
            <ul className="flex flex-col pb-2 pt-3">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line/60 py-3 font-display text-lg text-ink transition hover:pl-2 hover:text-moss"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}