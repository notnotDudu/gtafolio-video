import React from "react";
import { Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { BeatProps, CounterProps, LockupProps, PresentsProps } from "../edl/types";
import { FONT, PAL, grad } from "../theme/palette";
import { EASE, fadeStyle, progress, slideStyle, springStyle, trackStyle } from "../theme/motion";
import { DriftPlate, Palm } from "../theme/scene";
import { Exit, Frame, GuideTag, textureFor, useSkin } from "../theme/stage";
import { SunsetTitle } from "../theme/type";
import { Host, plateOn } from "./host";

const abs: React.CSSProperties = { position: "absolute" };

export const Lockup: React.FC<Host & LockupProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  monogram = "GF",
  wordmark = "gtafolio",
  tagline = "Vice City, then and now",
  episode = "Episode 01",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const uid = `lock-${skin}`;
  const rim = progress(frame, fps, 150, 1000, Easing.linear);
  const strokes = progress(frame, fps, 1050, 300, EASE.glide);
  const fill = progress(frame, fps, 1050, 950, EASE.snap);
  const sweep = progress(frame, fps, 2700, 1000, EASE.glide);
  const plate = plateOn(mode);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode, plate ? undefined : "none")}>
      {plate ? (
        <div style={{ ...abs, inset: 0, background: `radial-gradient(60% 75% at 50% 48%, ${skin === "2026" ? "#2C0B3E" : "#1A0630"} 0%, ${p.ink} 72%)` }} />
      ) : null}
      <Exit durFrames={durFrames}>
        <svg viewBox="0 0 640 360" width="640" height="360" style={{ ...abs, left: 0, top: 0 }}>
          <defs>
            <linearGradient id={`${uid}-lg`} x1="0" y1="0" x2="0" y2="1">
              {p.stops.map((s, i) => (
                <stop key={s} offset={i / (p.stops.length - 1)} stopColor={s} />
              ))}
            </linearGradient>
            <linearGradient id={`${uid}-sw`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${uid}-lc`}>
              <text x={320} y={262} textAnchor="middle" fontSize={236} fontWeight={400} fontFamily={FONT.display} letterSpacing={-14}>
                {monogram}
              </text>
            </clipPath>
          </defs>
          <text
            x={320}
            y={262}
            textAnchor="middle"
            fontSize={236}
            fontFamily={FONT.display}
            letterSpacing={-14}
            fill={p.outline}
            stroke={p.hot}
            strokeWidth={3}
            opacity={rim}
            style={{ filter: `drop-shadow(0 0 8px ${p.hot}) drop-shadow(0 0 22px ${p.warm})` }}
          >
            {monogram}
          </text>
          <text x={320} y={262} textAnchor="middle" fontSize={236} fontFamily={FONT.display} letterSpacing={-14} fill="none" stroke={p.outline} strokeWidth={26} strokeLinejoin="round" opacity={strokes}>
            {monogram}
          </text>
          <text x={320} y={262} textAnchor="middle" fontSize={236} fontFamily={FONT.display} letterSpacing={-14} fill="none" stroke={p.inner} strokeWidth={9} strokeLinejoin="round" opacity={strokes}>
            {monogram}
          </text>
          <g clipPath={`url(#${uid}-lc)`}>
            <g style={{ transform: `translateY(${(1 - fill) * 240}px)` }}>
              <rect x={0} y={60} width={640} height={230} fill={`url(#${uid}-lg)`} />
              <g opacity={0.3}>
                <Palm x={205} y={300} s={1} c={p.outline} sway />
                <Palm x={420} y={306} s={1.15} c={p.outline} sway />
              </g>
            </g>
            <rect x={-240} y={40} width={150} height={270} fill={`url(#${uid}-sw)`} style={{ transform: `translateX(${sweep * 900}px)` }} />
          </g>
          <g style={springStyle(frame, fps, 1750, 650)}>
            <text x={320} y={214} textAnchor="middle" fontSize={70} fontFamily={FONT.wordmark} fill="#FFFFFF" stroke={p.ink} strokeWidth={14} strokeLinejoin="round" paintOrder="stroke">
              {wordmark}
            </text>
          </g>
        </svg>
        <div style={{ ...abs, left: 0, right: 0, top: 296, textAlign: "center", fontFamily: FONT.track, fontWeight: 400, textTransform: "uppercase", fontSize: 13, color: p.cream, ...trackStyle(frame, fps, 2350, 1000) }}>
          {tagline}
        </div>
        <div style={{ ...abs, left: 0, right: 0, top: 322, textAlign: "center", fontFamily: FONT.mono, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 9, color: "rgba(255,255,255,0.6)", ...fadeStyle(frame, fps, 2900, 500) }}>
          {episode}
        </div>
        <GuideTag show={showGuide} text="Lockup sting" />
      </Exit>
    </Frame>
  );
};

