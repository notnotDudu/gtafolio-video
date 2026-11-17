import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { OverlayEvent, OverlayName, Skin, WordStamp } from "../edl/types";
import { FONT, PAL } from "../theme/palette";
import { SkinProvider, chromaShadow } from "../theme/stage";
import { SunsetTitle } from "../theme/type";

const KEY = new Set([
  "tommy", "vercetti", "vice", "city", "estate", "ocean", "beach", "hotel",
  "houser", "rockstar", "jason", "lucia", "downtown", "starfish", "revolver",
  "revolvers", "legend", "mythical", "duval", "caminos",
]);

const COVER: OverlayName[] = ["lockup", "presents", "postcard", "counter", "beat", "rap", "map", "wipe", "shortsCaptions"];
const LIFT: OverlayName[] = ["chyron", "timeline", "cctv", "social", "end"];

const clean = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, "");

export const captionPages = (words: WordStamp[], maxWords: number): WordStamp[][] => {
  const pages: WordStamp[][] = [];
  let current: WordStamp[] = [];
  for (const word of words) {
    const gap = current.length ? word.start - current[current.length - 1].end : 0;
    if (current.length && (gap > 0.45 || current.length >= maxWords)) {
      pages.push(current);
      current = [];
    }
    current.push(word);
  }
  if (current.length) pages.push(current);
  return pages;
};

const pageAt = (pages: WordStamp[][], time: number) => {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const start = page[0].start - 0.04;
    const end = i + 1 < pages.length ? pages[i + 1][0].start : page[page.length - 1].end + 0.35;
    if (time >= start && time < end) return page;
  }
  return null;
};

const layoutFor = (overlays: OverlayEvent[], time: number): "hide" | "lift" | "normal" => {
  let lift = false;
  for (const overlay of overlays) {
    if (time < overlay.start || time >= overlay.end) continue;
    if (COVER.includes(overlay.component) && overlay.mode !== "lower") return "hide";
    if (overlay.component === "end" && overlay.mode !== "lower" && overlay.props.variant !== "corner") return "hide";
    if (LIFT.includes(overlay.component)) lift = true;
  }
  return lift ? "lift" : "normal";
};

const SHADOW = "0 2px 0 #171717, 2px 0 0 #171717, -2px 0 0 #171717, 0 -2px 0 #171717, 0 8px 18px rgba(0,0,0,0.55)";

export const KaraokeCaptions: React.FC<{
  words: WordStamp[];
  overlays: OverlayEvent[];
  maxWords: number;
  safe: { top: number; right: number; bottom: number; left: number };
  skin?: Skin;
}> = ({ words, overlays, maxWords, safe, skin = "2002" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const pages = useMemo(() => captionPages(words, maxWords), [words, maxWords]);
  const page = pageAt(pages, time);
  const layout = layoutFor(overlays, time);
  if (!page || layout === "hide") return null;
  const p = PAL[skin];
  const shadow = skin === "2002" ? `${chromaShadow(frame, fps, 2)}, ${SHADOW}` : SHADOW;
  return (
    <SkinProvider skin={skin}>
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: safe.left,
          right: safe.right,
          top: layout === "lift" ? safe.top : undefined,
          bottom: layout === "lift" ? undefined : safe.bottom,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-end",
          columnGap: 16,
          rowGap: 6,
        }}
      >
        {page.map((word, index) => {
          const active = time >= word.start && time < word.end + 0.08;
          const key = KEY.has(clean(word.word));
          return (
            <span key={`${word.start}-${index}`} style={{ display: "inline-block", transform: active ? "scale(1.08)" : undefined }}>
              {active && key ? (
                <SunsetTitle text={word.word} size={52} />
              ) : (
                <span style={{ fontFamily: FONT.display, fontSize: 52, lineHeight: 1, textTransform: "uppercase", color: active ? p.cream : "#FFFFFF", textShadow: shadow }}>
                  {word.word}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
    </SkinProvider>
  );
};
