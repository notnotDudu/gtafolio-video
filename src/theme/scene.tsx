import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PAL, Palette, Skin } from "./palette";
import { loop01 } from "./motion";

export const SKYLINE: number[][] = [
  [30, 50, 22], [56, 92, 18], [76, 66, 26], [104, 128, 20], [126, 84, 24],
  [152, 150, 16], [170, 108, 28], [200, 72, 20], [222, 118, 18], [242, 58, 30],
  [274, 140, 22], [298, 98, 16], [316, 172, 20], [338, 88, 26], [366, 124, 18],
  [386, 78, 22], [410, 104, 20], [432, 158, 18], [452, 68, 28], [482, 114, 20],
  [504, 84, 24], [530, 134, 18], [550, 62, 26], [578, 96, 20], [600, 70, 30],
];

const FRONDS = [
  "M14 -150 C-10 -165 -40 -160 -60 -138",
  "M14 -150 C0 -182 -22 -192 -44 -192",
  "M14 -150 C30 -186 56 -190 72 -176",
  "M14 -150 C46 -160 72 -150 86 -126",
  "M14 -150 C20 -176 14 -202 2 -212",
  "M14 -150 C-20 -150 -46 -128 -52 -106",
  "M14 -150 C40 -146 58 -126 62 -100",
];

export const Palm: React.FC<{ x: number; y: number; s: number; c: string; sway?: boolean }> = ({ x, y, s, c, sway = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tilt = sway ? Math.sin(loop01(frame, fps, 5200) * Math.PI * 2) * 1.6 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g style={{ transformBox: "fill-box", transformOrigin: "bottom", transform: `rotate(${tilt}deg)` }}>
        <path d="M0 0 C6 -50 2 -100 14 -150" stroke={c} strokeWidth={7} fill="none" strokeLinecap="round" />
        {FRONDS.map((d) => (
          <path key={d} d={d} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
};

export type SceneVariant = "dusk" | "day" | "night";

export const Scene: React.FC<{ variant?: SceneVariant; skin?: Skin; palms?: boolean; uid: string }> = ({
  variant = "dusk",
  skin = "2002",
  palms = true,
  uid,
}) => {
  const p = PAL[skin];
  const sky = variant === "day" ? ["#3170BD", "#6FA8DC", "#BFE0F0"] : variant === "night" ? ["#05030F", "#1A0B3A", "#3A1658"] : p.sky;
  const sea = variant === "day" ? ["#5FC0D0", "#1E6F8A"] : variant === "night" ? ["#1A0B3A", "#05030F"] : p.sea;
  const sil = variant === "day" ? "#33456A" : p.sil;
  const id = `${uid}-${variant}`;
  return (
    <svg viewBox="0 0 640 360" width="640" height="360" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          {sky.map((c, i) => (
            <stop key={c + i} offset={i / (sky.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sea[0]} />
          <stop offset="1" stopColor={sea[1]} />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor={variant === "day" ? "#FFFFFF" : p.sun[0]} />
          <stop offset="0.55" stopColor={variant === "day" ? "#FFF6D8" : p.sun[1]} />
          <stop offset="1" stopColor={variant === "day" ? "#FFF6D8" : p.sun[1]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={640} height={252} fill={`url(#${id}-sky)`} />
      {variant !== "night" ? <circle cx={430} cy={variant === "day" ? 70 : 214} r={variant === "day" ? 60 : 150} fill={`url(#${id}-sun)`} opacity={0.9} /> : null}
      {variant === "dusk" ? <circle cx={430} cy={214} r={52} fill={p.sun[0]} opacity={0.85} /> : null}
      <g fill={sil} opacity={variant === "day" ? 0.55 : 0.92}>
        {SKYLINE.map((b) => (
          <rect key={b[0]} x={b[0]} y={252 - b[1]} width={b[2]} height={b[1]} />
        ))}
      </g>
      {variant === "night"
        ? SKYLINE.filter((_, i) => i % 2 === 0).map((b) => (
            <rect key={`w${b[0]}`} x={b[0] + 4} y={252 - b[1] + 10} width={3} height={b[1] - 20} fill={p.hot} opacity={0.35} />
          ))
        : null}
      <rect x={0} y={252} width={640} height={108} fill={`url(#${id}-sea)`} />
      {variant !== "night"
        ? [262, 274, 288, 304, 322].map((y, i) => (
            <rect key={y} x={430 - (60 - i * 6)} y={y} width={(60 - i * 6) * 2} height={2.5} rx={1.2} fill={variant === "day" ? "#FFFFFF" : p.sun[0]} opacity={0.5 - i * 0.07} />
          ))
        : null}
      {palms ? (
        <>
          <Palm x={64} y={372} s={1.35} c={variant === "day" ? "#1D2B2A" : p.sil} sway />
          <Palm x={150} y={372} s={0.85} c={variant === "day" ? "#1D2B2A" : p.sil} sway />
          <Palm x={590} y={372} s={1.15} c={variant === "day" ? "#1D2B2A" : p.sil} sway />
        </>
      ) : null}
    </svg>
  );
};

export const paletteOf = (skin: Skin = "2026"): Palette => PAL[skin];

export const DriftPlate: React.FC<{
  skin?: Skin;
  uid: string;
  durFrames: number;
  variant?: SceneVariant;
  dim?: number;
  palms?: boolean;
}> = ({ skin = "2002", uid, durFrames, variant = "dusk", dim = 0, palms = true }) => {
  const frame = useCurrentFrame();
  const span = Math.max(durFrames, 1);
  const scale = 1.02 + (frame / span) * 0.07;
  const x = (frame / span) * -10;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${scale}) translateX(${x}px)` }}>
      <Scene variant={variant} skin={skin} uid={uid} palms={palms} />
      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(10,4,7,${dim})` }} /> : null}
    </div>
  );
};
