import React from "react";
import { Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { EndProps, PostcardProps, RapProps } from "../edl/types";
import { FONT, PAL, grad } from "../theme/palette";
import { EASE, cardDropStyle, fadeStyle, letterStyle, loop01, phoneStyle, popStyle, progress, slideStyle } from "../theme/motion";
import { DriftPlate, Palm, SKYLINE, Scene } from "../theme/scene";
import { Exit, Frame, GuideTag, textureFor } from "../theme/stage";
import { SunsetTitle } from "../theme/type";
import { Host, plateOn } from "./host";

const abs: React.CSSProperties = { position: "absolute" };

export const Postcard: React.FC<Host & PostcardProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  line1 = "STARFISH",
  line2 = "ISLAND",
  chapter = "Chapter 02",
  credit = "GTAFolio",
  script,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ext = skin === "2026" ? "#8A2E0C" : "#3A0F5E";
  const extrude = Array.from({ length: 6 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${ext}`).join(", ") + ", 8px 12px 14px rgba(0,0,0,0.45)";
  const ink = skin === "2026" ? "#FFD84A" : "#FF2E88";
  const stroke = skin === "2026" ? "#4A1606" : "#19E3FF";
  const duo = skin === "2026" ? "linear-gradient(135deg, #5C4070 0%, #7E5D98 55%, #8D6AA8 100%)" : "linear-gradient(135deg, #1A0630 0%, #3A0F5E 100%)";
  const glint = progress(frame, fps, 2000, 900, EASE.glide);
  const plate = plateOn(mode);
  const letters = (word: string, delay: number) =>
    word.split("").map((ch, i) => (
      <span key={`${word}-${i}`} style={{ ...letterStyle(frame, fps, delay + i * 45), fontFamily: FONT.slab, fontSize: 40, color: ink, WebkitTextStroke: `1.5px ${stroke}`, textShadow: extrude }}>
        {ch}
      </span>
    ));
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? (
        <div style={{ ...abs, inset: 0, background: duo }}>
          <div style={{ ...abs, inset: 0, opacity: 0.22 }}>
            <svg viewBox="0 0 640 360" width="640" height="360">
              <g fill="none" stroke="#FFFFFF" strokeWidth={1.4}>
                {SKYLINE.map((b) => (
                  <rect key={b[0]} x={b[0]} y={330 - b[1] * 1.4} width={b[2]} height={b[1] * 1.4} />
                ))}
              </g>
              <Palm x={40} y={380} s={1.6} c="#FFFFFF" />
              <Palm x={600} y={380} s={1.4} c="#FFFFFF" />
            </svg>
          </div>
        </div>
      ) : null}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, left: 112, top: 50, width: 416, height: 258, ...cardDropStyle(frame, fps, 120) }}>
          <div style={{ ...abs, inset: 0, background: "#FBFAF6", boxShadow: "0 24px 50px rgba(20,0,30,0.55)", padding: 11, boxSizing: "border-box" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
              <div style={{ ...abs, left: -58, top: -32, width: 640, height: 360, transform: "scale(0.68)", transformOrigin: "0 0" }}>
                <Scene variant={skin === "2026" ? "day" : "dusk"} skin={skin} uid="pc" />
              </div>
              <div style={{ ...abs, left: 0, right: 0, top: 26, textAlign: "center", lineHeight: 1 }}>
                <div>{letters(line1, 700)}</div>
                {line2 ? <div style={{ marginTop: 2 }}>{letters(line2, 1080)}</div> : null}
              </div>
              {script ? (
                <div style={{ ...abs, right: 16, top: 8, fontFamily: FONT.script, fontSize: 22, color: "#FFFFFF", textShadow: "0 2px 0 #3D5BC9" }}>{script}</div>
              ) : null}
              <div style={{ ...abs, left: 14, bottom: 12, display: "flex", alignItems: "center", gap: 6, ...slideStyle(frame, fps, 1500, 450, 0, 26) }}>
                <div style={{ lineHeight: 1 }}>
                  <div style={{ fontFamily: FONT.display, fontSize: 9, color: "#FFFFFF", letterSpacing: "0.08em" }}>{credit}</div>
                  <div style={{ fontFamily: FONT.display, fontSize: 15, color: "#FFFFFF" }}>{chapter}</div>
                </div>
                <svg viewBox="-12 -12 24 24" width="24" height="24">
                  {Array.from({ length: 12 }, (_, i) => (
                    <line key={i} x1={0} y1={-5} x2={0} y2={-11} stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" transform={`rotate(${i * 30})`} />
                  ))}
                  <circle cx={0} cy={0} r={3.4} fill="#FFFFFF" />
                </svg>
              </div>
              <div style={{ ...abs, top: -20, bottom: -20, left: `${-30 + glint * 130}%`, width: 70, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)" }} />
            </div>
          </div>
        </div>
        <GuideTag show={showGuide} text="Leonida postcard" />
      </Exit>
    </Frame>
  );
};

const DEFAULT_ROWS = [
  { label: "Alias", value: "The Harwood Butcher" },
  { label: "Debut", value: "GTA Vice City (2002)" },
  { label: "Voice", value: "Ray Liotta" },
  { label: "Base", value: "Vercetti Estate, Starfish Island" },
];

export const RapSheet: React.FC<Host & RapProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  file = "Rap sheet / File 001",
  name = "TOMMY VERCETTI",
  rows = DEFAULT_ROWS,
  heat = 5,
  heatMax = 6,
  stamp,
  tag = "Layout demo, verify every field",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const uid = `rap-${skin}`;
  const rise = progress(frame, fps, 100, 650, EASE.snap);
  const glint = progress(frame, fps, 2600, 1000, EASE.glide);
  const plate = plateOn(mode);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? <DriftPlate skin={skin} uid="rap" durFrames={durFrames} variant="night" dim={0.35} /> : null}
      <Exit durFrames={durFrames}>
        <div
          style={{
            ...abs,
            left: 40,
            top: 30,
            width: 560,
            height: 290,
            overflow: "hidden",
            background: "linear-gradient(160deg, #8A7FAC 0%, #B98AB8 45%, #F3A07B 100%)",
            border: `4px solid ${p.outline}`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            clipPath: `inset(${(1 - rise) * 100}% 0 0 0)`,
            transform: `translateY(${(1 - rise) * 30}px)`,
          }}
        >
          <div style={{ ...abs, inset: 0, background: `radial-gradient(${p.outline}33 1.3px, transparent 1.6px) 0 0 / 7px 7px`, opacity: progress(frame, fps, 500, 600, EASE.glide) }} />
          <div style={{ ...abs, left: 0, top: 0, bottom: 0, width: 230, background: "repeating-linear-gradient(180deg, rgba(32,4,50,0.25) 0px, rgba(32,4,50,0.25) 1.5px, transparent 1.5px, transparent 24px)" }} />
          <svg viewBox="0 0 230 290" width="230" height="290" style={{ ...abs, left: 0, top: 0, ...slideStyle(frame, fps, 350, 700, 0, 26) }}>
            <defs>
              <pattern id={`${uid}-shirt`} width="18" height="18" patternUnits="userSpaceOnUse">
                <rect width="18" height="18" fill="#3E7CC0" />
                <path d="M4 14 C5 9 6 6 9 4 M9 4 C6 3 3 4 2 6 M9 4 C12 2 15 3 16 5" stroke="#9FE0D0" strokeWidth={1.4} fill="none" />
              </pattern>
            </defs>
            <path d="M20 300 C24 230 60 205 115 200 C170 205 206 230 210 300Z" fill={`url(#${uid}-shirt)`} stroke={p.outline} strokeWidth={5} strokeLinejoin="round" />
            <path d="M92 200 L115 236 L138 200" fill="#F2D6C0" stroke={p.outline} strokeWidth={4} strokeLinejoin="round" />
            <path d="M98 168 L98 204 L132 204 L132 168Z" fill="#C98E6E" stroke={p.outline} strokeWidth={4} />
            <ellipse cx={115} cy={126} rx={44} ry={54} fill="#E2A783" stroke={p.outline} strokeWidth={5} />
            <path d="M115 72 C140 72 159 92 159 126 C159 160 140 180 115 180 C128 160 132 120 115 72Z" fill="#B97A5C" opacity={0.65} />
            <path d="M70 112 C68 80 88 64 116 64 C146 64 162 82 160 112 C150 96 132 90 112 92 C94 94 80 100 70 112Z" fill="#2A1A20" stroke={p.outline} strokeWidth={4} strokeLinejoin="round" />
            <path d="M158 100 C166 120 162 150 152 168" stroke={p.warm} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M206 260 C204 236 194 222 180 214" stroke={p.warm} strokeWidth={4} fill="none" strokeLinecap="round" />
          </svg>
          <div style={{ ...abs, left: 250, top: 22, right: 20 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", color: p.outline, ...fadeStyle(frame, fps, 500, 300) }}>{file}</div>
            <div style={{ marginTop: 8, ...slideStyle(frame, fps, 600, 500, -44, 0) }}><SunsetTitle text={name} size={28} sweepAtMs={2300} /></div>
            {rows.map((r, i) => (
              <div key={r.label} style={{ marginTop: 8, ...slideStyle(frame, fps, 900 + i * 130, 400, -44, 0) }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 8.5, letterSpacing: "0.06em", textTransform: "uppercase", color: p.outline, opacity: 0.75 }}>{r.label}</div>
                <div style={{ fontFamily: FONT.body, fontSize: 15, fontWeight: 800, color: "#1A0B1E", marginTop: 1 }}>{r.value}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 3, marginTop: 12, alignItems: "center" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 8.5, color: p.outline, marginRight: 6 }}>Heat</span>
              {Array.from({ length: heatMax }, (_, i) => {
                const on = i < heat;
                const blink = on && Math.floor(loop01(frame - ((2400 + i * 60) / 1000) * fps, fps, 700) * 2) % 2 === 0 && frame < ((2400 + 700) / 1000) * fps;
                return (
                  <svg key={i} viewBox="0 0 24 24" width="20" height="20" style={{ ...popStyle(frame, fps, 1550 + i * 110, 300), opacity: blink ? 0.35 : undefined }}>
                    <path d="M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6Z" fill={on ? "#FFFFFF" : "rgba(255,255,255,0.25)"} stroke={p.outline} strokeWidth={2} strokeLinejoin="round" />
                  </svg>
                );
              })}
            </div>
          </div>
          {stamp ? (
            <div style={{ ...abs, right: 16, bottom: 16, border: `3px solid ${p.news}`, color: p.news, fontFamily: FONT.display, fontSize: 22, padding: "4px 8px", background: "rgba(255,255,255,0.8)", ...stampPop(frame, fps, 1800) }}>
              {stamp}
            </div>
          ) : null}
          <div style={{ ...abs, top: -30, bottom: -30, left: `${-20 + glint * 140}%`, width: 90, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
        </div>
        <GuideTag show={showGuide} text={tag} />
      </Exit>
    </Frame>
  );
};

const stampPop = (frame: number, fps: number, delayMs: number): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, 380, EASE.pop);
  if (p <= 0) return { opacity: 0, transform: "scale(2.2) rotate(-16deg)" };
  if (p >= 1) return { opacity: 1, transform: "scale(1) rotate(-8deg)" };
  return { opacity: Math.min(1, p / 0.4), transform: `scale(${2.2 - 1.2 * Math.min(p, 1)}) rotate(${-16 + 8 * Math.min(p, 1)}deg)` };
};

export const EndCard: React.FC<Host & EndProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  clock = "22:41",
  date = "Thursday, Nov 19",
  notes = [
    { title: "New video", body: "Every GTA V story mission, mapped" },
    { title: "Part 2 drops soon", body: "" },
  ],
  subscribe = "Subscribe",
  subscribed = "Subscribed",
  slots = ["End-screen slot: next video", "End-screen slot: best for viewer"],
  variant = "full",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const corner = variant === "corner";
  const plate = plateOn(mode) && !corner;
  const swap = progress(frame, fps, 3200, 200, Easing.linear);
  const ripple = progress(frame, fps, 3050, 600, EASE.snap);
  return (
    <Frame skin={skin} texture={corner ? "none" : textureFor(skin, mode)}>
      {plate ? <DriftPlate skin={skin} uid="end" durFrames={durFrames} variant="night" dim={0.35} /> : null}
      <Exit durFrames={durFrames}>
        {plate
          ? slots.map((slot, i) => (
              <div
                key={slot}
                style={{
                  ...abs,
                  left: 36,
                  top: 44 + i * 150,
                  width: 250,
                  height: 140,
                  borderRadius: 10,
                  border: "2px solid transparent",
                  backgroundImage: `linear-gradient(rgba(10,4,7,0.55), rgba(10,4,7,0.55)), ${grad(p, 135)}`,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 10,
                  boxSizing: "border-box",
                  ...slideStyle(frame, fps, 200 + i * 160, 500, -44, 0),
                }}
              >
                <div style={{ fontFamily: FONT.mono, fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "#FFFFFF" }}>{slot}</div>
              </div>
            ))
          : null}
        <div style={{ ...abs, ...(corner ? { right: 28, bottom: 24, width: 150, height: 280 } : { left: 380, top: 14, width: 176, height: 336 }), borderRadius: corner ? 22 : 28, background: "#0A0407", padding: corner ? 5 : 7, boxSizing: "border-box", boxShadow: "0 30px 60px rgba(0,0,0,0.7), inset 0 0 0 2px #2C2430", ...phoneStyle(frame, fps, 250) }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: corner ? 18 : 22, overflow: "hidden" }}>
            <div style={{ ...abs, left: -250, top: 0, width: 640, height: 360, transform: "scale(0.95)", transformOrigin: "62% 0" }}>
              <Scene variant="dusk" skin={skin} uid="ph" />
            </div>
            <div style={{ ...abs, inset: 0, background: "rgba(10,4,7,0.25)" }} />
            <div style={{ ...abs, left: corner ? 46 : 58, top: 8, width: 46, height: 12, borderRadius: 6, background: "#000" }} />
            <div style={{ ...abs, left: 0, right: 0, top: corner ? 28 : 36, textAlign: "center", fontFamily: FONT.body, fontWeight: 300, fontSize: corner ? 28 : 40, color: "#FFFFFF" }}>{clock}</div>
            <div style={{ ...abs, left: 0, right: 0, top: corner ? 62 : 84, textAlign: "center", fontFamily: FONT.body, fontSize: 9, color: "rgba(255,255,255,0.85)" }}>{date}</div>
            {notes[0] ? <Note skin={skin} note={notes[0]} top={corner ? 84 : 110} delay={1150} /> : null}
            <div style={{ ...abs, left: 8, right: 8, top: corner ? 168 : 196, background: "rgba(250,226,220,0.82)", borderRadius: 12, padding: 8, ...notif(frame, fps, 1650) }}>
              <div style={{ fontFamily: FONT.body, fontSize: 9.5, fontWeight: 700, color: "#1A0B1E" }}>{notes[1]?.title ?? "Part 2 drops soon"}</div>
              <div style={{ position: "relative", marginTop: 7, height: 24 }}>
                <div style={{ ...abs, inset: 0, borderRadius: 12, background: grad(p, 90), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 10, color: "#FFFFFF", letterSpacing: "0.06em", opacity: 1 - swap }}>{subscribe}</div>
                <div style={{ ...abs, inset: 0, borderRadius: 12, background: "#1A0B1E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 10, color: "#FFFFFF", letterSpacing: "0.06em", opacity: swap }}>{subscribed} {"\u2713"}</div>
                <div style={{ ...abs, left: 52, top: -8, width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.8)", opacity: (1 - ripple) * 0.8, transform: `scale(${0.2 + ripple * 2.4})` }} />
              </div>
            </div>
          </div>
        </div>
        <GuideTag show={showGuide} text="End card" />
      </Exit>
    </Frame>
  );
};

const Note: React.FC<{ skin: "2026" | "2002"; note: { title: string; body: string }; top: number; delay: number }> = ({ skin, note, top, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  return (
    <div style={{ ...abs, left: 8, right: 8, top, background: "rgba(250,226,220,0.82)", borderRadius: 12, padding: 8, ...notif(frame, fps, delay) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 16, height: 16, borderRadius: 4, background: grad(p, 135), fontFamily: FONT.display, fontSize: 7, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>GF</div>
        <div style={{ fontFamily: FONT.body, fontSize: 8.5, fontWeight: 700, color: "#1A0B1E" }}>GTAFOLIO</div>
        <div style={{ fontFamily: FONT.body, fontSize: 8, color: "#5A4A55", marginLeft: "auto" }}>now</div>
      </div>
      <div style={{ fontFamily: FONT.body, fontSize: 9.5, fontWeight: 700, color: "#1A0B1E", marginTop: 5 }}>{note.title}</div>
      {note.body ? <div style={{ fontFamily: FONT.body, fontSize: 9, color: "#1A0B1E", marginTop: 1, lineHeight: 1.3 }}>{note.body}</div> : null}
    </div>
  );
};

const notif = (frame: number, fps: number, delayMs: number): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, 500, EASE.snap);
  if (p >= 1) return { opacity: 1 };
  const blur = (1 - p) * 4;
  return { opacity: p, transform: `translateY(${(1 - p) * -26}px) scale(${0.92 + 0.08 * p})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined };
};
