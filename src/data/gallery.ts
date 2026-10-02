export type GalleryItem = {
  src: string;
  alt: string;
  category: "Rooms" | "Views" | "Food" | "Around";
  /** controls the tile shape in the grid */
  shape: "tall" | "wide" | "square";
};

/** PLACEHOLDER images. Swap the files in /public/images and keep the same names, or edit the paths. */
export const gallery: GalleryItem[] = [
  { src: "/images/place-1.svg", alt: "Valley at sunrise", category: "Views", shape: "wide" },
  { src: "/images/place-2.svg", alt: "Pine Room", category: "Rooms", shape: "tall" },
  { src: "/images/place-3.svg", alt: "Balcony at golden hour", category: "Views", shape: "square" },
  { src: "/images/place-4.svg", alt: "Deodar Room", category: "Rooms", shape: "square" },
  { src: "/images/place-5.svg", alt: "Home-cooked dinner", category: "Food", shape: "wide" },
  { src: "/images/place-6.svg", alt: "Garden Room and lawn", category: "Rooms", shape: "tall" },
  { src: "/images/place-7.svg", alt: "Forest trail", category: "Around", shape: "square" },
  { src: "/images/place-8.svg", alt: "Evening bonfire", category: "Around", shape: "wide" },
];

export const galleryCategories = ["All", "Rooms", "Views", "Food", "Around"] as const;
