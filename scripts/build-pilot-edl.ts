import { readFileSync, writeFileSync } from "node:fs";
import { OverlayName, ShotListCue, ShotListRow, WordStamp } from "../src/edl/types";
import { shotListToEdl } from "./shotlist-to-edl";
import { validateEdl } from "./validate-edl";

type CueProps = Record<string, unknown>;

const cue = (component: OverlayName, start: number, end: number, props: CueProps, mode: "cutaway" | "lower" = "cutaway", skin: "2026" | "2002" = "2026"): ShotListCue => ({
  component,
  start,
  end,
  props,
  mode,
  skin,
});

const chip = (label: string, text: string, x: number, y: number, icon: "doc" | "play" = "doc", delayMs = 180) => ({ label, text, x, y, icon, delayMs });

const shots: ShotListRow[] = [];
let cursor = 0;

const cut = (end: number, note: string, source: string, beat: number, overlay: ShotListCue[] | null, extra: Partial<ShotListRow> = {}) => {
  const start = Number(cursor.toFixed(2));
  const stop = Number(end.toFixed(2));
  shots.push({
    beat,
    start,
    end: stop,
    source_file: source,
    src_in: 0,
    src_out: Number((stop - start).toFixed(2)),
    kind: "placeholder",
    note,
    overlay_cue: overlay,
    grade: "2026",
    kenBurns: shots.length % 2 === 0 ? { zoomFrom: 1.04, zoomTo: 1.12, origin: "50% 42%" } : { zoomFrom: 1.12, zoomTo: 1.04, origin: "62% 58%" },
    placeholder: { variant: (["dusk", "night", "day"] as const)[shots.length % 3], label: note },
    ...extra,
  });
  cursor = stop;
};

cut(8.3, "Houser quote, Game Informer 2012", "stills/houser-game-informer-2012.jpg", 0, [
  cue("cctv", 0.25, 7.7, {
    camera: "CAM 01  QUOTE TAPE",
    target: "Houser, 2012",
    exhibit: "Exhibit A / Game Informer",
    highlight: "mythical characters who never existed",
    source: "Dan Houser to Game Informer, 2012",
    stamp: "2012",
  }, "lower"),
  cue("citation", 0.5, 7.4, { chips: [chip("Note", "Pre-launch only. No story spoilers.", 18, 78)] }, "lower"),
]);

cut(18.6, "2012 quote against the GTA VI page", "gta6/vi-product-card.jpg", 0, [
  cue("wipe", 8.35, 18.4, { thenYear: "2012", thenLabel: "Houser, Game Informer", nowYear: "2026", nowLabel: "GTA VI page" }),
  cue("citation", 8.7, 18.1, { chips: [chip("Then", "Game Informer, 2012", 22, 300), chip("Now", "rockstargames.com/VI", 360, 300, "doc", 500)] }, "lower"),
], { transitionOut: { type: "flash", duration: 0.18 } });

cut(26.4, "Push in on the engraved revolvers", "gta6/hawk-little-morgan-revolvers-02.jpg", 0, [
  cue("chyron", 18.75, 26.15, { headline: "Whose estate is that?", ticker: "Hawk and Little Morgan revolvers   /   sourced from the Vercetti Estate   /   J Duval and L Caminos   /   ", clock: "STORE" }, "lower"),
]);

cut(34.88, "Revolvers, slow push on the engravings", "gta6/hawk-little-morgan-revolvers-02b.jpg", 0, [
  cue("citation", 26.55, 34.6, { chips: [chip("Page", "GTA VI store, Hawk and Little Morgan", 22, 22)] }, "lower"),
]);

cut(52.7, "Official revolver copy, Ken Burns push", "gta6/hawk-little-morgan-revolvers-01.jpg", 1, [
  cue("cctv", 35.05, 52.45, {
    camera: "CAM 02  PRODUCT",
    target: "Vercetti Estate",
    exhibit: "Official copy",
    highlight: "sourced from the Vercetti Estate",
    source: "Rockstar GTA VI page. Press release adds exclusively.",
    stamp: "OFFICIAL",
  }, "lower"),
]);

cut(61.6, "Zoom to J Duval, then L Caminos", "gta6/revolvers-engravings.jpg", 1, [
  cue("citation", 52.9, 61.4, { chips: [chip("Scope", "J Duval", 22, 28), chip("Grip", "L Caminos, gold palm", 360, 28, "doc", 700)] }, "lower"),
], { kenBurns: { zoomFrom: 1.02, zoomTo: 1.34, origin: "42% 48%" } });

