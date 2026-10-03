// Generates labelled placeholder SVGs into public/images/<folder>/ plus public/images/README.md.
// Every placeholder prints its own file name, so you can see which slot it fills.
// Run: node scripts/make-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const SIZES = {
  landscape: { w: 1600, h: 1200, label: "4:3 landscape", px: "1600 x 1200" },
  wide: { w: 1600, h: 1000, label: "wide landscape", px: "1600 x 1000" },
  tall: { w: 1000, h: 1400, label: "tall portrait", px: "1000 x 1400" },
  square: { w: 1200, h: 1200, label: "square", px: "1200 x 1200" },
  collage: { w: 1200, h: 1350, label: "near-square portrait", px: "1200 x 1350" },
};

// file (no extension) | shape | where it shows up | what to photograph
const SLOTS = [
  ["rooms/deodar-room-1", "landscape", "Room card (main photo)", "Deodar Room, the best wide shot of the bed and window"],
  ["rooms/deodar-room-2", "landscape", "Room card (shows on hover)", "Deodar Room, a second angle or the bathroom"],
  ["rooms/pine-room-1", "landscape", "Room card (main photo)", "Pine Room, the best wide shot of the bed and window"],
  ["rooms/pine-room-2", "landscape", "Room card (shows on hover)", "Pine Room, a second angle or the bathroom"],
  ["rooms/garden-room-1", "landscape", "Room card (main photo)", "Garden Room, the best wide shot of the bed and window"],
  ["rooms/garden-room-2", "landscape", "Room card (shows on hover)", "Garden Room, a second angle or the bathroom"],
  ["house/whole-house-1", "collage", "Whole house card (big photo on the left)", "The house from outside, or the main living space"],
  ["house/whole-house-2", "collage", "Whole house card (small photo, top right)", "The kitchen"],
  ["house/whole-house-3", "collage", "Whole house card (small photo, bottom right)", "The balcony, lawn or sitting area"],
  ["gallery/gallery-01-views-valley-sunrise", "wide", "Gallery, category Views", "The valley at sunrise"],
  ["gallery/gallery-02-rooms-pine-room", "tall", "Gallery, category Rooms", "Pine Room, portrait shot"],
  ["gallery/gallery-03-views-balcony-golden-hour", "square", "Gallery, category Views", "The balcony at golden hour"],
  ["gallery/gallery-04-rooms-deodar-room", "square", "Gallery, category Rooms", "Deodar Room, a detail or corner"],
  ["gallery/gallery-05-food-home-cooked-dinner", "wide", "Gallery, category Food", "A home-cooked dinner on the table"],
  ["gallery/gallery-06-rooms-garden-room-lawn", "tall", "Gallery, category Rooms", "Garden Room with the lawn, portrait shot"],
  ["gallery/gallery-07-around-forest-trail", "square", "Gallery, category Around", "The forest trail near the house"],
  ["gallery/gallery-08-around-evening-bonfire", "wide", "Gallery, category Around", "An evening bonfire"],
];

const palettes = [
  ["#f6d3a0", "#f2b07e", "#a9bd9c", "#7f9d73", "#4a6b3f", "#1f3a2e"],
  ["#cfe3d0", "#a9c9b0", "#8fb08f", "#5f8a63", "#3e6a4a", "#1f3a2e"],
  ["#f7c98b", "#e98f5f", "#b39ab0", "#8a7a9b", "#4b5a5a", "#25352f"],
  ["#dbe8d4", "#b8d3b0", "#93b58b", "#6a9161", "#456e45", "#233f2f"],
  ["#f4e1b5", "#e7b884", "#c2b487", "#8f9f6a", "#5d7a48", "#2a4632"],
  ["#c9d8e6", "#9fbcd3", "#7fa0a9", "#58827f", "#3a6558", "#1e3b31"],
  ["#f5d0a9", "#e8a678", "#c19a7e", "#8d8a62", "#56703f", "#24402c"],
  ["#2a3358", "#5a4a7a", "#7a6a86", "#46596b", "#2c4740", "#14231e"],
];

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ridge(rand, baseY, amp, steps, color) {
  const w = 1200, h = 800;
  let d = `M0 ${h} L0 ${baseY}`;
  for (let i = 1; i <= steps; i++) d += ` L${((w / steps) * i).toFixed(0)} ${(baseY - rand() * amp).toFixed(0)}`;
  return `<path d="${d} L${w} ${h} Z" fill="${color}" stroke-linejoin="round"/>`;
}

