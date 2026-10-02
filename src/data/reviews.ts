export type Review = {
  name: string;
  from: string;
  rating: number;
  text: string;
  source: "Google" | "Direct";
};

/** PLACEHOLDER reviews. Replace with real ones (with permission). */
export const reviews: Review[] = [
  {
    name: "Aarav & Meera",
    from: "Delhi",
    rating: 5,
    text: "Woke up to clouds below the balcony. The dal and rajma at dinner were better than any restaurant we tried in the hills.",
    source: "Google",
  },
  {
    name: "Riya S.",
    from: "Mumbai",
    rating: 5,
    text: "Felt like staying at a friend's house. The hosts gave us walking routes and timings that no app had.",
    source: "Direct",
  },
  {
    name: "The Kapoor family",
    from: "Chandigarh",
    rating: 5,
    text: "Kids loved the bonfire and the kitchen garden. Clean rooms, warm water, zero fuss.",
    source: "Google",
  },
  {
    name: "Nikhil V.",
    from: "Bengaluru",
    rating: 5,
    text: "Worked remotely for four days. Wi-Fi was solid and the view from the desk was unfair.",
    source: "Direct",
  },
  {
    name: "Sana & Imran",
    from: "Lucknow",
    rating: 4,
    text: "Peaceful, spotless and the parathas at breakfast were the highlight. The last stretch of road is steep, so plan for it.",
    source: "Google",
  },
  {
    name: "Tanvi P.",
    from: "Pune",
    rating: 5,
    text: "Stargazing from the balcony after dinner is something I'll remember for a long time.",
    source: "Direct",
  },
];
