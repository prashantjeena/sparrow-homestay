"use client";

import type { ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { BedDouble, CookingPot, MessageCircle, Users } from "lucide-react";
import { amenities, type AmenityKey } from "@/data/amenities";
import { house, rooms, type Room } from "@/data/rooms";
import { houseEnquiry, roomEnquiry, whatsappLink } from "@/lib/whatsapp";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const ease = [0.22, 1, 0.36, 1] as const;

/** Scroll-in reveal plus a soft 3D tilt that follows the mouse. */
function Tilt({
  index,
  dark = false,
  children,
}: {
  index: number;
  dark?: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion() ?? false;

  // Pointer position inside the card, from -0.5 to 0.5.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          ...(reduce ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" as const }),
          ...(dark ? { background: "var(--m5)", color: "#f6f0e1" } : {}),
        }}
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
        className={`group flex h-full flex-col overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/15 ${
          dark ? "" : "theme-t border border-line bg-card"
        }`}
      >
        {children}
      </motion.div>
    </motion.article>
  );
}

function AmenityIcons({ keys, dark = false }: { keys: AmenityKey[]; dark?: boolean }) {
  return (
    <div className={`mb-6 mt-5 flex flex-wrap gap-2 ${dark ? "text-lantern" : "text-moss"}`}>
      {keys.slice(0, 5).map((key) => {
        const { label, icon: Icon } = amenities[key];
        return (
          <span
            key={key}
            title={label}
            aria-label={label}
            className={`grid h-8 w-8 place-items-center rounded-full border ${
              dark ? "border-cream/25" : "border-line"
            }`}
          >
            <Icon size={16} />
          </span>
        );
      })}
    </div>
  );
}

function RoomCard({ room, index }: { room: Room; index: number }) {
  return (
    <Tilt index={index}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.images[0]}
          alt={room.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {room.images[1] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={room.images[1]}
            alt={`${room.name}, another view`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
          Attached bathroom
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-forest px-3.5 py-1.5 text-sm font-medium text-cream shadow-lg">
          {inr(room.pricePerNight)}
          <span className="text-cream/70"> / night</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-semibold text-ink">{room.name}</h3>
        <p className="mt-1 text-ink2">{room.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink2">
          <span className="inline-flex items-center gap-1.5">
            <Users size={16} /> Sleeps {room.capacity}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble size={16} /> {room.bedType}
          </span>
        </div>

        <ul className="mt-4 space-y-1.5 text-sm text-ink">
          {room.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lantern" />
              {h}
            </li>
          ))}
        </ul>

        <AmenityIcons keys={room.amenities} />

        <a
          href={whatsappLink(roomEnquiry(room.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition hover:scale-[1.03] hover:bg-moss"
        >
          <MessageCircle size={16} />
          Ask about this room
        </a>
      </div>
    </Tilt>
  );
}

/** The fourth option: the whole house for one group. */
function HouseCard({ index }: { index: number }) {
  return (
    <Tilt index={index} dark>
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* collage: one big photo and two small ones */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
          {house.images.map((src, i) => (
            <div key={src} className={`overflow-hidden ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-lantern px-3 py-1 text-xs font-semibold text-[#22301f]">
          Whole house
        </span>
        <span className="absolute bottom-4 right-4 rounded-full bg-lantern px-3.5 py-1.5 text-sm font-semibold text-[#22301f] shadow-lg">
          {inr(house.pricePerNight)}
          <span className="font-normal opacity-70"> / night</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-semibold">{house.name}</h3>
        <p className="mt-1 text-cream/80">{house.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cream/75">
          <span className="inline-flex items-center gap-1.5">
            <Users size={16} /> Up to {house.capacity} guests
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BedDouble size={16} /> {house.bedrooms} bedrooms
          </span>
        </div>

        <ul className="mt-4 space-y-1.5 text-sm">
          {house.includes.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lantern" />
              {item}
            </li>
          ))}
        </ul>

        <AmenityIcons keys={house.amenities} dark />

        <a
          href={whatsappLink(houseEnquiry)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-lantern px-6 py-3 text-sm font-semibold text-[#22301f] transition hover:scale-[1.03]"
        >
          <MessageCircle size={16} />
          Ask about the house
        </a>
      </div>
    </Tilt>
  );
}

export default function Rooms() {
  return (
    <section id="rooms" className="container-x scroll-mt-24 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-moss">Where you'll sleep</p>
        <h2 className="mt-3 text-balance text-4xl font-semibold text-ink md:text-5xl">
          Three rooms, one warm house
        </h2>
        <p className="mt-4 text-lg text-ink2">
          Every room has its own attached bathroom, and the kitchen is the heart of the home.
          Pick a room, or take the whole house.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
        {rooms.map((room, i) => (
          <RoomCard key={room.slug} room={room} index={i} />
        ))}
        <HouseCard index={rooms.length} />
      </div>

      <p className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-ink2">
        <CookingPot size={16} className="shrink-0 text-moss" />
        {house.kitchenNote}
      </p>
    </section>
  );
}
