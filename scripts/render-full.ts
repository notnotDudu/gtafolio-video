import { flag, runRemotion, concurrency } from "./remotion-bin";

const args = process.argv.slice(2);
const composition = flag(args, "--composition", "Pilot") ?? "Pilot";
const out = flag(args, "--out", "out/pilot.mp4") ?? "out/pilot.mp4";

runRemotion(["render", "src/index.ts", composition, out, `--concurrency=${concurrency()}`]);
