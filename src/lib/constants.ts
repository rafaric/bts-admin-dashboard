export const BTS_MEMBERS = [
  "RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Jungkook",
] as const;

export type BtsMember = (typeof BTS_MEMBERS)[number];

export const MEMBER_COLORS: Record<BtsMember, string> = {
  RM:       "#9E9E9E",
  Jin:      "#EC407A",
  Suga:     "#616161",
  "J-Hope": "#AEEA00",
  Jimin:    "#FFD600",
  V:        "#7C3AED",
  Jungkook: "#EF5350",
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
