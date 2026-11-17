import { readFileSync } from "node:fs";
import { Edl, OverlayName, isOverlayName } from "../src/edl/types";

const fail = (message: string) => {
  console.error(message);
  process.exitCode = 1;
};

const walkStrings = (value: unknown, visit: (text: string, path: string) => void, path = "$") => {
  if (typeof value === "string") visit(value, path);
  else if (Array.isArray(value)) value.forEach((item, index) => walkStrings(item, visit, `${path}[${index}]`));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) walkStrings(item, visit, `${path}.${key}`);
  }
};

export const validateEdl = (edl: Edl) => {
  const errors: string[] = [];
  const push = (message: string) => errors.push(message);
  if (!(edl.fps > 0) || !(edl.duration > 0)) push("fps and duration must be positive");
  if (edl.skin !== "2002" && edl.skin !== "2026") push("skin must be 2002 or 2026");
  if (edl.vhs && edl.vhs.strength !== undefined && (edl.vhs.strength < 0 || edl.vhs.strength > 1)) push("vhs strength must be between 0 and 1");
  if (edl.width !== 1920 || edl.height !== 1080) push(`expected 1920x1080, got ${edl.width}x${edl.height}`);
  if (!edl.narration?.file) push("narration file is required");
  const clips = [...edl.clips].sort((a, b) => a.start - b.start);
  if (!clips.length) push("no clips");
  if (clips.length && Math.abs(clips[0].start) > 0.02) push("timeline does not start at 0");
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    if (clip.end <= clip.start) push(`${clip.id} has a non-positive duration`);
    if (clip.kind !== "placeholder" && !clip.file) push(`${clip.id} is missing a file`);
    if (i > 0) {
      const gap = clip.start - clips[i - 1].end;
      if (Math.abs(gap) > 1 / edl.fps + 0.0001) push(`gap or overlap between ${clips[i - 1].id} and ${clip.id} (${gap.toFixed(3)}s)`);
    }
  }
  if (clips.length && Math.abs(clips[clips.length - 1].end - edl.duration) > 0.05) {
    push(`last clip ends at ${clips[clips.length - 1].end}, duration is ${edl.duration}`);
  }
  const names = new Set<OverlayName>();
  for (const overlay of edl.overlays) {
    if (!isOverlayName(overlay.component)) push(`unknown overlay ${overlay.component}`);
    else names.add(overlay.component);
    if (overlay.skin && overlay.skin !== "2002" && overlay.skin !== "2026") push(`${overlay.id} has an unknown skin`);
    if (overlay.end <= overlay.start) push(`${overlay.id} has a non-positive window`);
    if (overlay.start < -0.01 || overlay.end > edl.duration + 0.05) push(`${overlay.id} sits outside the timeline`);
  }
  const depth = maxDepth(edl.overlays.map((overlay) => ({ start: overlay.start, end: overlay.end })));
  if (depth > 2) push(`more than two overlays overlap (peak ${depth}). The style guide allows two.`);
  let previous = -1;
  for (const word of edl.captions.words) {
    if (word.end < word.start) push(`word "${word.word}" ends before it starts`);
    if (word.start < previous - 0.02) push(`words are out of order at "${word.word}"`);
    previous = word.start;
  }
  walkStrings(edl, (text, path) => {
    if (text.includes("\u2014")) push(`em dash in ${path}`);
  });
  return { errors, components: [...names] };
};

const maxDepth = (spans: { start: number; end: number }[]) => {
  const points = spans.flatMap((span) => [
    { t: span.start, d: 1 },
    { t: span.end, d: -1 },
  ]);
  points.sort((a, b) => a.t - b.t || a.d - b.d);
  let depth = 0;
  let peak = 0;
  for (const point of points) {
    depth += point.d;
    peak = Math.max(peak, depth);
  }
  return peak;
};

const file = process.argv[1]?.includes("validate-edl") ? process.argv[2] : undefined;
if (file) {
  const edl = JSON.parse(readFileSync(file, "utf8")) as Edl;
  const { errors, components } = validateEdl(edl);
  if (errors.length) {
    for (const error of errors) fail(error);
  } else {
    console.log(`EDL ok: ${edl.id}, ${edl.clips.length} clips, ${edl.overlays.length} overlays, components: ${components.join(", ")}`);
  }
}
