import { existsSync, lstatSync, readdirSync, readFileSync, rmdirSync, symlinkSync, unlinkSync } from "node:fs";
import path from "node:path";
import { root } from "./remotion-bin";

const fromEnv = process.env.FOOTAGE_ROOT;
const configPath = path.join(root, "footage.config.json");
let fromFile = "";
if (!fromEnv && existsSync(configPath)) {
  const parsed = JSON.parse(readFileSync(configPath, "utf8")) as { footageRoot?: string };
  fromFile = parsed.footageRoot ?? "";
}
const footageRoot = fromEnv || fromFile;
if (!footageRoot) {
  console.error("Set FOOTAGE_ROOT or footage.config.json { \"footageRoot\": \"/Volumes/T7/GTAFolio/Footage\" }");
  process.exit(1);
}
if (!existsSync(footageRoot)) {
  console.error(`Footage root is not mounted: ${footageRoot}`);
  process.exit(1);
}
const dest = path.join(root, "public", "footage");
if (existsSync(dest)) {
  const stat = lstatSync(dest);
  if (stat.isSymbolicLink()) {
    console.log(`${dest} is already a symlink. Replace it by hand if the drive path changed.`);
    process.exit(0);
  }
  const entries = readdirSync(dest);
  const placeholder = entries.every((name) => name === ".gitkeep" || name === "README.txt");
  if (!placeholder) {
    console.error(`${dest} already exists and is not a symlink. Move it aside, then run this again. Nothing was deleted.`);
    process.exit(1);
  }
  for (const name of entries) unlinkSync(path.join(dest, name));
  rmdirSync(dest);
}
symlinkSync(footageRoot, dest, "dir");
console.log(`Linked ${dest} -> ${footageRoot}`);
