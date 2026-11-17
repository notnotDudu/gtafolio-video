import { readFileSync, writeFileSync } from "node:fs";
import { AudioEvent, Edl, EpisodeInput, OverlayEvent, OverlayName, ShotListCue, ShotListRow, WordStamp, isOverlayName } from "../src/edl/types";
import { unexpected } from "../src/theme/never";

const impact = (name: OverlayName): { file: string; volume: number } | null => {
  switch (name) {
    case "lockup":
      return { file: "sfx/whoosh.wav", volume: 0.16 };
    case "presents":
      return { file: "sfx/whoosh.wav", volume: 0.14 };
    case "postcard":
      return { file: "sfx/pop.wav", volume: 0.16 };
    case "chyron":
      return { file: "sfx/tick.wav", volume: 0.12 };
    case "cctv":
      return { file: "sfx/thud.wav", volume: 0.18 };
    case "map":
      return { file: "sfx/pop.wav", volume: 0.14 };
    case "wipe":
      return { file: "sfx/whoosh.wav", volume: 0.18 };
    case "counter":
      return { file: "sfx/tick.wav", volume: 0.12 };
    case "beat":
      return { file: "sfx/thud.wav", volume: 0.15 };
    case "rap":
      return { file: "sfx/pop.wav", volume: 0.15 };
    case "timeline":
      return { file: "sfx/whoosh.wav", volume: 0.12 };
    case "end":
      return { file: "sfx/pop.wav", volume: 0.15 };
    case "citation":
    case "social":
    case "shortsCaptions":
      return null;
    default:
      return unexpected(name);
  }
};

const asCue = (cue: ShotListCue, fallbackStart: number, fallbackEnd: number, index: number, skin: EpisodeInput["skin"]): OverlayEvent => {
  const channel = skin ?? "2002";
  if (typeof cue === "string") {
    if (!isOverlayName(cue)) throw new Error(`Unknown overlay ${cue}`);
    return assemble(cue, { id: `ov-${index}`, start: fallbackStart, end: fallbackEnd, skin: channel, mode: "cutaway", props: {} });
  }
  if (!isOverlayName(cue.component)) throw new Error(`Unknown overlay ${cue.component}`);
  return assemble(cue.component, {
    id: cue.id ?? `ov-${index}`,
    start: cue.start ?? fallbackStart,
    end: cue.end ?? fallbackEnd,
    skin: cue.skin ?? channel,
    mode: cue.mode ?? "cutaway",
    props: cue.props ?? {},
  });
};

const assemble = (component: OverlayName, base: Omit<OverlayEvent, "component" | "props"> & { props: OverlayEvent["props"] }): OverlayEvent => {
  switch (component) {
    case "lockup":
    case "presents":
    case "postcard":
    case "chyron":
    case "social":
    case "cctv":
    case "map":
    case "wipe":
    case "counter":
    case "beat":
    case "rap":
    case "timeline":
    case "citation":
    case "shortsCaptions":
    case "end":
      return { ...base, component } as OverlayEvent;
    default:
      return unexpected(component);
  }
};

const cuesOf = (row: ShotListRow): ShotListCue[] => {
  if (row.overlay_cue == null) return [];
  return Array.isArray(row.overlay_cue) ? row.overlay_cue : [row.overlay_cue];
};

const normalizeWord = (raw: { word?: string; text?: string; start: number; end: number }): WordStamp => ({
  word: raw.word ?? raw.text ?? "",
  start: raw.start,
  end: raw.end,
});