cut(75.2, "Shirt pattern against the weapon pattern", "gta6/vintage-vice-city-weapon-pattern.jpg", 1, [
  cue("wipe", 61.75, 74.9, { thenYear: "2002", thenLabel: "Tommy's shirt", nowYear: "VI", nowLabel: "Weapon pattern" }),
  cue("citation", 62.1, 74.6, { chips: [chip("Copy", "Inspired by the palm tree button-up", 22, 300)] }, "lower"),
]);

cut(82.72, "Only time the marketing names Tommy", "vc/tommy-teal-shirt.jpg", 1, [
  cue("citation", 75.4, 82.5, { chips: [chip("Once", "Only time Rockstar names Tommy in GTA VI marketing", 22, 22)] }, "lower"),
], { grade: "2002" });

cut(98.2, "Tommy arrives in Vice City, 1986", "vc/in-the-beginning.jpg", 2, [
  cue("rap", 82.9, 97.9, {
    file: "Vercetti file / 001",
    name: "TOMMY VERCETTI",
    rows: [
      { label: "Set", value: "1986" },
      { label: "Game", value: "GTA Vice City, 2002" },
      { label: "Status", value: "LIVE" },
      { label: "First stop", value: "A deal that goes wrong" },
    ],
    heat: 2,
    tag: "",
  }),
], { grade: "2002" });

cut(118.4, "Ocean View Hotel, then the mansion", "vc/ocean-view-hotel.jpg", 2, [
  cue("map", 98.4, 118.2, {
    blips: [
      { x: 300, y: 210, tone: "cool", letter: "H", delayMs: 400 },
      { x: 430, y: 250, tone: "warm", letter: "M", delayMs: 4200 },
    ],
    labels: [
      { x: 300, y: 180, text: "OCEAN VIEW", delayMs: 700 },
      { x: 455, y: 286, text: "THE MANSION", delayMs: 4500 },
    ],
    showRoute: true,
    route: "M300 210 C340 230 390 240 430 250",
    credit: "Stylized stand-in. Yanis v16 Leonida map is CC BY 4.0 if that art is used.",
    legend: [
      { tone: "cool", label: "First safehouse" },
      { tone: "warm", label: "Diaz mansion" },
    ],
  }),
], { grade: "2002" });

cut(130.6, "Assets: cab, showroom, clubs", "vc/asset-purchases.jpg", 2, [
  cue("counter", 118.6, 130.4, { to: 3, label: "Assets", caption: "a taxi company, a car showroom, and a few clubs" }),
], { grade: "2002" });

cut(141.04, "Finale at the mansion, 3D universe", "vc/keep-your-friends-close.jpg", 2, [
  cue("beat", 130.8, 140.85, { chapter: "What fans call it", title: "3D UNIVERSE", progressLabel: "File", progress: 1, progressText: "ONE WORLD", tag: "" }),
], { grade: "2002" });

cut(168.7, "Three universes, 2D, 3D, HD", "gta4/rip-wall.jpg", 3, [
  cue("timeline", 141.15, 168.5, {
    signs: [
      { year: "2D", caption: "Top-down worlds" },
      { year: "3D", caption: "Vice City lives" },
      { year: "HD", caption: "A new world" },
      { year: "VI", caption: "Leonida", accent: true },
    ],
  }),
  cue("citation", 159.4, 168.3, { chips: [chip("Source", "Rockstar Newswire, 18 Sep 2009", 22, 308)] }, "lower"),
]);

cut(186.7, "December 2011, definitions of the worlds", "plates/newswire-2011.jpg", 3, [
  cue("citation", 168.95, 186.4, { chips: [chip("Source", "Rockstar Newswire, 15 Dec 2011", 22, 24), chip("Rule", "Brands cross. 3D characters do not.", 22, 68, "doc", 900)] }, "lower"),
]);

cut(200.5, "2012 Houser line, same rule a third time", "plates/houser-2012.jpg", 3, [
  cue("citation", 186.95, 200.3, { chips: [chip("Source", "Dan Houser to Game Informer, 2012", 22, 24)] }, "lower"),
]);

cut(213.92, "Three labels for everything after this", "plates/three-labels.jpg", 3, [
  cue("beat", 200.7, 213.7, { chapter: "Same name, same place, or not shown", title: "THREE LABELS", progressLabel: "Rule", progress: 1, progressText: "ASSUMED", tag: "" }),
]);

cut(239, "Ocean Beach, 1986 beside 2026", "gta6/t1-ocean-beach-neon.jpg", 4, [
  cue("wipe", 214.05, 238.8, { thenYear: "1986", thenLabel: "Ocean Beach", nowYear: "2026", nowLabel: "Same beach" }),
  cue("citation", 220, 238.5, { chips: [chip("Label", "SAME NAME", 22, 300), chip("Also", "Same place, by the look of it", 250, 300, "doc", 800)] }, "lower"),
]);

