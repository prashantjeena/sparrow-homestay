"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Mood = "sunrise" | "dusk";

function applyMood(mood: Mood) {
  const root = document.documentElement;
  if (mood === "dusk") root.dataset.mood = "dusk";
  else delete root.dataset.mood;
}

/** Flips the whole site between a sunrise and a dusk palette. */
export default function MoodToggle() {
  const [mood, setMood] = useState<Mood>("sunrise");

  useEffect(() => {
    try {
      if (localStorage.getItem("mood") === "dusk") {
        setMood("dusk");
        applyMood("dusk");
      }
    } catch {
      /* storage can be blocked, the site still works */
    }
  }, []);

  const toggle = () => {
    const next: Mood = mood === "sunrise" ? "dusk" : "sunrise";
    setMood(next);
    applyMood(next);
    try {
      localStorage.setItem("mood", next);
    } catch {
      /* ignore */
    }
  };

  const toDusk = mood === "sunrise";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={toDusk ? "Switch to dusk mode" : "Switch to sunrise mode"}
      className="theme-t grid h-10 w-10 place-items-center rounded-full border border-line bg-card/60 text-ink backdrop-blur transition hover:scale-110 hover:border-lantern"
    >
      {toDusk ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
