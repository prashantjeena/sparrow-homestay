/**
 * Everything about the property lives here.
 * To reuse this template for another homestay, edit this file + rooms.ts and swap the images.
 * All values below are PLACEHOLDERS.
 */
export const site = {
  name: "The Sparrow Homestay",
  short: "Sparrow",
  tagline: "A quiet nest in the Kumaon hills",
  description:
    "A family-run homestay in the Kumaon hills of Uttarakhand. Home-cooked meals, mountain views and slow mornings. Enquire on WhatsApp to book your stay.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",

  location: {
    place: "Kumaon Hills",
    region: "Uttarakhand",
    country: "India",
    altitude: "1,850 m",
    address: "Village Placeholder, Kumaon Hills, Uttarakhand",
    mapQuery: "Kumaon, Uttarakhand, India",
  },

  contact: {
    whatsapp: "917302205494", // country code + number, no + or spaces
    phone: "+91 99999 99999",
    email: "hello@example.com",
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },

  times: { checkIn: "1:00 PM", checkOut: "11:00 AM" },

  /**
   * Availability comes from a public Google Calendar the owner keeps up to date:
   * add an all-day event on every booked day. Then paste its Calendar ID here
   * (Google Calendar > Settings > the calendar > Integrate calendar > Calendar ID).
   * In the calendar's sharing settings, tick "Make available to public" and choose
   * "See only free/busy (hide details)" so guests never see private details.
   */
  booking: {
    calendarId: "53d08b1e377998d9e5c615ccdd9ecb84c294b66a80d09a42c1741a2988f4a2c8@group.calendar.google.com" as string,
    timezone: "Asia/Kolkata",
  },

  host: {
    name: "Your Host",
    role: "Host & cook",
    bio: "We grew up in these hills and opened our home to guests so more people could slow down here. Expect chai on the balcony, dinner from our kitchen garden and honest tips on where to walk, eat and watch the sun set.",
  },

  stats: [
    { label: "Rooms", value: "3" },
    { label: "Above sea level", value: "1,850 m" },
    { label: "Guest rating", value: "4.9" },
    { label: "Years hosting", value: "6" },
  ],
} as const;

export type Site = typeof site;
