import { rooms } from "@/data/rooms";
import { site } from "@/data/site";
import { addDays, toISO } from "./dates";

/*
 * Reads booked days from the owner's Google Calendar (public calendar + a free API key).
 *
 * How the owner marks bookings: add an all-day event for the nights guests sleep.
 *   "Booked"              -> blocks the whole house (every room)
 *   "Booked - Pine Room"  -> blocks only the Pine Room (and the whole-house option)
 * The last day of an all-day event is the check-out day, so the night before it is the
 * last one blocked and someone else can check in that same day.
 */

/** Set in .env.local. A public key is fine here, restrict it to your site in Google Cloud. */
const apiKey = process.env.NEXT_PUBLIC_GCAL_API_KEY ?? "";

/** The calendar ID. Can also come from NEXT_PUBLIC_GCAL_ID, otherwise site.ts is used. */
export const calendarId: string = process.env.NEXT_PUBLIC_GCAL_ID || site.booking.calendarId;

export const liveAvailability = Boolean(apiKey && calendarId);

/** An event whose title contains any of these words counts as a booking. Edit freely. */
const bookedWords = [
  "booked",
  "booking",
  "reserved",
  "occupied",
  "full",
  "blocked",
  "sold",
  "taken",
  "busy",
];

export type BookedEvent = {
  /** Every night (YYYY-MM-DD) the event covers. */
  nights: string[];
  /** Room slug when the title names one room, or null for the whole house. */
  target: string | null;
};

type GoogleEvent = {
  status?: string;
  summary?: string;
  transparency?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
};

const roomKey = (name: string) => name.toLowerCase().replace(/\s*room$/, "");

function roomNamedIn(summary: string): string | null {
  const s = summary.toLowerCase();
  return rooms.find((r) => s.includes(roomKey(r.name)))?.slug ?? null;
}

export function parseEvents(items: GoogleEvent[]): BookedEvent[] {
  const out: BookedEvent[] = [];

  for (const ev of items) {
    // Cancelled events, and events the owner marked "free", never block anything.
    if (ev.status === "cancelled" || ev.transparency === "transparent") continue;

    const summary = (ev.summary ?? "").trim();
    const target = summary ? roomNamedIn(summary) : null;
    const hasWord = bookedWords.some((w) => summary.toLowerCase().includes(w));
    // A calendar shared as "free/busy only" hides titles. A hidden title still means busy.
    if (summary && !hasWord && !target) continue;

    const start = ev.start?.date ?? ev.start?.dateTime?.slice(0, 10);
    let end = ev.end?.date ?? ev.end?.dateTime?.slice(0, 10);
    if (!start) continue;
    if (!end || end <= start) end = addDays(start, 1);

    const nights: string[] = [];
    for (let d = start; d < end && nights.length < 400; d = addDays(d, 1)) nights.push(d);
    out.push({ nights, target });
  }

  return out;
}

export async function fetchBookedEvents(signal?: AbortSignal): Promise<BookedEvent[]> {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const to = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  const params = new URLSearchParams({
    key: apiKey,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "500",
    timeMin: from.toISOString(),
    timeMax: to.toISOString(),
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    { signal },
  );
  if (!res.ok) throw new Error(`Google Calendar answered ${res.status}`);

  const data = (await res.json()) as { items?: GoogleEvent[] };
  return parseEvents(data.items ?? []);
}

/**
 * Nights that cannot be booked for the current choice:
 * "house" is blocked by any booking, a single room by its own bookings (or a whole-house one),
 * and "any" only when every room is taken.
 */
export function blockedNights(choice: string, events: BookedEvent[]): Set<string> {
  const perRoom = new Map(rooms.map((r) => [r.slug, new Set<string>()]));
  const anyBooking = new Set<string>();

  for (const ev of events) {
    for (const night of ev.nights) {
      anyBooking.add(night);
      perRoom.forEach((set, slug) => {
        if (ev.target === null || ev.target === slug) set.add(night);
      });
    }
  }

  if (choice === "house") return anyBooking;
  const single = perRoom.get(choice);
  if (single) return single;

  const everyRoomTaken = new Set<string>();
  anyBooking.forEach((night) => {
    if (Array.from(perRoom.values()).every((set) => set.has(night))) everyRoomTaken.add(night);
  });
  return everyRoomTaken;
}

/** True when any night of a stay (check-in up to the day before check-out) is blocked. */
export function stayIsBlocked(checkIn: string, checkOut: string, blocked: Set<string>) {
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) {
    if (blocked.has(d)) return true;
  }
  return false;
}

export { toISO };
