import { OverlayName } from "../edl/types";

/** One style-guide cycle at 30 fps: 6.2s, exit in the last 0.3s. Hero frame is after the entrances settle. */
export const GALLERY_HOLD = 186;
export const GALLERY_HERO = 140;

export const GALLERY_ITEMS: { id: OverlayName; name: string }[] = [
  { id: "lockup", name: "Lockup sting" },
  { id: "presents", name: "Cold open" },
  { id: "postcard", name: "Postcard chapter" },
  { id: "chyron", name: "News chyron" },
  { id: "social", name: "Social quote" },
  { id: "cctv", name: "CCTV evidence" },
  { id: "map", name: "Map callout" },
  { id: "wipe", name: "VHS to HDR wipe" },
  { id: "counter", name: "Stat counter" },
  { id: "beat", name: "Beat card" },
  { id: "rap", name: "Rap sheet" },
  { id: "timeline", name: "Highway timeline" },
  { id: "citation", name: "Source chips" },
  { id: "shortsCaptions", name: "Shorts captions" },
  { id: "end", name: "End card" },
];

export const galleryDuration = GALLERY_ITEMS.length * GALLERY_HOLD;