cut(263.2, "Ocean View neon, 2002 and the pack shot", "gta6/vintage-vice-city-ocean-view.jpg", 4, [
  cue("chyron", 239.2, 262.9, { headline: "Ocean View Hotel", ticker: "Jason and Lucia outside the neon   /   2002 safehouse   /   caption never names Tommy   /   label stays at same name   /   " }, "lower"),
  cue("citation", 239.5, 262.6, { chips: [chip("Label", "SAME NAME", 400, 78)] }, "lower"),
]);

cut(285.28, "Shore Drive flips over Ocean Drive", "gta6/stanier-shore-drive.jpg", 4, [
  cue("timeline", 263.4, 285.05, {
    signs: [
      { year: "2002", caption: "Ocean Drive", delayMs: 12000 },
      { year: "2026", caption: "Shore Drive", accent: true, delayMs: 1800 },
    ],
    pan: 20,
  }),
  cue("citation", 270, 284.8, { chips: [chip("Label", "NEW NAME", 22, 308)] }, "lower"),
]);

cut(304.7, "Washington Beach on the sign and the boat", "gta6/el-exit-21b-washington.jpg", 5, [
  cue("chyron", 285.5, 304.45, { headline: "Docked at Washington Beach", ticker: "Exit 21B Shorefront Ave   /   Shitzu Squalo copy   /   a 2002 district, named again   /   " }, "lower"),
]);

cut(317.15, "Downtown, the weakest same-name", "gta6/t2-downtown-sign.jpg", 5, [
  cue("map", 304.9, 316.95, {
    blips: [{ x: 200, y: 160, tone: "warm", letter: "D", delayMs: 300 }],
    labels: [{ x: 200, y: 130, text: "DOWNTOWN", delayMs: 600 }],
    showRoute: false,
    credit: "Stylized stand-in. Yanis v16 Leonida map is CC BY 4.0 if that art is used.",
    legend: [{ tone: "warm", label: "Weakest same name" }],
  }),
  cue("citation", 305.2, 316.7, { chips: [chip("Label", "SAME NAME, weakest", 400, 24)] }, "lower"),
]);

cut(342.4, "Districts named again, missing, unconfirmed", "vc/district-name-cards.jpg", 5, [
  cue("map", 317.3, 342.15, {
    showRoute: false,
    blips: [
      { x: 150, y: 250, tone: "warm", letter: "O", delayMs: 200 },
      { x: 210, y: 200, tone: "warm", letter: "W", delayMs: 500 },
      { x: 250, y: 140, tone: "warm", letter: "D", delayMs: 800 },
      { x: 340, y: 120, tone: "cool", letter: "V", delayMs: 1400 },
      { x: 390, y: 170, tone: "cool", letter: "H", delayMs: 1700 },
      { x: 300, y: 190, tone: "hot", letter: "S", delayMs: 2100 },
      { x: 430, y: 230, tone: "cool", letter: "P", delayMs: 2500 },
    ],
    labels: [
      { x: 150, y: 276, text: "OCEAN", delayMs: 400 },
      { x: 340, y: 100, text: "NOT SHOWN", delayMs: 1600 },
      { x: 300, y: 214, text: "STARFISH?", delayMs: 2300 },
    ],
    legend: [
      { tone: "warm", label: "Named again" },
      { tone: "cool", label: "Not shown" },
      { tone: "hot", label: "Unconfirmed" },
    ],
    credit: "Stylized stand-in. Yanis v16 Leonida map is CC BY 4.0 if that art is used.",
  }),
  cue("citation", 317.6, 341.9, { chips: [chip("Badge", "OFFICIAL / UNCONFIRMED", 22, 24)] }, "lower"),
], { grade: "2002" });

cut(357.36, "Subscribe ask, launch week follow-up", "plates/subscribe.jpg", 5, [
  cue("end", 342.6, 357.15, {
    variant: "corner",
    clock: "19:00",
    date: "Launch week",
    notes: [
      { title: "Follow-up", body: "These places, in the real game" },
      { title: "Want the check?", body: "" },
    ],
    subscribe: "Subscribe",
    subscribed: "Subscribed",
  }, "lower"),
]);

cut(380.9, "Serials read as 29 Oct 2002 and 31 Oct 2006", "gta6/revolver-serials.jpg", 6, [
  cue("timeline", 357.55, 380.7, {
    signs: [
      { year: "29.10.02", caption: "Vice City", delayMs: 16500 },
      { year: "31.10.06", caption: "Vice City Stories", accent: true, delayMs: 12500 },
    ],
    pan: 30,
  }),
]);

cut(393.2, "Lucia matches the original, Jason the PSP", "plates/two-guns.jpg", 6, [
  cue("citation", 381.3, 393, { chips: [chip("Read", "Lucia: original game. Jason: Vice City Stories.", 22, 22)] }, "lower"),
]);

