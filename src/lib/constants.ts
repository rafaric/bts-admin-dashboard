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

/** Maps DB-stored era keys to display labels */
export const ERA_KEY_TO_LABEL: Record<string, BtsEra> = {
  "2cool4skool": "2 Cool 4 Skool",
  "hyyh":        "화양연화",
  "wings":       "Wings",
  "love_yourself":"Love Yourself",
  "mots":        "Map of the Soul",
  "be":          "BE",
  "butter":      "Butter",
  "proof":       "Proof",
  "arirang":     "Arirang",
};

export const ERA_COLORS: Record<BtsEra, string> = {
  "2 Cool 4 Skool": "#e8b86d",
  "화양연화":        "#ff8c69",
  "Wings":          "#9b6fe8",
  "Love Yourself":  "#f06292",
  "Map of the Soul":"#4fc3f7",
  "BE":             "#a5d6a7",
  "Butter":         "#f9d342",
  "Proof":          "#c9a84c",
  "Arirang":        "#cc2936",
};

/** ISO date of the demo seed — audit/cleanup pivot */
export const DEMO_SEED_DATE = "2026-04-17T00:00:00.000Z";
