import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Skin } from "./palette";
import { exitStyle, loop01 } from "./motion";

const SkinContext = createContext<Skin>("2002");

export const useSkin = () => useContext(SkinContext);

export const SkinProvider: React.FC<{ skin: Skin; children: React.ReactNode }> = ({ skin, children }) => (
  <SkinContext.Provider value={skin}>{children}</SkinContext.Provider>
);

/** gfChroma is a 2-step shadow. scale is 1 in the 640 stage and about 3 on full-frame captions. */
export const chromaShadow = (frame: number, fps: number, scale = 1) => {
  const wide = Math.floor(loop01(frame, fps, 300) * 2) % 2 === 0;
  const left = (wide ? 2 : 3) * scale;
  const right = (wide ? 2 : 1) * scale;
  return `-${left}px 0 rgba(255,46,136,0.85), ${right}px 0 rgba(25,227,255,0.85)`;
};

const hash01 = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type ZoomStyle = React.CSSProperties & { zoom?: number };

const designStyle: ZoomStyle = {
  width: 640,
  height: 360,
  position: "relative",
  zoom: 3,
};

export const Frame: React.FC<{ skin?: Skin; texture?: "grain" | "vhs" | "none"; children: React.ReactNode }> = ({
  skin = "2002",
  texture = "grain",
  children,
}) => {
  const filtered: ZoomStyle = texture === "vhs" ? { ...designStyle, filter: "saturate(1.3) contrast(1.06)" } : designStyle;
  return (
    <SkinContext.Provider value={skin}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div style={filtered}>
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

export const VhsLayer: React.FC<{ osd?: string; look?: "plate" | "footage"; strength?: number }> = ({
  osd = "PLAY  \u25B6   SP   OCT 1986",
  look = "plate",
  strength = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const plate = look === "plate";
  const gain = plate ? 1 : Math.min(1, Math.max(0, strength));
  const unit = plate ? 1 : 3;
  const band = loop01(frame, fps, plate ? 3800 : 2600);
  const burstFrames = Math.max(1, Math.round(fps * 0.5));
  const period = Math.max(burstFrames + 1, Math.round(fps * 7));
  const phase = ((frame % period) + period) % period;
  const showBand = plate || phase < burstFrames;
  const y = plate ? -80 + band * 520 : -80 + (phase / burstFrames) * 1240;
  const wobble = (hash01(frame * 3 + 1) - 0.5) * (plate ? 1.6 : 2.2 * gain);
  const tear = hash01(Math.floor(frame / 8) + 9) > (plate ? 0.84 : 0.9);
  const tearY = hash01(Math.floor(frame / 8) + 4) * (plate ? 360 : 1080);
  const scan = plate ? 0.24 : 0.4 * gain;
  const grid = plate ? 0.1 : 0.18 * gain;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(90deg, rgba(0,0,0,${grid}) 0px, rgba(0,0,0,${grid}) ${unit}px, transparent ${unit}px, transparent ${8 * unit}px), repeating-linear-gradient(0deg, rgba(0,0,0,${grid}) 0px, rgba(0,0,0,${grid}) ${unit}px, transparent ${unit}px, transparent ${8 * unit}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, rgba(0,0,0,${scan}) 0px, rgba(0,0,0,${scan}) ${unit}px, transparent ${unit}px, transparent ${3 * unit}px)`,
        }}
      />
      {showBand ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: y,
            height: 34 * unit,
            transform: `translateX(${wobble}px)`,
            background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.02) 60%, transparent)",
            opacity: plate ? 1 : 0.8,
          }}
        />
      ) : null}
      {tear ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: tearY,
            height: 2 * unit,
            background: `rgba(255,255,255,${plate ? 0.16 : 0.1 * gain})`,
            transform: `translateX(${(hash01(frame + 2) - 0.5) * 10}px)`,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: plate
            ? "radial-gradient(120% 95% at 50% 50%, transparent 58%, rgba(10,0,25,0.65))"
            : `radial-gradient(120% 95% at 50% 50%, transparent 70%, rgba(10,0,25,${0.22 * gain}))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          mixBlendMode: "screen",
          boxShadow: `inset ${unit + 1}px 0 0 rgba(255,46,136,${plate ? 0.45 : 0.34 * gain}), inset -${unit + 1}px 0 0 rgba(25,227,255,${plate ? 0.45 : 0.34 * gain})`,
        }}
      />
      {plate ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 10,
            textAlign: "center",
            fontFamily: "VT323, monospace",
            fontSize: 18,
            letterSpacing: "0.08em",
            color: "#FFFFFF",
            transform: `translateX(${wobble}px)`,
            textShadow: chromaShadow(frame, fps),
          }}
        >
          {osd}
        </div>
      ) : null}
    </div>
  );
};

export const textureFor = (skin: Skin, mode: "gallery" | "cutaway" | "lower" | undefined, force?: "grain" | "vhs" | "none") => {
  if (force) return force;
  if (mode === "lower") return "none" as const;
  return skin === "2002" ? ("vhs" as const) : ("grain" as const);
};
