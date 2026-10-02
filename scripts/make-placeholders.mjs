// Generates scenic placeholder SVGs into public/images. Replace them with real photos (WebP) later.
import { writeFileSync } from "node:fs";

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
  for (let i = 1; i <= steps; i++) {
    const x = (w / steps) * i;
    const y = baseY - rand() * amp;
    d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
  }
  d += ` L${w} ${h} Z`;
  return `<path d="${d}" fill="${color}" stroke-linejoin="round"/>`;
}

function pines(rand, y, color, n) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const x = rand() * 1200;
    const s = 26 + rand() * 40;
    out += `<path d="M${x.toFixed(0)} ${y} l${-s / 2} ${s * 1.6} h${s} z M${x.toFixed(0)} ${(y + s * 0.6).toFixed(0)} l${-s * 0.62} ${s * 1.4} h${s * 1.24} z" fill="${color}" transform="translate(0 ${(-s * 0.8).toFixed(0)})"/>`;
  }
  return out;
}

palettes.forEach((p, i) => {
  const rand = rng(i * 97 + 13);
  const night = i === 7;
  const sunX = 200 + rand() * 800;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs>
<rect width="1200" height="800" fill="url(#g)"/>
<circle cx="${sunX.toFixed(0)}" cy="${(200 + rand() * 120).toFixed(0)}" r="${night ? 46 : 70}" fill="${night ? "#f6e7b8" : "#fff3cf"}" opacity="${night ? 0.95 : 0.85}"/>
${night ? Array.from({ length: 40 }, () => `<circle cx="${(rand() * 1200).toFixed(0)}" cy="${(rand() * 380).toFixed(0)}" r="${(rand() * 2 + 0.6).toFixed(1)}" fill="#fff" opacity="0.8"/>`).join("") : ""}
${ridge(rand, 470, 200, 9, p[2])}
${ridge(rand, 560, 170, 8, p[3])}
${ridge(rand, 650, 130, 10, p[4])}
${pines(rand, 700, p[5], 22)}
<rect y="740" width="1200" height="60" fill="${p[5]}"/>
</svg>`;
  writeFileSync(`public/images/place-${i + 1}.svg`, svg);
});
console.log("done");
