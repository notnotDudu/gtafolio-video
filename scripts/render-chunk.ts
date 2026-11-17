import { flag, runRemotion, concurrency } from "./remotion-bin";

const args = process.argv.slice(2);
const composition = flag(args, "--composition", "Pilot") ?? "Pilot";
const out = flag(args, "--out", "out/chunk.mp4") ?? "out/chunk.mp4";
const fps = Number(flag(args, "--fps", "30"));
const start = flag(args, "--start");
const end = flag(args, "--end");
const frames = flag(args, "--frames");

let range = frames;
if (!range) {
  if (start === undefined || end === undefined) {
    console.error("Usage: npm run render:chunk -- --start 0 --end 18 --out out/hook.mp4");
    process.exit(1);
  }
  const from = Math.round(Number(start) * fps);
  const to = Math.max(from, Math.round(Number(end) * fps) - 1);
  range = `${from}-${to}`;
}

runRemotion(["render", "src/index.ts", composition, out, `--frames=${range}`, `--concurrency=${concurrency()}`]);
