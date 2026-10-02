export type Place = {
  id: string;
  name: string;
  type: "Temple" | "Viewpoint" | "Trek" | "Village" | "Market" | "Water";
  distance: string;
  time: string;
  blurb: string;
  /** position on the stylised map, 0-100 */
  x: number;
  y: number;
};

/** PLACEHOLDER places. Replace with real nearby spots and distances. */
export const nearby: Place[] = [
  {
    id: "temple",
    name: "Old Shiva Temple",
    type: "Temple",
    distance: "3 km",
    time: "10 min drive",
    blurb: "A quiet stone temple in a deodar grove. Best in the early morning when the bells start.",
    x: 30,
    y: 38,
  },
  {
    id: "viewpoint",
    name: "Sunrise Point",
    type: "Viewpoint",
    distance: "1.5 km",
    time: "25 min walk",
    blurb: "A short uphill walk to a 270° view of the snow peaks. Leave by 5:30 AM in winter.",
    x: 66,
    y: 22,
  },
  {
    id: "trek",
    name: "Pine Ridge Trail",
    type: "Trek",
    distance: "Starts at the gate",
    time: "2-3 hr loop",
    blurb: "An easy forest loop with a tea stop halfway. We can pack a picnic for you.",
    x: 48,
    y: 56,
  },
  {
    id: "waterfall",
    name: "Hidden Waterfall",
    type: "Water",
    distance: "6 km",
    time: "20 min drive + 15 min walk",
    blurb: "A small seasonal fall that is at its best after the monsoon.",
    x: 78,
    y: 62,
  },
  {
    id: "village",
    name: "Old Village Walk",
    type: "Village",
    distance: "2 km",
    time: "40 min walk",
    blurb: "Stone houses, apple orchards and friendly hellos. Ask us for the loop route.",
    x: 20,
    y: 68,
  },
  {
    id: "market",
    name: "Town Market",
    type: "Market",
    distance: "12 km",
    time: "30 min drive",
    blurb: "Woollens, local honey and everything you forgot to pack.",
    x: 58,
    y: 82,
  },
];
