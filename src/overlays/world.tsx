import React from "react";
import { Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { MapProps, MapTone, TimelineProps, TimelineSign, WipeProps } from "../edl/types";
import { FONT, PAL, Palette } from "../theme/palette";
import { EASE, loop01, progress, slideStyle, springStyle } from "../theme/motion";
import { Scene } from "../theme/scene";
import { Exit, Frame, GuideTag, textureFor } from "../theme/stage";
import { SunsetTitle } from "../theme/type";
import { unexpected } from "../theme/never";
import { Host, plateOn } from "./host";

const abs: React.CSSProperties = { position: "absolute" };

const toneColor = (p: Palette, tone: MapTone) => {
  switch (tone) {
    case "cool":
      return p.cool;
    case "warm":
      return p.warm;
    case "hot":
      return p.hot;
    default:
      return unexpected(tone);
  }
};

const DEFAULT_ROUTE = "M322 182 C350 196 372 214 392 236 C410 256 420 272 430 290";

export const GpsMap: React.FC<Host & MapProps> = ({
  durFrames,
  skin = "2026",
  mode = "cutaway",
  showGuide,
  blips = [
    { x: 322, y: 182, tone: "cool", letter: "T", delayMs: 450 },
    { x: 430, y: 290, tone: "warm", letter: "6", delayMs: 2050 },
  ],
  labels = [
    { x: 322, y: 150, text: "STARFISH ISLAND", delayMs: 700 },
    { x: 470, y: 330, text: "OCEAN BEACH", delayMs: 2250 },
    { x: 160, y: 200, text: "MAINLAND", delayMs: 300 },
  ],
  route = DEFAULT_ROUTE,
  credit = "Stylized stand-in. Yanis v16 Leonida map is CC BY 4.0 if that art is used.",
  legend = [
    { tone: "line", label: "GPS route" },
    { tone: "cool", label: "2002 location" },
    { tone: "warm", label: "2026 location" },
  ],
  showRoute = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const uid = `map-${skin}`;
  const zoom = progress(frame, fps, 200, 5000, EASE.glide);
  const scale = 1 + zoom * 0.32;
  const draw = progress(frame, fps, 900, 1200, EASE.glide);
  const dashes = loop01(frame, fps, 900);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      <svg viewBox="0 0 640 360" width="640" height="360" style={{ ...abs, inset: 0 }}>
        <defs>
          <linearGradient id={`${uid}-wt`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.water[0]} />
            <stop offset="1" stopColor={p.water[1]} />
          </linearGradient>
        </defs>
        <g style={{ transformOrigin: "380px 236px", transform: `scale(${scale})` }}>
          <rect x={-100} y={-100} width={840} height={560} fill={`url(#${uid}-wt)`} />
          {[40, 90, 140, 190, 240, 290, 340].map((y) => (
            <path key={y} d={`M-60 ${y} q 40 -6 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} stroke="#FFFFFF" strokeOpacity={0.06} fill="none" />
          ))}
          <path d="M90 50 C160 22 232 44 252 106 C272 170 242 252 200 302 C150 334 98 312 78 252 C58 190 48 104 90 50Z" fill={p.land} stroke={p.edge} strokeWidth={4} />
          <path d="M402 34 C444 24 474 56 474 120 C474 200 464 282 432 322 C406 344 380 312 385 252 C390 182 380 88 402 34Z" fill={p.land} stroke={p.edge} strokeWidth={4} />
          <path d="M298 166 C320 156 348 166 348 184 C348 202 322 208 300 200 C287 194 287 174 298 166Z" fill={p.land} stroke={p.edge} strokeWidth={4} />
          <g stroke="#F1E9D4" strokeOpacity={0.4} strokeWidth={1.4} fill="none">
            <path d="M100 90 L230 120 M92 160 L246 170 M110 240 L220 220 M150 60 L170 300" />
            <path d="M412 60 L456 120 L440 220 L420 300 M398 150 L466 160 M392 240 L456 250" />
            <path d="M248 150 L298 178 M348 186 L388 170" strokeDasharray="4 3" />
          </g>
          {showRoute ? (
            <>
              <path d={route} fill="none" stroke={p.hot} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 6px ${p.hot})` }} />
              <path d={route} fill="none" stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={2} strokeLinecap="round" strokeDasharray="6 18" strokeDashoffset={-dashes * 48} opacity={progress(frame, fps, 2100, 300, EASE.glide)} />
            </>
          ) : null}
          {blips.map((b) => {
            const col = toneColor(p, b.tone);
            const pop = progress(frame, fps, b.delayMs ?? 400, 380, EASE.pop);
            const pulse = loop01(frame - ((b.delayMs ?? 400) / 1000) * fps, fps, 1500);
            return (
              <g key={`${b.letter}-${b.x}-${b.y}`}>
                <circle cx={b.x} cy={b.y} r={10 + pulse * 18} fill="none" stroke={col} strokeWidth={2} opacity={0.8 * (1 - pulse)} />
                <g opacity={Math.min(1, pop * 2)} style={{ transformOrigin: `${b.x}px ${b.y}px`, transform: `scale(${0.4 + 0.6 * Math.min(pop, 1.15)})` }}>
                  <circle cx={b.x} cy={b.y} r={10} fill={col} stroke="#FFFFFF" strokeWidth={2.5} />
                  <text x={b.x} y={b.y + 4} textAnchor="middle" fontSize={11} fontFamily={FONT.display} fill="#FFFFFF">
                    {b.letter}
                  </text>
                </g>
              </g>
            );
          })}
          {labels.map((l) => (
            <text
              key={l.text}
              x={l.x}
              y={l.y}
              textAnchor="middle"
              fontSize={12}
              fontFamily={FONT.display}
              letterSpacing={2}
              fill="#FFFFFF"
              stroke="#0A0407"
              strokeWidth={3.5}
              paintOrder="stroke"
              opacity={progress(frame, fps, l.delayMs ?? 400, 400, EASE.glide)}
            >
              {l.text}
            </text>
          ))}
        </g>
      </svg>
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, right: 14, top: 14, background: "rgba(10,4,7,0.72)", padding: "8px 10px", borderRadius: 4, ...slideStyle(frame, fps, 1200, 450, 40, 0) }}>
          {legend.map((row) => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: FONT.mono, fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", color: "#FFFFFF", marginTop: 3 }}>
              <div
                style={{
                  width: row.tone === "line" ? 16 : 9,
                  height: row.tone === "line" ? 3 : 9,
                  borderRadius: 5,
                  background: row.tone === "line" ? p.hot : toneColor(p, row.tone),
                  border: row.tone === "line" ? "none" : "1.5px solid #FFFFFF",
                }}
              />
              {row.label}
            </div>
          ))}
        </div>
        <div style={{ ...abs, left: 12, bottom: 8, maxWidth: 460, fontFamily: FONT.mono, fontSize: 8, lineHeight: 1.35, letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>
          {credit}
        </div>
        <GuideTag show={showGuide} text="Stylized map, not to scale" />
      </Exit>
    </Frame>
  );
};

