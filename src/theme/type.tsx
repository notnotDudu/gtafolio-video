import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { FONT, PAL, grad } from "./palette";
import { EASE, progress, springStyle } from "./motion";
import { useSkin } from "./stage";

export const SunsetTitle: React.FC<{
  text: string;
  size: number;
  sweepAtMs?: number;
  delayMs?: number;
  enter?: "spring" | "none";
  family?: string;
}> = ({ text, size, sweepAtMs, delayMs = 0, enter = "none", family = FONT.display }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[useSkin()];
  const sweep = sweepAtMs === undefined ? -150 : -150 + progress(frame, fps, sweepAtMs, 1000, EASE.glide) * 400;
  const enterStyle = enter === "spring" ? springStyle(frame, fps, delayMs, 650) : undefined;
  const base: React.CSSProperties = {
    fontFamily: family,
    fontWeight: 400,
    fontSize: size,
    lineHeight: 1,
    textTransform: "uppercase",
    letterSpacing: "-0.01em",
    whiteSpace: "pre",
    display: "block",
  };
  return (
    <span style={{ position: "relative", display: "inline-block", ...enterStyle }}>
      <span aria-hidden style={{ ...base, position: "absolute", left: 0, top: 0, color: "transparent", WebkitTextStroke: `${Math.round(size * 0.17)}px ${p.outline}` }}>
        {text}
      </span>
      <span aria-hidden style={{ ...base, position: "absolute", left: 0, top: 0, color: "transparent", WebkitTextStroke: `${Math.max(2, Math.round(size * 0.07))}px ${p.inner}` }}>
        {text}
      </span>
      <span
        style={{
          ...base,
          position: "relative",
          color: "transparent",
          backgroundImage: `linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.9) 50%, transparent 62%), ${grad(p)}`,
          backgroundSize: "250% 100%, 100% 100%",
          backgroundPosition: `${sweep}% 0, 0 0`,
          backgroundRepeat: "no-repeat",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {text}
      </span>
    </span>
  );
};

export const gradText = (skin: "2026" | "2002" = "2026") => grad(PAL[skin]);
