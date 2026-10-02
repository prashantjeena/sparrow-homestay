/*
 * Dates travel as "YYYY-MM-DD" strings and are parsed by hand,
 * so time zones can never shift a day.
 */
export const toDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const addDays = (s: string, n: number) => {
  const d = toDate(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const nightsBetween = (a: string, b: string) =>
  Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86400000);

export const pretty = (s: string) =>
  toDate(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const prettyShort = (s: string) =>
  toDate(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