export const VhsWipe: React.FC<Host & WipeProps> = ({
  durFrames,
  skin = "2026",
  showGuide,
  thenYear = "2002",
  thenLabel = "GTA Vice City",
  nowYear = "2026",
  nowLabel = "GTA VI",
  tag = "Stand-in art for footage",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL["2026"];
  const vhs = PAL["2002"];
  const reveal = progress(frame, fps, 700, 900, EASE.glide);
  const leftInset = 100 - reveal * 50;
  const flashT = progress(frame, fps, 1450, 350, Easing.linear);
  const flash = flashT <= 0 || flashT >= 1 ? 0 : flashT < 0.3 ? (flashT / 0.3) * 0.55 : 0.55 * (1 - (flashT - 0.3) / 0.7);
  const band = loop01(frame, fps, 2600);
  const chroma = Math.floor(loop01(frame, fps, 300) * 2) % 2 === 0;
  const shadow = chroma
    ? "-2px 0 rgba(255,46,136,0.85), 2px 0 rgba(25,227,255,0.85)"
    : "-3px 0 rgba(255,46,136,0.85), 1px 0 rgba(25,227,255,0.85)";
  return (
    <Frame skin={skin} texture="grain">
      <div style={{ ...abs, inset: 0, filter: "saturate(1.4) contrast(1.1)" }}>
        <Scene variant="dusk" skin="2002" uid={`${thenYear}-vhs`} />
        <div style={{ ...abs, inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 8px), repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)" }} />
        <div style={{ ...abs, left: 0, right: 0, top: -80 + band * 520, height: 30, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.14), transparent)" }} />
      </div>
      <div style={{ ...abs, inset: 0, clipPath: `inset(0 0 0 ${leftInset}%)` }}>
        <Scene variant="dusk" skin="2026" uid={`${nowYear}-hdr`} />
        <div style={{ ...abs, inset: 0, background: "radial-gradient(40% 40% at 67% 60%, rgba(255,226,176,0.35), transparent 70%)" }} />
      </div>
      <div style={{ ...abs, inset: 0, background: "#FFFFFF", opacity: flash }} />
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, top: -20, bottom: -20, width: 6, left: `${leftInset}%`, marginLeft: -3, background: "#FFFFFF", boxShadow: `0 0 10px #FFFFFF, 0 0 26px ${p.hot}, 0 0 60px ${p.warm}` }}>
          <div style={{ ...abs, left: -40, top: 130, width: 86, height: 86, borderRadius: 43, background: `radial-gradient(circle, rgba(255,255,255,0.9), ${p.warm}55 35%, transparent 70%)` }} />
        </div>
        <div style={{ ...abs, left: 24, top: 26, ...slideStyle(frame, fps, 150, 450, -44, 0) }}>
          <div style={{ fontFamily: FONT.vhs, fontSize: 16, color: "#FFFFFF", textShadow: shadow }}>{"PLAY  \u25B6  SP"}</div>
          <div style={{ fontFamily: FONT.vhs, fontSize: 44, color: "#FFFFFF", marginTop: 6, textShadow: shadow }}>{thenYear}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: vhs.cream, marginTop: 4 }}>{thenLabel}</div>
        </div>
        <div style={{ ...abs, right: 26, top: 22, textAlign: "right", ...springStyle(frame, fps, 1500, 650) }}>
          <SunsetTitle text={nowYear} size={50} sweepAtMs={2200} />
          <div style={{ fontFamily: FONT.track, fontWeight: 500, textTransform: "uppercase", fontSize: 10, color: "#FFFFFF", marginTop: 8, letterSpacing: "0.3em" }}>{nowLabel}</div>
        </div>
        <GuideTag show={showGuide} text={tag} />
      </Exit>
    </Frame>
  );
};

