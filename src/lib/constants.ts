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

/** Maps DB-stored lowercase keys (e.g. "rm", "jhope") to display names */
export const MEMBER_KEY_TO_NAME: Record<string, BtsMember> = {
  rm:       "RM",
  jin:      "Jin",
  suga:     "Suga",
  jhope:    "J-Hope",
  jimin:    "Jimin",
  v:        "V",
  jungkook: "Jungkook",
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

export type BtsEra = (typeof BTS_ERAS)[number];

export const ERA_COLORS: Record<BtsEra, string> = {
  "2 Cool 4 Skool": "#64B5F6",
  "화양연화":        "#81C784",
  "Wings":          "#CE93D8",
  "Love Yourself":  "#F48FB1",
  "Map of the Soul":"#FFB74D",
  "BE":             "#4DB6AC",
  "Butter":         "#FFF176",
  "Proof":          "#A1887F",
  "Arirang":        "#EF5350",
};

/** ISO date of the demo seed — audit/cleanup pivot */
export const DEMO_SEED_DATE = "2026-04-17T00:00:00.000Z";
