import type { AmenityKey } from "./amenities";

export type Room = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  capacity: number;
  bedType: string;
  size: string;
  bath: string;
  pricePerNight: number; // in INR
  amenities: AmenityKey[];
  highlights: string[];
  images: string[]; // paths under /public
};

/**
 * PLACEHOLDER rooms. The property is a family house with a kitchen and
 * 3 rooms, each with its own attached bathroom. Replace names, text,
 * prices and images with the real ones.
 */
export const rooms: Room[] = [
  {
    slug: "deodar-room",
    name: "Deodar Room",
    tagline: "Valley-facing room with a private balcony",
    description:
      "The biggest room in the house, made for couples and small families. Wake up to layers of blue hills from a king-size bed, then take your chai out to the private balcony.",
    capacity: 3,
    bedType: "King bed + single bed",
    size: "300 sq ft",
    bath: "Attached bathroom with 24x7 hot water",
    pricePerNight: 3200,
    amenities: ["attached-bath", "view", "balcony", "wifi", "hot-water", "heater"],
    highlights: ["Private balcony", "Best sunrise view", "Room for a small family"],
    images: ["/images/place-1.svg", "/images/place-2.svg"],
  },
  {
    slug: "pine-room",
    name: "Pine Room",
    tagline: "Bright double room facing the pine forest",
    description:
      "A calm, sunny room with a big window onto the pines. Simple, spotless and made for slow mornings, on the quiet side of the house.",
    capacity: 2,
    bedType: "Queen bed",
    size: "240 sq ft",
    bath: "Attached bathroom with 24x7 hot water",
    pricePerNight: 2400,
    amenities: ["attached-bath", "view", "wifi", "hot-water", "heater"],
    highlights: ["Forest-facing window", "Reading nook", "Quietest room"],
    images: ["/images/place-3.svg", "/images/place-4.svg"],
  },
  {
    slug: "garden-room",
    name: "Garden Room",
    tagline: "Ground-floor room that opens onto the lawn",
    description:
      "A ground-floor room with a door straight onto the lawn, so there are no stairs to climb. A good pick for families with kids and for older guests.",
    capacity: 3,
    bedType: "Double bed + extra mattress",
    size: "260 sq ft",
    bath: "Attached bathroom with 24x7 hot water",
    pricePerNight: 2800,
    amenities: ["attached-bath", "garden", "wifi", "hot-water", "heater", "parking"],
    highlights: ["No stairs", "Opens onto the lawn", "Easy for kids and elders"],
    images: ["/images/place-6.svg", "/images/place-7.svg"],
  },
];

/** For groups and families who want the whole house to themselves. */
export const house = {
  name: "The Whole House",
  tagline: "All three rooms, the kitchen and the lawn, just for your group",
  description:
    "Coming as a family or a group of friends? Book the entire house and have it all to yourselves, with the kitchen, living room and garden included.",
  capacity: 8,
  bedrooms: 3,
  pricePerNight: 7200,
  amenities: ["attached-bath", "kitchen", "view", "wifi", "hot-water", "heater"] as AmenityKey[],
  images: ["/images/place-1.svg", "/images/place-3.svg", "/images/place-6.svg"],
  includes: [
    "3 attached bathrooms",
    "Home kitchen",
    "Living room",
    "Garden & parking",
  ],
  kitchenNote:
    "Meals are cooked fresh in our home kitchen, on request. Just tell us what you like when you enquire.",
};

export const getRoom = (slug: string) => rooms.find((r) => r.slug === slug);
export const minPrice = Math.min(...rooms.map((r) => r.pricePerNight));