const DEFAULT_SIGNS: TimelineSign[] = [
  { year: "1986", caption: "Vice City story set" },
  { year: "2002", caption: "Vice City releases" },
  { year: "2006", caption: "VCS releases" },
  { year: "2026", caption: "GTA VI arrives", accent: true },
];

export const HighwayTimeline: React.FC<Host & TimelineProps> = ({
  durFrames,
  skin = "2026",
  mode = "cutaway",
  showGuide,
  signs = DEFAULT_SIGNS,
  pan = 70,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const plate = plateOn(mode);
  const road = loop01(frame, fps, 700);
  const panP = progress(frame, fps, 0, Math.max(1200, durFrames / fps * 1000), Easing.linear);
  const count = Math.max(signs.length, 1);
  const signW = count > 4 ? 118 : 140;
  const step = count > 4 ? 126 : 162;
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? (
        <>
          <div style={{ ...abs, inset: 0, transform: `scale(${1.02 + (frame / Math.max(durFrames, 1)) * 0.07})` }}>
            <Scene variant="dusk" skin={skin} uid="hwy" palms={false} />
          </div>
          <div style={{ ...abs, left: 0, right: 0, bottom: 0, height: 62, background: "#1B1620" }} />
          <div style={{ ...abs, left: 0, right: 0, bottom: 28, height: 4, background: "repeating-linear-gradient(90deg, #F4D35E 0px, #F4D35E 40px, transparent 40px, transparent 80px)", backgroundSize: "160px 4px", backgroundPositionX: -road * 160 }} />
        </>
      ) : null}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, inset: 0, transform: `translateX(${-pan * panP}px)` }}>
          {signs.map((s, i) => {
            const delay = s.delayMs ?? 300 + i * 380;
            const pop = progress(frame, fps, delay, 550, Easing.linear);
            const y = pop <= 0 ? 70 : pop >= 1 ? 0 : stopsLite(pop, [0, 0.7, 1], [70, -6, 0]);
            const sy = pop <= 0 ? 0.4 : pop >= 1 ? 1 : stopsLite(pop, [0, 0.7, 1], [0.4, 1.04, 1]);
            return (
              <div key={`${s.year}-${i}`} style={{ ...abs, left: 40 + i * step, bottom: 62, width: signW, transformOrigin: "bottom center", opacity: Math.min(1, pop * 2), transform: `translateY(${y}px) scaleY(${sy})` }}>
                <div style={{ background: s.accent ? undefined : "#0B6E3D", backgroundImage: s.accent ? `linear-gradient(135deg, ${p.stops.join(", ")})` : undefined, border: "3px solid #FFFFFF", borderRadius: 8, padding: "10px 8px 9px", textAlign: "center", boxShadow: "0 10px 24px rgba(0,0,0,0.45)" }}>
                  {s.accent ? <div style={{ fontFamily: FONT.display, fontSize: 9, color: p.outline, background: "#FFFFFF", display: "inline-block", padding: "2px 6px", borderRadius: 3, marginBottom: 6 }}>Now</div> : null}
                  <div style={{ fontFamily: FONT.display, fontSize: count > 4 ? 24 : 30, color: "#FFFFFF" }}>{s.year}</div>
                  <div style={{ fontFamily: FONT.body, fontSize: 11, fontWeight: 700, color: "#FFFFFF", marginTop: 5 }}>{s.caption}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", padding: "0 22px" }}>
                  <div style={{ width: 5, height: 70, background: "#8E949C" }} />
                  <div style={{ width: 5, height: 70, background: "#8E949C" }} />
                </div>
              </div>
            );
          })}
        </div>
        <GuideTag show={showGuide} text="Highway timeline" />
      </Exit>
    </Frame>
  );
};

const stopsLite = (p: number, points: number[], values: number[]) => {
  let i = 0;
  while (i < points.length - 1 && p > points[i + 1]) i += 1;
  const a = points[i];
  const b = points[Math.min(points.length - 1, i + 1)];
  const t = b === a ? 1 : (p - a) / (b - a);
  return values[i] + (values[Math.min(values.length - 1, i + 1)] - values[i]) * Math.min(1, Math.max(0, t));
};
