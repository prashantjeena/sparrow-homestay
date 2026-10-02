import {
  Wifi,
  ShowerHead,
  Mountain,
  Flame,
  Coffee,
  Utensils,
  Car,
  TreePine,
  Tv,
  PawPrint,
  Zap,
  Sun,
  Bath,
  CookingPot,
  type LucideIcon,
} from "lucide-react";

export type AmenityKey =
  | "attached-bath"
  | "kitchen"
  | "wifi"
  | "hot-water"
  | "view"
  | "balcony"
  | "heater"
  | "breakfast"
  | "meals"
  | "parking"
  | "garden"
  | "tv"
  | "pets"
  | "power-backup";

export const amenities: Record<AmenityKey, { label: string; icon: LucideIcon }> = {
  "attached-bath": { label: "Attached bathroom", icon: Bath },
  kitchen: { label: "Home kitchen", icon: CookingPot },
  wifi: { label: "Fast Wi-Fi", icon: Wifi },
  "hot-water": { label: "24x7 hot water", icon: ShowerHead },
  view: { label: "Mountain views", icon: Mountain },
  balcony: { label: "Private balcony", icon: Sun },
  heater: { label: "Room heater & bonfire", icon: Flame },
  breakfast: { label: "Breakfast included", icon: Coffee },
  meals: { label: "Home-cooked meals", icon: Utensils },
  parking: { label: "Free parking", icon: Car },
  garden: { label: "Kitchen garden", icon: TreePine },
  tv: { label: "Smart TV", icon: Tv },
  pets: { label: "Pet friendly", icon: PawPrint },
  "power-backup": { label: "Power backup", icon: Zap },
};

/** Shown in the amenity grid on the home page. */
export const featuredAmenities: AmenityKey[] = [
  "view",
  "attached-bath",
  "kitchen",
  "meals",
  "wifi",
  "hot-water",
  "heater",
  "parking",
  "garden",
  "power-backup",
];