export const Presents: React.FC<Host & PresentsProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  brand = "GTAFolio",
  presents = "Presents",
  kicker = "What's left of",
  titleA = "TOMMY'S",
  titleB = "VICE CITY",
  subtitle = "In GTA VI",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const early = progress(frame, fps, 2000, 400, EASE.exit);
  const plate = plateOn(mode);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? (
        <>
          <DriftPlate skin={skin} uid="presents" durFrames={durFrames} />
          <div style={{ ...abs, inset: 0, background: "linear-gradient(180deg, rgba(10,4,7,0.15), rgba(10,4,7,0.55))" }} />
        </>
      ) : null}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, left: 0, right: 0, top: 140, textAlign: "center", opacity: 1 - early, filter: early > 0.02 ? `blur(${early * 8}px)` : undefined }}>
          <div style={{ fontFamily: FONT.track, fontWeight: 500, textTransform: "uppercase", fontSize: 20, color: "#FFFFFF", ...trackStyle(frame, fps, 150, 1300) }}>{brand}</div>
          <div style={{ fontFamily: FONT.track, fontWeight: 400, textTransform: "uppercase", fontSize: 13, color: "#FFFFFF", marginTop: 10, ...trackStyle(frame, fps, 350, 1300) }}>{presents}</div>
        </div>
        <div style={{ ...abs, left: 0, right: 0, top: 92, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.track, fontWeight: 400, textTransform: "uppercase", fontSize: 12, color: p.cream, ...trackStyle(frame, fps, 2350, 900) }}>{kicker}</div>
          <div style={{ marginTop: 14 }}><SunsetTitle text={titleA} size={62} sweepAtMs={3500} delayMs={2550} enter="spring" /></div>
          <div style={{ marginTop: 6 }}><SunsetTitle text={titleB} size={62} sweepAtMs={3650} delayMs={2700} enter="spring" /></div>
          <div style={{ fontFamily: FONT.track, fontWeight: 400, textTransform: "uppercase", fontSize: 12, color: "#FFFFFF", marginTop: 16, ...trackStyle(frame, fps, 3100, 900) }}>{subtitle}</div>
        </div>
        <GuideTag show={showGuide} text="Cold open" />
      </Exit>
    </Frame>
  );
};

export const BeatCard: React.FC<Host & BeatProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  chapter = "Chapter 02",
  title = "FACT CHECKED",
  progressLabel = "Case progress",
  progress: amount = 0.43,
  progressText = "3 / 7",
  tag = "Progress is a layout example",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const bars = progress(frame, fps, 0, 450, EASE.snap);
  const grow = progress(frame, fps, 1300, 900, EASE.snap);
  const plate = plateOn(mode);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? <DriftPlate skin={skin} uid="beat" durFrames={durFrames} dim={0.3} /> : null}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, left: 0, right: 0, top: 0, height: 56, background: "#000", transformOrigin: "top", transform: `scaleY(${bars})` }} />
        <div style={{ ...abs, left: 0, right: 0, bottom: 0, height: 56, background: "#000", transformOrigin: "bottom", transform: `scaleY(${bars})` }} />
        <div style={{ ...abs, left: 0, right: 0, top: 104, textAlign: "center" }}>
          <div style={{ fontFamily: FONT.track, fontWeight: 400, textTransform: "uppercase", fontSize: 12, color: p.cream, ...trackStyle(frame, fps, 350, 800) }}>{chapter}</div>
          <div style={{ marginTop: 14 }}><SunsetTitle text={title} size={54} sweepAtMs={1500} delayMs={600} enter="spring" /></div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 20, ...slideStyle(frame, fps, 1100, 450, 0, 26) }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "#FFFFFF" }}>{progressLabel}</div>
            <div style={{ width: 160, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${Math.round(amount * 100)}%`, height: "100%", background: grad(p, 90), transformOrigin: "left", transform: `scaleX(${grow})` }} />
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: "0.06em", color: "#FFFFFF" }}>{progressText}</div>
          </div>
        </div>
        <GuideTag show={showGuide} text={tag} />
      </Exit>
    </Frame>
  );
};

const Reel: React.FC<{ to: number; size: number }> = ({ to, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = progress(frame, fps, 500, 1500, Easing.linear);
  const eased = q >= 1 ? 1 : 1 - Math.pow(2, -10 * q);
  const value = eased * to;
  const places = String(Math.max(0, Math.round(to))).length || 1;
  const done = value >= to - 0.001;
  const p = PAL[useSkin()];
  return (
    <div style={{ display: "flex", filter: `drop-shadow(0 6px 0 ${p.outline}) drop-shadow(0 0 24px ${p.hot}66)` }}>
      {Array.from({ length: places }, (_, index) => places - 1 - index).map((k) => {
        const pw = 10 ** k;
        const x = k === 0 ? value : Math.floor(value / pw) + Math.max(0, (value % pw) - (pw - 1));
        const off = x % 10;
        const blur = done ? 0 : (k === 0 ? 3 : 1.2) * (1 - value / Math.max(to, 0.001));
        return (
          <div key={k} style={{ height: size, overflow: "hidden", width: size * 0.62 }}>
            <div style={{ transform: `translateY(${-off * size}px)`, filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit, i) => (
                <div
                  key={`${k}-${i}`}
                  style={{
                    fontFamily: FONT.display,
                    fontSize: size,
                    height: size,
                    lineHeight: `${size}px`,
                    textAlign: "center",
                    color: "transparent",
                    backgroundImage: grad(p),
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const StatCounter: React.FC<Host & CounterProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  to = 24,
  label = "Years",
  caption = "between GTA Vice City (2002) and GTA VI (2026)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const grow = progress(frame, fps, 1700, 700, EASE.snap);
  const plate = plateOn(mode);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? <DriftPlate skin={skin} uid="count" durFrames={durFrames} dim={0.45} /> : <div style={{ ...abs, inset: 0, background: "rgba(10,4,7,0.45)" }} />}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={springStyle(frame, fps, 200, 600)}><Reel to={to} size={150} /></div>
          <div style={{ height: 4, width: 170, marginTop: 6, background: grad(p, 90), transformOrigin: "left", transform: `scaleX(${grow})` }} />
          <div style={{ fontFamily: FONT.track, fontWeight: 500, textTransform: "uppercase", fontSize: 16, color: "#FFFFFF", marginTop: 12, ...trackStyle(frame, fps, 1800, 800) }}>{label}</div>
          <div style={{ fontFamily: FONT.body, fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 8, ...fadeStyle(frame, fps, 2200, 500) }}>{caption}</div>
        </div>
        <GuideTag show={showGuide} text="Verified numbers only" />
      </Exit>
    </Frame>
  );
};
