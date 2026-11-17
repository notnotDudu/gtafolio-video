import path from "node:path";
import { GALLERY_HERO, GALLERY_HOLD, GALLERY_ITEMS } from "../src/gallery/catalog";
import { flag, root, runRemotion } from "./remotion-bin";

const args = process.argv.slice(2);
const gallery = args.includes("--gallery");
const composition = gallery ? "Gallery" : (flag(args, "--composition", "Pilot") ?? "Pilot");
const outDir = path.resolve(root, flag(args, "--out", "out/stills") ?? "out/stills");
const fps = Number(flag(args, "--fps", "30"));

const frames: { frame: number; name: string; composition: string }[] = [];

if (gallery || composition === "Gallery") {
  GALLERY_ITEMS.forEach((item, index) => {
    frames.push({
      frame: index * GALLERY_HOLD + GALLERY_HERO,
      name: `gallery-${String(index + 1).padStart(2, "0")}-${item.id}`,
      composition: "Gallery",
    });
  });
}

const times = flag(args, "--times");
const timedComposition = flag(args, "--composition", "Pilot") ?? "Pilot";

if (times) {
  for (const token of times.split(",")) {
    const seconds = Number(token);
    frames.push({
      frame: Math.round(seconds * fps),
      name: `${timedComposition.toLowerCase()}-${token.replace(".", "_")}s`,
      composition: timedComposition,
    });
  }
}

const explicit = flag(args, "--frames");
if (explicit) {
  for (const token of explicit.split(",")) {
    frames.push({ frame: Number(token), name: `${timedComposition.toLowerCase()}-f${token}`, composition: timedComposition });
  }
}

if (!frames.length) {
  console.error("Usage: npm run stills -- --composition Pilot --times 2.5,10,40 --out out/stills");
  console.error("       npm run stills -- --gallery --out out/stills");
  process.exit(1);
}

for (const shot of frames) {
  const file = path.join(outDir, `${shot.name}.png`);
  runRemotion(["still", "src/index.ts", shot.composition, file, `--frame=${shot.frame}`]);
}