cut(404.6, "Fan reading, first noted by GTA Culture", "plates/fan-reading.jpg", 6, [
  cue("citation", 393.4, 404.4, { chips: [chip("Badge", "FAN READING", 22, 24), chip("Source", "First noted by GTA Culture", 22, 68, "doc", 500)] }, "lower"),
]);

cut(418.5, "Inspired by, a design, not a person", "gta6/weapon-pattern-beside-shirt.jpg", 6, [
  cue("citation", 404.8, 418.3, { chips: [chip("Label", "INSPIRED BY", 22, 24), chip("Copy", "Nothing says Tommy is in the game", 250, 24, "doc", 700)] }, "lower"),
]);

cut(430, "Pack goes to purchases before 20 Nov 2026", "gta6/support-vintage-pack.jpg", 6, [
  cue("chyron", 418.7, 429.75, { headline: "Vintage Vice City Pack", ticker: "Purchases before 20 Nov 2026   /   launch week buyers get the pattern   /   support page   /   " }, "lower"),
]);

cut(457.3, "Ranked list, weakest to strongest", "plates/ranked-board.jpg", 7, [
  cue("timeline", 430.15, 457.15, {
    pan: 110,
    signs: [
      { year: "05", caption: "Downtown", delayMs: 3600 },
      { year: "04", caption: "Washington Beach", delayMs: 9600 },
      { year: "03", caption: "Ocean Beach", delayMs: 15900 },
      { year: "02", caption: "Ocean View", delayMs: 21100 },
    ],
  }),
]);

cut(480.2, "Number one, the file flips to legend", "vc/mansion-finale.jpg", 7, [
  cue("rap", 457.45, 480, {
    file: "Vercetti file / 001",
    name: "TOMMY VERCETTI",
    stamp: "LEGEND",
    heat: 5,
    rows: [
      { label: "Status", value: "Was LIVE" },
      { label: "Shirt", value: "Now a gun pattern" },
      { label: "Estate", value: "A name on two revolvers" },
      { label: "Rule", value: "He cannot walk into the story" },
    ],
    tag: "",
  }),
], { grade: "2002" });

cut(488, "Only in Leonida, still the sun and fun capital", "gta6/only-in-leonida.jpg", 7, [
  cue("citation", 480.45, 487.75, { chips: [chip("Page", "Only in Leonida. A long way from the eighties.", 22, 22)] }, "lower"),
]);

cut(503.5, "End card, comment prompt, next video slot", "gta6/t2-vice-skyline.jpg", 8, [
  cue("end", 488.15, 503.4, {
    variant: "full",
    clock: "22:41",
    date: "Thursday, Nov 19",
    slots: ["Next video", "Best for the viewer"],
    notes: [
      { title: "Which place first?", body: "Tell me in the comments" },
      { title: "Part 2 after launch", body: "" },
    ],
  }),
]);

if (Math.abs(cursor - 503.5) > 0.001) {
  throw new Error(`Pilot shots end at ${cursor}, expected 503.5`);
}

const words = JSON.parse(readFileSync(new URL("../episodes/pilot/words.json", import.meta.url), "utf8")) as WordStamp[];

const episode = {
  id: "pilot",
  title: "What's Left of Tommy Vercetti's Vice City in GTA 6?",
  fps: 30,
  width: 1920,
  height: 1080,
  duration: 503.5,
  narration: { file: "audio/narration.mp3", volume: 1 },
  music: [
    {
      id: "bed",
      file: "audio/bed.mp3",
      start: 0,
      end: 503.5,
      volume: 0.16,
      loop: true,
      fadeIn: 0.6,
      fadeOut: 1.8,
      duck: { under: "narration" as const, to: 0.04, near: 0.05, far: 0.35 },
    },
  ],
  words,
  shots,
  autoSfx: true,
  captions: {
    enabled: true,
    style: "karaoke" as const,
    maxWords: 5,
    safeArea: { top: 78, right: 150, bottom: 92, left: 150 },
  },
};

const edl = shotListToEdl(episode);
const { errors } = validateEdl(edl);
if (errors.length) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

writeFileSync(new URL("../episodes/pilot/shotlist.json", import.meta.url), JSON.stringify(shots, null, 2));
writeFileSync(new URL("../episodes/pilot/episode.json", import.meta.url), JSON.stringify({ ...episode, words: undefined, shots }, null, 2));
writeFileSync(new URL("../src/edl/pilot.json", import.meta.url), JSON.stringify(edl));
console.log(`Pilot EDL: ${edl.clips.length} clips, ${edl.overlays.length} overlays, ${edl.sfx.length} sfx, ${edl.captions.words.length} words`);
