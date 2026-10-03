import { useId, type CSSProperties } from "react";
import { BIRD, LOCK, TAG_PATH, WORD_PATH } from "./logo-paths";

/** The sparrow, drawn in a 100 x 80 box with its feet at y = 68. */
function Bird({
  x,
  y,
  w,
  wing = "var(--lantern)",
  eye = "var(--paper)",
}: {
  x: number;
  y: number;
  w: number;
  wing?: string;
  eye?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${w / 100})`}>
      <g fill="currentColor">
        <ellipse cx="50" cy="44" rx="27" ry="16" transform="rotate(-16 50 44)" />
        <circle cx="73" cy="28" r="12.5" />
        <path d="M30 52 3 68l8 5 27-14z" />
        <path d="m84 25 12 4.5L84 34z" />
        <path d="M46 56h2.4v12H46zM55 55h2.4v13H55z" />
      </g>
      <path d="M34 42Q50 30 68 43Q52 55 34 42Z" fill={wing} />
      <circle cx="77" cy="26" r="2.4" fill={eye} />
    </g>
  );
}

/** "Sparrow" with the bird perched on the w. Follows the sunrise / dusk theme. */
export function Wordmark({
  compact = false,
  tone = "auto",
  className = "",
}: {
  /** Drops the small HOMESTAY line, for tight spaces like the navbar. */
  compact?: boolean;
  /** "light" is the cream version for dark backgrounds that stay dark in both themes (the footer). */
  tone?: "auto" | "light";
  className?: string;
}) {
  const h = compact ? LOCK.compactH : LOCK.h;
  const light = tone === "light";
  const lightStyle: CSSProperties | undefined = light
    ? ({
        color: "#f6f0e1",
        "--paper": "#1f3a2e",
        "--moss": "#a3b18a",
        "--lantern": "#e9b44c",
      } as CSSProperties)
    : undefined;
  return (
    <svg
      viewBox={`0 0 ${LOCK.w} ${h}`}
      className={`${light ? "" : "text-ink"} ${className}`}
      style={lightStyle}
      role="img"
      aria-label="Sparrow Homestay"
    >
      <path d={WORD_PATH} fill="currentColor" />
      {!compact && <path d={TAG_PATH} fill="var(--moss)" />}
      <Bird {...BIRD} />
    </svg>
  );
}

/** Round badge: sparrow on a peak with the sun behind. Same in both themes. */
export function Badge({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Sparrow Homestay">
      <defs>
        <clipPath id={id}>
          <circle cx="60" cy="60" r="56" />
        </clipPath>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#1f3a2e" />
      <g clipPath={`url(#${id})`}>
        <circle cx="60" cy="82" r="24" fill="#e9b44c" />
        <path d="M0 120V92l24-24 20 16 24-26 26 28 14-10 12 16v28z" fill="#4a6b3f" />
        <path d="M0 120v-16l30-14 28 16 30-12 32 12v14z" fill="#2f4d3a" />
      </g>
      <g style={{ color: "#f6f0e1" }}>
        <g transform="translate(46 30) scale(0.42)">
          <g fill="currentColor">
            <ellipse cx="50" cy="44" rx="27" ry="16" transform="rotate(-16 50 44)" />
            <circle cx="73" cy="28" r="12.5" />
            <path d="M30 52 3 68l8 5 27-14z" />
            <path d="m84 25 12 4.5L84 34z" />
            <path d="M46 56h2.4v12H46zM55 55h2.4v13H55z" />
          </g>
          <path d="M34 42Q50 30 68 43Q52 55 34 42Z" fill="#e9b44c" />
          <circle cx="77" cy="26" r="2.4" fill="#1f3a2e" />
        </g>
      </g>
      <circle cx="60" cy="60" r="55" fill="none" stroke="var(--moss)" strokeWidth="2.5" />
    </svg>
  );
}

/** Navbar logo: round badge on phones, compact wordmark from tablet up. */
export default function Logo() {
  return (
    <a href="#top" aria-label="Sparrow Homestay, back to top" className="flex items-center">
      <Badge className="h-10 w-10 sm:hidden" />
      <Wordmark compact className="hidden h-10 w-auto sm:block" />
    </a>
  );
}
