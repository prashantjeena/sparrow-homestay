"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { site } from "@/data/site";
import { generalEnquiry, whatsappLink } from "@/lib/whatsapp";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";

const ease = [0.22, 1, 0.36, 1] as const;

const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location.mapQuery)}`;
const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(site.location.mapQuery)}&output=embed`;

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-moss/15 text-moss">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-ink2">{label}</p>
        <div className="mt-0.5 text-base text-ink">{children}</div>
      </div>
    </li>
  );
}

/** A drawn map card. The real Google map only loads when someone asks for it. */
function MapCard() {
  const reduce = useReducedMotion() ?? false;
  const [live, setLive] = useState(false);

  return (
    <div className="theme-t relative min-h-[340px] overflow-hidden rounded-3xl border border-line bg-paper2 lg:h-full">
      {live ? (
        <iframe
          title={`Map showing ${site.name}`}
          src={mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <>
          <svg
            aria-hidden
            viewBox="0 0 600 450"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
          >
            <g fill="none" stroke="var(--moss)" strokeOpacity="0.28" strokeWidth="1.5">
              <path d="M-20 330C80 290 140 340 230 300S380 240 470 270 600 230 640 210" />
              <path d="M-20 360C90 325 150 372 240 335S390 280 480 308 600 270 640 252" />
              <path d="M-20 390C100 360 160 404 250 370S400 320 490 346 600 312 640 296" />
              <path d="M-20 250C60 215 130 250 210 205S340 150 430 178 560 140 640 118" />
              <path d="M-20 215C70 182 140 214 215 170S340 112 430 140 560 100 640 78" />
              <path d="M-20 180C80 150 150 178 222 135S345 76 432 104 560 62 640 40" />
            </g>
            <g fill="none" stroke="var(--paper)" strokeWidth="9" strokeLinecap="round">
              <path d="M-10 420C120 390 200 330 300 300S470 220 640 150" />
              <path d="M300 300C310 250 290 200 330 130S380 40 400 -10" strokeWidth="6" />
            </g>
            <g fill="none" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round">
              <path d="M-10 420C120 390 200 330 300 300S470 220 640 150" />
            </g>
          </svg>

          {/* Pin */}
          <div className="absolute left-[55%] top-[44%] -translate-x-1/2 -translate-y-1/2">
            {!reduce && (
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lantern/40"
                animate={{ scale: [0.6, 1.5], opacity: [0.7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-forest text-lantern shadow-lg shadow-black/20 ring-4 ring-paper">
              <MapPin size={22} />
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl border border-line bg-paper/90 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg leading-tight text-ink">{site.location.place}</p>
              <p className="text-sm text-ink2">
                {site.location.region} · {site.location.altitude} above sea level
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLive(true)}
                className="rounded-full border border-line px-4 py-2 text-sm text-ink transition hover:bg-paper2"
              >
                Show live map
              </button>
              <a
                href={mapsSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-medium text-cream transition hover:bg-moss"
              >
                <Navigation size={15} />
                Directions
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Contact() {
  const reduce = useReducedMotion() ?? false;
  const reveal = (delay = 0) => ({
    initial: reduce ? (false as const) : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section id="contact" className="container-x py-16 md:py-24">
      <div className="max-w-xl">
        <motion.p {...reveal()} className="text-xs uppercase tracking-[0.25em] text-moss">
          Contact
        </motion.p>
        <motion.h2 {...reveal(0.05)} className="font-display mt-3 text-4xl font-semibold text-ink md:text-5xl">
          Come say hello
        </motion.h2>
        <motion.p {...reveal(0.1)} className="mt-3 text-base leading-relaxed text-ink2">
          WhatsApp is the quickest way to reach us. Ask about dates, food, the road up, anything at all.
        </motion.p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <motion.div {...reveal(0.1)} className="space-y-6">
          <a
            href={whatsappLink(generalEnquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-3xl bg-forest p-6 text-cream transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20"
          >
            <span>
              <span className="block text-xs uppercase tracking-[0.2em] text-lantern">Fastest way to book</span>
              <span className="font-display mt-1 block text-2xl">Message us on WhatsApp</span>
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lantern text-forest transition group-hover:scale-110">
              <MessageCircle size={22} />
            </span>
          </a>

          <ul className="theme-t space-y-5 rounded-3xl border border-line bg-card p-6">
            <Row icon={<Phone size={18} />} label="Call">
              <a className="hover:text-moss" href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>
                {site.contact.phone}
              </a>
            </Row>
            <Row icon={<Mail size={18} />} label="Email">
              <a className="break-all hover:text-moss" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </Row>
            <Row icon={<MapPin size={18} />} label="Find us">
              {site.location.address}
            </Row>
            <Row icon={<Clock size={18} />} label="Check-in and check-out">
              Check-in from {site.times.checkIn}, check-out by {site.times.checkOut}
            </Row>
          </ul>

          <div className="flex items-center gap-3">
            <span className="text-sm text-ink2">Follow along</span>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:bg-paper2 hover:text-moss"
            >
              <InstagramIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:bg-paper2 hover:text-moss"
            >
              <FacebookIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </motion.div>

        <motion.div {...reveal(0.2)}>
          <MapCard />
        </motion.div>
      </div>
    </section>
  );
}