function pines(rand, y, color, n) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * 1200, s = 26 + rand() * 40;
    out += `<path d="M${x.toFixed(0)} ${y} l${-s / 2} ${s * 1.6} h${s} z M${x.toFixed(0)} ${(y + s * 0.6).toFixed(0)} l${-s * 0.62} ${s * 1.4} h${s * 1.24} z" fill="${color}" transform="translate(0 ${(-s * 0.8).toFixed(0)})"/>`;
  }
  return out;
}

function scene(i, night) {
  const p = palettes[night ? 7 : i % 7];
  const rand = rng(i * 97 + 13);
  const sunX = 200 + rand() * 800;
  return `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs>
<rect width="1200" height="800" fill="url(#g)"/>
<circle cx="${sunX.toFixed(0)}" cy="${(200 + rand() * 120).toFixed(0)}" r="${night ? 46 : 70}" fill="${night ? "#f6e7b8" : "#fff3cf"}" opacity="${night ? 0.95 : 0.85}"/>
${night ? Array.from({ length: 40 }, () => `<circle cx="${(rand() * 1200).toFixed(0)}" cy="${(rand() * 380).toFixed(0)}" r="${(rand() * 2 + 0.6).toFixed(1)}" fill="#fff" opacity="0.8"/>`).join("") : ""}
${ridge(rand, 470, 200, 9, p[2])}${ridge(rand, 560, 170, 8, p[3])}${ridge(rand, 650, 130, 10, p[4])}${pines(rand, 700, p[5], 22)}
<rect y="740" width="1200" height="60" fill="${p[5]}"/>`;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function label(w, h, file, what, size) {
  const name = file.split("/").pop();
  const l1 = "REPLACE ME";
  const l3 = what;
  const l4 = `${size.label} · ${size.px} px`;
  const f2 = Math.min(w * 0.062, (w * 0.86) / (name.length * 0.58));
  const f1 = w * 0.04, f3 = Math.min(w * 0.032, (w * 0.86) / (l3.length * 0.52)), f4 = w * 0.03;
  const gap = w * 0.022;
  const boxH = f1 + f2 + f3 + f4 + gap * 5;
  const boxW = w * 0.9;
  const x = w / 2, y0 = h / 2 - boxH / 2;
  let y = y0 + gap + f1;
  const line = (t, f, fill, weight) => {
    const out = `<text x="${x}" y="${y.toFixed(0)}" font-size="${f.toFixed(0)}" fill="${fill}" font-weight="${weight}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif">${esc(t)}</text>`;
    y += f + gap;
    return out;
  };
  return `<rect x="${(w * 0.05).toFixed(0)}" y="${y0.toFixed(0)}" width="${boxW.toFixed(0)}" height="${boxH.toFixed(0)}" rx="${(w * 0.025).toFixed(0)}" fill="#14231e" opacity="0.82"/>
${line(l1, f1, "#e9b44c", 700)}${line(name, f2, "#ffffff", 700)}${line(l3, f3, "#f0e8d2", 400)}${line(l4, f4, "#a9bd9c", 400)}`;
}

SLOTS.forEach(([file, shape, , what], i) => {
  const size = SIZES[shape];
  const night = file.includes("bonfire");
  const dir = `public/images/${file.split("/")[0]}`;
  mkdirSync(dir, { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.w} ${size.h}">
<svg width="${size.w}" height="${size.h}" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">${scene(i, night)}</svg>
${label(size.w, size.h, file, what, size)}
</svg>`;
  writeFileSync(`public/images/${file}.svg`, svg);
});

// ---------- README with every slot ----------
const rows = SLOTS.map(([file, shape, where, what]) => {
  const s = SIZES[shape];
  return `| \`${file}.svg\` | ${where} | ${s.label}, ${s.px} | ${what} |`;
}).join("\n");
writeFileSync(
  "public/images/README.md",
  `# Photo slots

Every picture on the site is a placeholder with its own file name printed on it.
Replace each one with a real photo.

## How to replace a photo

1. Export your photo as **WebP** (or JPG), about the size shown below, and under ~250 KB.
2. Put it in the same folder with the same name, for example \`rooms/deodar-room-1.webp\`.
3. Open \`src/data/rooms.ts\` or \`src/data/gallery.ts\` and change \`.svg\` to \`.webp\` in that one path.
4. Delete the old placeholder \`.svg\`.

| File | Where it shows up | Shape and size | What to photograph |
| --- | --- | --- | --- |
${rows}
| \`Host.png\` (in \`public/images/\`) | Meet your host section | portrait 4:5, at least 800 x 1000 | A friendly portrait of the host, face in the top half |

Tips: shoot landscape for rooms, use daylight, keep the camera level, and never upscale a small photo.
`,
);
console.log(`done: ${SLOTS.length} placeholders`);
