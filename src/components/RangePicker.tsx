"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, pretty, toDate, toISO } from "@/lib/dates";

type Props = {
  today: string;
  /** Nights that cannot be booked (YYYY-MM-DD). */
  blocked: Set<string>;
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
};

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS_AHEAD = 12;

/**
 * A small check-in / check-out calendar.
 * A blocked date means the NIGHT starting that day is taken, so it can't be a check-in day,
 * but it can still be a check-out day when the night before is free.
 */
export default function RangePicker({ today, blocked, checkIn, checkOut, onChange }: Props) {
  const [offset, setOffset] = useState(0); // months away from the current month

  const now = toDate(today);
  const view = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const monthKey = `${view.getFullYear()}-${view.getMonth()}`;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

  const cells: (string | null)[] = [
    ...Array.from({ length: view.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toISO(new Date(view.getFullYear(), view.getMonth(), i + 1)),
    ),
  ];

  // While choosing a check-out day, nothing beyond the next booked night can be picked.
  const choosingEnd = Boolean(checkIn && !checkOut);
  let lastCheckout = "";
  if (choosingEnd) {
    for (let d = checkIn, i = 0; i < 400; d = addDays(d, 1), i++) {
      if (blocked.has(d)) {
        lastCheckout = d;
        break;
      }
    }
  }

  const pick = (iso: string) => {
    if (choosingEnd && iso > checkIn) onChange(checkIn, iso);
    else onChange(iso, "");
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={offset === 0}
          onClick={() => setOffset((o) => o - 1)}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink transition hover:bg-paper2 disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="font-display text-lg text-ink" aria-live="polite">
          {view.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          aria-label="Next month"
          disabled={offset >= MONTHS_AHEAD}
          onClick={() => setOffset((o) => o + 1)}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink transition hover:bg-paper2 disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-wider text-ink2">
        {weekdays.map((w, i) => (
          <span key={i} className="py-1">
            {w}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-7 gap-y-0.5"
        >
          {cells.map((iso, i) => {
            if (!iso) return <span key={`gap-${i}`} />;

            const past = iso < today;
            const isBlocked = blocked.has(iso);
            const isStart = iso === checkIn;
            const isEnd = iso === checkOut;
            const inRange = Boolean(checkIn && checkOut && iso > checkIn && iso < checkOut);

            let disabled = past || isBlocked;
            if (choosingEnd && iso > checkIn) {
              disabled = lastCheckout !== "" && iso > lastCheckout;
            }

            let style = "text-ink hover:bg-paper2";
            if (isStart || isEnd) style = "bg-forest text-cream";
            else if (inRange) style = "bg-moss/25 text-ink";
            else if (isBlocked && !past) style = "bg-ink/5 text-ink2/50 line-through";
            else if (disabled) style = "text-ink2/35";

            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => pick(iso)}
                aria-pressed={isStart || isEnd}
                aria-label={`${pretty(iso)}${isBlocked ? ", booked" : ""}`}
                className={`relative h-9 rounded-lg text-sm transition ${style} ${
                  disabled ? "cursor-not-allowed" : ""
                } ${iso === today && !isStart && !isEnd ? "ring-1 ring-lantern" : ""}`}
              >
                {Number(iso.slice(8))}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink2">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-ink/10" /> Booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-forest" /> Your dates
        </span>
      </div>
    </div>
  );
}
