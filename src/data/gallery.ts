export type GalleryItem = {
  src: string;
  alt: string;
  category: "Rooms" | "Views" | "Food" | "Around";
  /** controls the tile shape in the grid */
  shape: "tall" | "wide" | "square";
};

/**
 * PLACEHOLDER images, each one prints its own file name. See public/images/README.md for the full list.
 * To swap one: put your photo in the same folder and change the extension here (.svg -> .webp or .jpg).
 * The shape decides the tile: wide = 1600x1000, tall = 1000x1400, square = 1200x1200.
 */
export const gallery: GalleryItem[] = [
  { src: "/images/gallery/gallery-01-views-valley-sunrise.svg", alt: "Valley at sunrise", category: "Views", shape: "wide" },
  { src: "/images/gallery/gallery-02-rooms-pine-room.svg", alt: "Pine Room", category: "Rooms", shape: "tall" },
  { src: "/images/gallery/gallery-03-views-balcony-golden-hour.svg", alt: "Balcony at golden hour", category: "Views", shape: "square" },
  { src: "/images/gallery/gallery-04-rooms-deodar-room.svg", alt: "Deodar Room", category: "Rooms", shape: "square" },
  { src: "/images/gallery/gallery-05-food-home-cooked-dinner.svg", alt: "Home-cooked dinner", category: "Food", shape: "wide" },
  { src: "/images/gallery/gallery-06-rooms-garden-room-lawn.svg", alt: "Garden Room and lawn", category: "Rooms", shape: "tall" },
  { src: "/images/gallery/gallery-07-around-forest-trail.svg", alt: "Forest trail", category: "Around", shape: "square" },
  { src: "/images/gallery/gallery-08-around-evening-bonfire.svg", alt: "Evening bonfire", category: "Around", shape: "wide" },
];

export const galleryCategories = ["All", "Rooms", "Views", "Food", "Around"] as const;
