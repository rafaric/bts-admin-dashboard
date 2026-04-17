export const BTS_MEMBERS = [
  "RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Jungkook",
] as const;

export type BtsMember = (typeof BTS_MEMBERS)[number];

export const MEMBER_COLORS: Record<BtsMember, string> = {
  RM:       "#7c4dce",
  Jin:      "#e879a0",
  Suga:     "#60a5fa",
  "J-Hope": "#fbbf24",
  Jimin:    "#f97316",
  V:        "#4ade80",
  Jungkook: "#a78bfa",
};

export const BTS_ERAS = [
  "2 Cool 4 Skool",
  "화양연화",
  "Wings",
  "Love Yourself",
  "Map of the Soul",
  "BE",
  "Butter",
  "Proof",
  "Arirang",
] as const;

/** ISO date of the demo seed — audit/cleanup pivot */
export const DEMO_SEED_DATE = "2026-04-17T00:00:00.000Z";