export const shotListToEdl = (episode: EpisodeInput): Edl => {
  const fps = episode.fps ?? 30;
  const overlays: OverlayEvent[] = [];
  episode.shots.forEach((row) => {
    for (const cue of cuesOf(row)) {
      overlays.push(asCue(cue, row.start, row.end, overlays.length + 1, episode.skin));
    }
  });
  const sfx: AudioEvent[] = [...(episode.sfx ?? [])];
  if (episode.autoSfx !== false) {
    for (const overlay of overlays) {
      const hit = impact(overlay.component);
      if (!hit) continue;
      sfx.push({
        id: `sfx-${overlay.id}`,
        file: hit.file,
        start: overlay.start,
        volume: hit.volume,
      });
    }
  }
  return {
    id: episode.id,
    title: episode.title,
    fps,
    width: episode.width ?? 1920,
    height: episode.height ?? 1080,
    duration: episode.duration,
    skin: episode.skin ?? "2002",
    vhsRanges: episode.vhsRanges,
    narration: { file: episode.narration.file, volume: episode.narration.volume ?? 1 },
    music: episode.music ?? [],
    sfx,
    clips: episode.shots.map((row, index) => ({
      id: `b${row.beat}-s${index + 1}`,
      kind: row.kind,
      file: row.source_file,
      srcIn: row.src_in,
      srcOut: row.src_out,
      start: row.start,
      end: row.end,
      speed: row.speed,
      crop: row.crop,
      kenBurns: row.kenBurns,
      grade: row.grade,
      vhs: row.vhs,
      transitionOut: row.transitionOut,
      placeholder: row.placeholder,
      note: row.note,
    })),
    overlays,
    captions: {
      enabled: episode.captions?.enabled ?? true,
      style: episode.captions?.style ?? "karaoke",
      safeArea: episode.captions?.safeArea ?? { top: 72, right: 140, bottom: 96, left: 140 },
      maxWords: episode.captions?.maxWords ?? 5,
      words: episode.words.map(normalizeWord),
    },
  };
};

const readEpisode = (file: string): EpisodeInput => {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as EpisodeInput | ShotListRow[];
  if (Array.isArray(parsed)) {
    throw new Error("Pass an episode object with shots, words and narration. A bare shot array has no timeline metadata.");
  }
  return parsed;
};

const main = () => {
  const args = process.argv.slice(2);
  const output = valueOf(args, "--out");
  const input = valueOf(args, "--in");
  const shotsFile = valueOf(args, "--shots");
  if (!output || (!input && !shotsFile)) {
    console.log("Usage:");
    console.log("  tsx scripts/shotlist-to-edl.ts --in episodes/pilot/episode.json --out src/edl/pilot.json");
    console.log("  tsx scripts/shotlist-to-edl.ts --shots shotlist.json --words words.json --narration audio/narration.mp3 --duration 503.5 --title \"Episode\" --out src/edl/pilot.json");
    process.exit(args.length ? 1 : 0);
  }
  const episode = input ? readEpisode(input) : episodeFromFlags(args, shotsFile as string);
  const edl = shotListToEdl(episode);
  writeFileSync(output, JSON.stringify(edl, null, 2));
  console.log(`Wrote ${output} (${edl.clips.length} clips, ${edl.overlays.length} overlays, ${edl.duration}s)`);
};

const episodeFromFlags = (args: string[], shotsFile: string): EpisodeInput => {
  const wordsFile = valueOf(args, "--words");
  const narration = valueOf(args, "--narration");
  const duration = Number(valueOf(args, "--duration"));
  const title = valueOf(args, "--title");
  if (!wordsFile || !narration || !title || !(duration > 0)) {
    throw new Error("--shots needs --words, --narration, --duration and --title");
  }
  const shots = JSON.parse(readFileSync(shotsFile, "utf8")) as ShotListRow[];
  const words = JSON.parse(readFileSync(wordsFile, "utf8")) as WordStamp[];
  return {
    id: valueOf(args, "--id") ?? "episode",
    title,
    duration,
    fps: Number(valueOf(args, "--fps") ?? 30),
    narration: { file: narration },
    words,
    shots,
    autoSfx: true,
  };
};

const valueOf = (args: string[], flag: string) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

if (process.argv[1]?.includes("shotlist-to-edl")) main();
