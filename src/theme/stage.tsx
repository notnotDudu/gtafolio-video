import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Skin } from "./palette";
import { exitStyle, loop01 } from "./motion";

const SkinContext = createContext<Skin>("2026");

export const useSkin = () => useContext(SkinContext);

type ZoomStyle = React.CSSProperties & { zoom?: number };

const designStyle: ZoomStyle = {
  width: 640,
  height: 360,
  position: "relative",
  zoom: 3,
};

export const Frame: React.FC<{ skin?: Skin; texture?: "grain" | "vhs" | "none"; children: React.ReactNode }> = ({
  skin = "2026",
  texture = "grain",
  children,
}) => {
  return (
    <SkinContext.Provider value={skin}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div style={designStyle}>
          {children}
          {texture === "vhs" ? <VhsLayer /> : null}
          {texture === "grain" ? <GrainLayer /> : null}
        </div>
      </AbsoluteFill>
    </SkinContext.Provider>
  );
};

export const Exit: React.FC<{ durFrames: number; children: React.ReactNode }> = ({ durFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div style={{ position: "absolute", inset: 0, ...exitStyle(frame, fps, durFrames) }}>{children}</div>;
};

export const GuideTag: React.FC<{ text: string; show?: boolean }> = ({ text, show }) => {
  if (!show) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 10,
        bottom: 8,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontSize: 8.5,
        color: "rgba(255,255,255,0.75)",
        background: "rgba(0,0,0,0.5)",
        padding: "3px 6px",
        borderRadius: 3,
      }}
    >
      {text}
    </div>
  );
};

const GrainLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.floor(loop01(frame, fps, 400) * 4) % 4;
  const pos = ["0px 0px", "3px 5px", "-4px 2px", "2px -3px"][step];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), radial-gradient(125% 95% at 50% 50%, transparent 60%, rgba(10,4,7,0.55))",
        backgroundSize: "3px 3px, auto",
        backgroundPosition: `${pos}, 0 0`,
      }}
    />
  );
};

export const VhsLayer: React.FC<{ osd?: string }> = ({ osd = "PLAY  \u25B6   SP   OCT 1986" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const band = loop01(frame, fps, 3800);
  const y = -80 + band * 520;
  const chroma = Math.floor(loop01(frame, fps, 300) * 2) % 2 === 0;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.24) 0px, rgba(0,0,0,0.24) 1px, transparent 1px, transparent 3px)" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y,
          height: 34,
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.02) 60%, transparent)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 95% at 50% 50%, transparent 58%, rgba(10,0,25,0.65))" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 10,
          textAlign: "center",
          fontFamily: "VT323, monospace",
          fontSize: 16,
          letterSpacing: "0.08em",
          color: "#FFFFFF",
          textShadow: chroma
            ? "-2px 0 rgba(255,46,136,0.85), 2px 0 rgba(25,227,255,0.85)"
            : "-3px 0 rgba(255,46,136,0.85), 1px 0 rgba(25,227,255,0.85)",
        }}
      >
        {osd}
      </div>
    </div>
  );
};

export const textureFor = (skin: Skin, mode: "gallery" | "cutaway" | "lower" | undefined, force?: "grain" | "vhs" | "none") => {
  if (force) return force;
  if (mode === "lower") return "none" as const;
  return skin === "2002" ? ("vhs" as const) : ("grain" as const);
};
