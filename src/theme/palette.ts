export type Skin = "2026" | "2002";

export type Palette = {
  key: Skin;
  sky: string[];
  sun: [string, string];
  sea: [string, string];
  sil: string;
  stops: string[];
  outline: string;
  inner: string;
  hot: string;
  warm: string;
  cool: string;
  ink: string;
  cream: string;
  news: string;
  land: string;
  edge: string;
  water: [string, string];
};

export const PAL: Record<Skin, Palette> = {
  "2026": {
    key: "2026",
    sky: ["#2A1B4A", "#7A3A8C", "#E2557E", "#F8A06A"],
    sun: ["#FFE2B0", "#F68C5A"],
    sea: ["#B04C7E", "#2A1B3A"],
    sil: "#1A0B1E",
    stops: ["#3D5BC9", "#8E4CD0", "#CA27BE", "#F1409B", "#F3657B", "#F68C5A"],
    outline: "#200432",
    inner: "#F68C5A",
    hot: "#F1409B",
    warm: "#F68C5A",
    cool: "#3D5BC9",
    ink: "#0A0407",
    cream: "#FAE2DC",
    news: "#E3141B",
    land: "#5E7E5A",
    edge: "#E9D9A8",
    water: ["#2E8FA3", "#0F3B4F"],
  },
  "2002": {
    key: "2002",
    sky: ["#0B0618", "#3A0F5E", "#FF2E88", "#FF8A3D"],
    sun: ["#FFD36B", "#FF2E88"],
    sea: ["#5B1A6E", "#0B0618"],
    sil: "#0B0618",
    stops: ["#19E3FF", "#7B2FF7", "#FF2E88", "#FF8A3D"],
    outline: "#0B0618",
    inner: "#19E3FF",
    hot: "#FF2E88",
    warm: "#FF8A3D",
    cool: "#19E3FF",
    ink: "#0B0618",
    cream: "#FFF4E6",
    news: "#FF2E88",
    land: "#2A1250",
    edge: "#FF2E88",
    water: ["#1A2A6E", "#0B0618"],
  },
};

export const grad = (p: Palette, deg = 180) =>
  `linear-gradient(${deg}deg, ${p.stops
    .map((c, i) => `${c} ${Math.round((i / (p.stops.length - 1)) * 100)}%`)
    .join(", ")})`;

export const SUNSET = PAL["2026"].stops;

export const FONT = {
  display: "Anton, Impact, sans-serif",
  wordmark: '"Lilita One", Impact, sans-serif',
  slab: '"Alfa Slab One", Rockwell, serif',
  script: "Yellowtail, cursive",
  track: "Montserrat, sans-serif",
  news: "Oswald, Impact, sans-serif",
  body: "Inter, sans-serif",
  mono: '"JetBrains Mono", ui-monospace, monospace',
  vhs: "VT323, ui-monospace, monospace",
} as const;
