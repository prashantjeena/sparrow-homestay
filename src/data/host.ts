import { site } from "@/data/site";

/**
 * Everything for the "Meet your host" section lives here.
 * The bio, languages and tips are SAMPLE text. Replace them with your own.
 */
export const host = {
  name: "Dheeraj Singh Negi",
  role: "Your host & head chef",
  /** Photo lives in public/images/. If the file is missing, initials are shown instead. */
  photo: "/images/Host.png",
  since: 2020,
  languages: ["Hindi", "English", "Kumaoni"],

  /**
   * The real number. Not wired into any WhatsApp link yet, the site still uses
   * site.contact.whatsapp for enquiries. When ready, copy it there (digits only, 91 first).
   */
  phone: "+91 81267 28472",

  bio: [
    `Namaste! I'm Dheeraj. I grew up in these hills, and in 2020 we opened our home to guests so more people could slow down the way we do here.`,
    `You'll find me on the balcony with the morning chai, in the kitchen cooking dinner from what's growing in our garden, or pointing someone towards the best sunset spot. Come as a guest, leave feeling like family.`,
  ],

  /** The little "ask me" button under the bio. */
  enquiry: `Hi Dheeraj! I'm planning a trip to ${site.name} and have a question about the stay.`,

  /** Sample tips, swap the icon names for any lucide icon you add in Host.tsx. */
  tips: [
    {
      icon: "sunrise",
      title: "Sunrise point",
      text: "A 15-minute walk up behind the house. Go at 5:30 AM and carry a flask of chai.",
    },
    {
      icon: "coffee",
      title: "The best chai stall",
      text: "Ask for the roadside stall at the bend. Their bun maska with ginger tea is a local favourite.",
    },
    {
      icon: "trail",
      title: "Easy forest walk",
      text: "A gentle pine trail, about an hour round trip. Good for families and slow mornings.",
    },
    {
      icon: "market",
      title: "Village market day",
      text: "Fresh vegetables, local honey and woollens. Best in the morning before it gets busy.",
    },
  ],
} as const;

export type HostTipIcon = (typeof host.tips)[number]["icon"];
