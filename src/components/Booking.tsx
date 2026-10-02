"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MessageCircle, Minus, Plus } from "lucide-react";
import { house, minPrice, rooms } from "@/data/rooms";
import {
  blockedNights,
  calendarId,
  fetchBookedEvents,
  liveAvailability,
  stayIsBlocked,
  type BookedEvent,
} from "@/lib/availability";
import { nightsBetween, pretty, prettyShort, toISO } from "@/lib/dates";
import { site } from "@/data/site";
import { bookingEnquiry, whatsappLink } from "@/lib/whatsapp";
import RangePicker from "./RangePicker";

const ease = [0.22, 1, 0.36, 1] as const;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const steps = [
  { title: "Check the calendar", text: "See which days are free." },
  { title: "Send your plan", text: "Pick room, dates and guests, then tap send." },
  { title: "We confirm on WhatsApp", text: "We reply personally and hold your dates." },
];

const field =
  "w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-ink outline-none transition focus:border-lantern focus:ring-2 focus:ring-lantern/40";
const label = "mb-1.5 block text-xs uppercase tracking-[0.18em] text-ink2";

type Status = "idle" | "loading" | "ok" | "error";

export default function Booking() {
  const [today, setToday] = useState("");
  const [choice, setChoice] = useState("any"); // "any", "house" or a room slug
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [events, setEvents] = useState<BookedEvent[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  // Set after mount so server and client markup match.
  useEffect(() => {
    setToday(toISO(new Date()));
  }, []);

  // Load booked days from the Google Calendar.
  useEffect(() => {
    if (!liveAvailability) return;
    const controller = new AbortController();
    setStatus("loading");
    fetchBookedEvents(controller.signal)
      .then((list) => {
        setEvents(list);
        setStatus("ok");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("Could not load availability:", err);
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  const blocked = useMemo(() => blockedNights(choice, events), [choice, events]);

  // If a different room (or fresh data) makes the chosen dates unavailable, clear them.
  useEffect(() => {
    if (!checkIn) return;
    if (blocked.has(checkIn) || (checkOut && stayIsBlocked(checkIn, checkOut, blocked))) {
      setCheckIn("");
      setCheckOut("");
    }
  }, [blocked, checkIn, checkOut]);

  const room = rooms.find((r) => r.slug === choice);
  const isHouse = choice === "house";
  const stay = isHouse ? house.name : room ? room.name : "Any room (you suggest)";
  const capacity = isHouse ? house.capacity : room?.capacity;
  const maxGuests = isHouse ? house.capacity : 8;
  const nightly = isHouse ? house.pricePerNight : room?.pricePerNight;

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const valid = nights > 0;
  const total = nightly && valid ? nightly * nights : 0;
  const tooMany = capacity !== undefined && guests > capacity;

  const changeChoice = (next: string) => {
    setChoice(next);
    const cap = next === "house" ? house.capacity : rooms.find((r) => r.slug === next)?.capacity;
    if (cap !== undefined && guests > cap) setGuests(cap);
  };

  const href = valid
    ? whatsappLink(
        bookingEnquiry({
          stay,
          checkIn: pretty(checkIn),
          checkOut: pretty(checkOut),
          nights,
          guests,
          name,
        }),
      )
    : "";

  const calendarSrc = calendarId
    ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&ctz=${encodeURIComponent(site.booking.timezone)}&mode=MONTH&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&showNav=1&hl=en&bgcolor=%23fbf7ec`
    : null;

  const chips = [
    { id: "any", text: "Any room" },
    ...rooms.map((r) => ({ id: r.slug, text: r.name })),
    { id: "house", text: "Whole house" },
  ];

  return (
    <section id="book" className="theme-t bg-paper2 py-8 md:py-10">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-moss">Plan your stay</p>
          <h2 className="mt-2 text-balance text-3xl font-semibold text-ink md:text-4xl">
            Check availability
          </h2>
        </motion.div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Google Calendar, a quick look at the whole month */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease }}
            className="theme-t flex flex-col rounded-3xl border border-line bg-card p-5"
          >
            <h3 className="flex items-center gap-2 text-xl font-semibold text-ink">
              <CalendarDays size={20} className="text-moss" />
              Booked days
            </h3>

            {calendarSrc ? (
              <iframe
                src={calendarSrc}
                title="Availability calendar"
                loading="lazy"
                className="mt-3 h-[300px] w-full rounded-xl border border-line bg-white"
              />
            ) : (
              <div className="mt-3 grid min-h-[260px] flex-1 place-items-center rounded-xl border border-dashed border-line p-6 text-center">
                <div>
                  <CalendarDays size={32} className="mx-auto text-moss" />
                  <p className="mt-2 font-display text-lg text-ink">Calendar not connected yet</p>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-ink2">
                    Add a public Google Calendar ID in{" "}
                    <code className="rounded bg-paper2 px-1.5 py-0.5">src/data/site.ts</code>.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* enquiry form */}
          <motion.form
            onSubmit={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="theme-t rounded-3xl border border-line bg-card p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-ink">Send your plan</h3>
              {(checkIn || checkOut) && (
                <button
                  type="button"
                  onClick={() => {
                    setCheckIn("");
                    setCheckOut("");
                  }}
                  className="text-sm text-ink2 underline-offset-4 transition hover:text-ink hover:underline"
                >
                  Clear dates
                </button>
              )}
            </div>

            <div role="radiogroup" aria-label="What would you like?" className="mt-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={choice === c.id}
                  onClick={() => changeChoice(c.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] transition ${
                    choice === c.id
                      ? "border-forest bg-forest text-cream"
                      : "border-line text-ink hover:border-lantern"
                  }`}
                >
                  {c.text}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-paper p-3">
              {today ? (
                <RangePicker
                  today={today}
                  blocked={blocked}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onChange={(a, b) => {
                    setCheckIn(a);
                    setCheckOut(b);
                  }}
                />
              ) : (
                <div className="h-[300px]" aria-hidden />
              )}
            </div>

            <p className="mt-2 min-h-[1.25rem] text-xs text-ink2" aria-live="polite">
              {status === "loading" && "Checking live availability…"}
              {status === "error" &&
                "Couldn't load live dates just now. Pick any dates and we'll confirm on WhatsApp."}
              {status === "idle" &&
                !liveAvailability &&
                process.env.NODE_ENV !== "production" &&
                "Dev note: live availability is off. Add NEXT_PUBLIC_GCAL_API_KEY to .env.local and restart."}
            </p>

            {/* estimate */}
            <div className="mt-2 rounded-xl bg-paper2 px-4 py-2.5 text-sm text-ink2">
              {valid ? (
                <motion.div
                  key={`${choice}-${checkIn}-${checkOut}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-medium text-ink">
                    {prettyShort(checkIn)} → {prettyShort(checkOut)} · {nights}{" "}
                    {nights === 1 ? "night" : "nights"}
                  </p>
                  {total > 0 ? (
                    <p>
                      {inr(nightly ?? 0)} × {nights} ={" "}
                      <strong className="font-display text-lg text-ink">{inr(total)}</strong>{" "}
                      <span className="text-xs">estimate, final price on WhatsApp</span>
                    </p>
                  ) : (
                    <p className="text-xs">From {inr(minPrice)} a night, depending on the room.</p>
                  )}
                </motion.div>
              ) : checkIn ? (
                <p>
                  Check-in {prettyShort(checkIn)}. Now tap your check-out day.
                </p>
              ) : (
                <p>Tap a check-in day, then a check-out day.</p>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <span className={label}>Guests</span>
                <div className="flex items-center justify-between rounded-xl border border-line bg-paper px-2 py-1">
                  <button
                    type="button"
                    aria-label="Fewer guests"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink transition hover:bg-paper2"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium text-ink" aria-live="polite">
                    {guests}
                  </span>
                  <button
                    type="button"
                    aria-label="More guests"
                    onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
                    className="grid h-8 w-8 place-items-center rounded-lg text-ink transition hover:bg-paper2"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="name" className={label}>
                  Name <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="So we can say hello"
                  className={field}
                />
              </div>
            </div>

            {tooMany && (
              <p className="mt-3 rounded-xl bg-lantern/20 px-4 py-2.5 text-sm text-ink">
                {stay} sleeps up to {capacity}. Pick the whole house, or tell us on WhatsApp and
                we'll suggest a combination.
              </p>
            )}

            {valid ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-medium text-cream transition hover:scale-[1.02] hover:bg-moss"
              >
                <MessageCircle size={18} />
                Send enquiry on WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-forest/40 px-7 py-3.5 text-sm font-medium text-cream"
              >
                <MessageCircle size={18} />
                Pick your dates first
              </button>
            )}
          </motion.form>
        </div>

        {/* how it works */}
        <ol className="mt-10 grid gap-5 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="flex gap-4"
            >
              <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest text-lg text-cream">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-ink">{s.title}</p>
                <p className="text-sm text-ink2">{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
