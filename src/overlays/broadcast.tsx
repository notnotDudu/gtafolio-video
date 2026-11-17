import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CctvProps, ChyronProps, CitationProps, ShortsProps, SocialProps } from "../edl/types";
import { FONT, PAL, grad } from "../theme/palette";
import { EASE, fadeStyle, loop01, popStyle, progress, shakeStyle, slideStyle, springStyle, stampStyle, wipeInset } from "../theme/motion";
import { DriftPlate, Scene } from "../theme/scene";
import { Exit, Frame, GuideTag, chromaShadow, textureFor } from "../theme/stage";
import { SunsetTitle } from "../theme/type";
import { unexpected } from "../theme/never";
import { Host, plateOn } from "./host";

const abs: React.CSSProperties = { position: "absolute" };

const blink = (frame: number, fps: number, periodMs: number) => (loop01(frame, fps, periodMs) < 0.55 ? 1 : 0.15);

export const Chyron: React.FC<Host & ChyronProps> = ({
  durFrames,
  skin = "2002",
  mode = "lower",
  showGuide,
  live = "Live",
  station = "GTAFolio",
  desk = "News",
  clock = "10:34 ET",
  headline = "Vercetti Estate: still standing?",
  ticker = "Rockstar quote under review   /   claim unverified   /   then vs now: Starfish Island   /   GTA VI out Nov 19   /   ",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const plate = plateOn(mode);
  const glint = progress(frame, fps, 1300, 800, EASE.glide);
  const tickerP = loop01(frame, fps, 9000);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? <DriftPlate skin={skin} uid="chyron" durFrames={durFrames} variant="night" dim={0.1} /> : null}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, left: 22, top: 20, display: "flex", alignItems: "center", gap: 6, background: p.news, border: "2px solid #FFFFFF", padding: "4px 9px", ...popStyle(frame, fps, 150, 350) }}>
          <div style={{ width: 7, height: 7, borderRadius: 4, background: "#FFFFFF", opacity: blink(frame, fps, 900) }} />
          <div style={{ fontFamily: FONT.news, fontWeight: 600, fontSize: 15, color: "#FFFFFF", letterSpacing: "0.06em", textTransform: "uppercase" }}>{live}</div>
        </div>
        <div style={{ ...abs, left: 22, bottom: 26, width: 96, height: 66, clipPath: `inset(${(1 - progress(frame, fps, 200, 450, EASE.snap)) * 100}% 0 0 0)`, transform: `translateY(${(1 - progress(frame, fps, 200, 450, EASE.snap)) * 30}px)` }}>
          <div style={{ background: "#FFFFFF", height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.news, fontWeight: 600, fontSize: 13, color: "#111" }}>{station}</div>
          <div style={{ background: p.news, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.news, fontWeight: 600, fontSize: 15, color: "#FFFFFF", letterSpacing: "0.1em", textTransform: "uppercase" }}>{desk}</div>
          <div style={{ background: "#111", height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.mono, fontSize: 10, color: "#FFFFFF" }}>{clock}</div>
        </div>
        <div style={{ ...abs, left: 122, right: 22, bottom: 50, height: 42, overflow: "hidden", background: `linear-gradient(180deg, ${skin === "2026" ? "#F2363C" : "#FF5AA5"} 0%, ${p.news} 55%, ${skin === "2026" ? "#B50E14" : "#C2176A"} 100%)`, clipPath: wipeInset(progress(frame, fps, 320, 520, EASE.snap)) }}>
          <div style={{ ...abs, left: 14, top: 8, fontFamily: FONT.news, fontWeight: 600, fontSize: 22, color: "#FFFFFF", letterSpacing: "0.01em", textTransform: "uppercase", ...slideStyle(frame, fps, 620, 380, 0, 18) }}>{headline}</div>
          <div style={{ ...abs, top: 0, bottom: 0, left: `${-10 + glint * 120}%`, width: 80, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)" }} />
        </div>
        <div style={{ ...abs, left: 122, right: 22, bottom: 26, height: 24, overflow: "hidden", background: "#F4F4F4", clipPath: wipeInset(progress(frame, fps, 560, 450, EASE.snap)) }}>
          <div style={{ display: "inline-flex", whiteSpace: "nowrap", transform: `translateX(${-tickerP * 50}%)` }}>
            {[0, 1].map((i) => (
              <span key={i} style={{ fontFamily: FONT.body, fontWeight: 700, fontSize: 11, color: "#111", padding: "6px 0", letterSpacing: "0.04em" }}>{ticker}</span>
            ))}
          </div>
        </div>
        <GuideTag show={showGuide} text="Our station, never a game brand" />
      </Exit>
    </Frame>
  );
};

const DEFAULT_COMMENTS = [
  { handle: "vc_local", text: "they kept the mansion??" },
  { handle: "leonida.dan", text: "no way thats the same island" },
  { handle: "pinkflamingo", text: "tommy would never" },
  { handle: "ocean_bch", text: "2002 kids crying rn" },
  { handle: "jjvice", text: "source??" },
];

export const SocialQuote: React.FC<Host & SocialProps> = ({
  durFrames,
  skin = "2002",
  mode = "lower",
  showGuide,
  handle = "ViceCityLocal",
  caption = "Starfish Island right now. Tell me this isn't Tommy's place",
  live = true,
  comments = DEFAULT_COMMENTS,
  asideTitle = "Fan reaction",
  asideBody = "Used for community quotes. Handle, caption and comments are example copy.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const plate = plateOn(mode);
  const scroll = loop01(frame - (900 / 1000) * fps, fps, 4200);
  const doubled = comments.concat(comments);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? (
        <div style={{ ...abs, inset: 0, filter: "blur(14px) brightness(0.55)", transform: "scale(1.15)" }}>
          <Scene variant="dusk" skin={skin} uid="soc-bg" />
        </div>
      ) : null}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, left: 219, top: 0, width: 202, height: 360, overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.6)", ...springStyle(frame, fps, 80, 600) }}>
          <div style={{ ...abs, left: -219, top: 0, width: 640, height: 360, transform: "scale(1.25)", transformOrigin: "62% 60%" }}>
            <Scene variant="dusk" skin={skin} uid="soc" />
          </div>
          <div style={{ ...abs, inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 22%, transparent 55%, rgba(0,0,0,0.75))" }} />
          <div style={{ ...abs, left: 8, top: 10, fontFamily: FONT.body, fontSize: 9, fontWeight: 600, color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 9, padding: "2px 8px", ...fadeStyle(frame, fps, 400, 300) }}>Follow</div>
          <div style={{ ...abs, left: 9, right: 30, bottom: 64, height: 56, overflow: "hidden", maskImage: "linear-gradient(180deg, transparent, #000 35%)" }}>
            <div style={{ transform: `translateY(${-scroll * 50}%)` }}>
              {doubled.map((cm, i) => (
                <div key={`${cm.handle}-${i}`} style={{ fontFamily: FONT.body, fontSize: 8.5, color: "#FFFFFF", lineHeight: "13.5px", whiteSpace: "nowrap" }}>
                  <span style={{ fontWeight: 700, color: i % 2 ? p.cream : p.warm }}>{cm.handle}</span> {cm.text}
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...abs, left: 9, right: 9, bottom: 14, ...slideStyle(frame, fps, 500, 450, 0, 20) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: grad(p, 135), border: "1.5px solid #FFFFFF" }} />
              <div style={{ fontFamily: FONT.body, fontSize: 10, fontWeight: 700, color: "#FFFFFF" }}>{handle}</div>
              {live ? <div style={{ fontFamily: FONT.display, fontSize: 7.5, color: "#FFFFFF", background: "#E3141B", padding: "2px 4px", borderRadius: 2, letterSpacing: "0.06em" }}>Live</div> : null}
            </div>
            <div style={{ fontFamily: FONT.body, fontSize: 11, color: "#FFFFFF", marginTop: 5, lineHeight: 1.3 }}>{caption}</div>
          </div>
          {Array.from({ length: 8 }, (_, i) => {
            const t = loop01(frame - ((600 + i * 380) / 1000) * fps, fps, 2200);
            const side = i % 2 ? -1 : 1;
            const y = t < 0.12 ? -14 * (t / 0.12) : -14 + (side === -1 ? -156 : -146) * ((t - 0.12) / 0.88);
            const x = side * (t < 0.12 ? 4 * (t / 0.12) : 4 + 14 * ((t - 0.12) / 0.88));
            const opacity = t < 0.08 ? 0 : t < 0.2 ? 1 : 1 - (t - 0.2) / 0.8;
            return (
              <svg key={i} viewBox="0 0 24 22" width="16" height="15" style={{ ...abs, right: 14 + (i % 3) * 6, bottom: 70, opacity, transform: `translate(${x}px, ${y}px) scale(${0.6 + 0.4 * Math.min(1, t * 4)})` }}>
                <path d="M12 21 C5 15 1 11 1 6.5 C1 3.5 3.5 1 6.5 1 C8.6 1 10.6 2.2 12 4 C13.4 2.2 15.4 1 17.5 1 C20.5 1 23 3.5 23 6.5 C23 11 19 15 12 21Z" fill={i % 3 === 0 ? p.hot : i % 3 === 1 ? p.warm : "#FF4D6D"} />
              </svg>
            );
          })}
        </div>
        {showGuide ? (
          <div style={{ ...abs, left: 438, top: 140, width: 180, ...slideStyle(frame, fps, 900, 450, -40, 0) }}>
            <div style={{ height: 3, width: 40, background: grad(p, 90), marginBottom: 8 }} />
            <div style={{ fontFamily: FONT.display, fontSize: 18, color: "#FFFFFF" }}>{asideTitle}</div>
            <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: "rgba(255,255,255,0.8)", marginTop: 6, lineHeight: 1.4 }}>{asideBody}</div>
          </div>
        ) : null}
      </Exit>
    </Frame>
  );
};

export const CctvEvidence: React.FC<Host & CctvProps> = ({
  durFrames,
  skin = "2002",
  mode = "lower",
  showGuide,
  camera = "CAM 03  FRONT GATE",
  target = "Target: Vercetti est.",
  zoom = "ZOOM 2.0x",
  exhibit = "Exhibit A / Rockstar statement",
  quote = "sourced from the Vercetti Estate",
  highlight = "sourced from the Vercetti Estate",
  source = "Source: pending verification",
  stamp = "Unverified",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const plate = plateOn(mode);
  const hl = progress(frame, fps, 1350, 600, EASE.glide);
  const total = 22 * 3600 + 41 * 60 + 7 + frame / fps;
  const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
  const tc = `${pad(total / 3600)}:${pad((total % 3600) / 60)}:${pad(total % 60)}:${pad((frame / fps % 1) * 30)}`;
  const corner = (pos: React.CSSProperties, rot: number) => (
    <div style={{ ...abs, ...pos, width: 26, height: 26, borderTop: "2px solid rgba(255,255,255,0.9)", borderLeft: "2px solid rgba(255,255,255,0.9)", transform: `rotate(${rot}deg)` }} />
  );
  const tape = skin === "2002";
  const readShadow = tape ? chromaShadow(frame, fps) : "0 0 3px rgba(0,0,0,0.9)";
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? (
        <div style={{ ...abs, inset: 0, filter: "grayscale(0.85) contrast(1.25) brightness(0.95)", transform: `scale(${1.02 + (frame / Math.max(durFrames, 1)) * 0.06})` }}>
          <Scene variant="dusk" skin={skin} uid="cctv" />
        </div>
      ) : null}
      <div style={{ ...abs, inset: 0, background: "rgba(40,90,120,0.16)", mixBlendMode: "multiply" }} />
      <div style={{ ...abs, inset: 0, background: "radial-gradient(90% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.75))" }} />
      <div style={{ ...abs, inset: 0, opacity: 0.35, background: "radial-gradient(rgba(255,255,255,0.5) 0.6px, transparent 1px) 0 0 / 4px 4px", backgroundPosition: `${(Math.floor(loop01(frame, fps, 250) * 3) % 3) * 2}px 0` }} />
      <Exit durFrames={durFrames}>
        {corner({ left: 16, top: 16 }, 0)}
        {corner({ right: 16, top: 16 }, 90)}
        {corner({ right: 16, bottom: 16 }, 180)}
        {corner({ left: 16, bottom: 16 }, 270)}
        <div style={{ ...abs, left: 26, top: 24, fontFamily: FONT.mono, fontSize: 11, color: "#FFFFFF", lineHeight: 1.5, letterSpacing: "0.06em", textTransform: "uppercase", textShadow: readShadow }}>
          <div>{camera}</div>
          <div style={{ fontFamily: tape ? FONT.vhs : FONT.mono, fontSize: tape ? 16 : 11 }}>{tc}</div>
        </div>
        <div style={{ ...abs, right: 28, top: 26, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT.mono, fontSize: 11, color: "#FFFFFF", textShadow: tape ? chromaShadow(frame, fps) : undefined }}>
          <div style={{ width: 9, height: 9, borderRadius: 5, background: "#FF2B2B", boxShadow: "0 0 8px #FF2B2B", opacity: blink(frame, fps, 1000) }} />
          REC
        </div>
        <div style={{ ...abs, left: 392, top: 96, width: 150, height: 108, border: `2px solid ${p.hot}`, boxShadow: `0 0 12px ${p.hot}`, opacity: progress(frame, fps, 500, 520, EASE.snap), transform: `scale(${1.9 - 0.9 * progress(frame, fps, 500, 520, EASE.snap)})` }}>
          <div style={{ ...abs, left: -2, top: -18, fontFamily: FONT.mono, fontSize: 9, color: "#FFFFFF", background: p.hot, padding: "2px 5" }}>{target}</div>
          <div style={{ ...abs, right: 4, bottom: 3, fontFamily: FONT.mono, fontSize: 9, color: "#FFFFFF" }}>{zoom}</div>
        </div>
        <div style={{ ...abs, left: 34, top: 150, width: 300, transform: "rotate(-2deg)", ...shakeStyle(frame, fps, 1950) }}>
          <div style={{ position: "relative", background: "#F6F1E6", color: "#141014", padding: "14px 16px", boxShadow: "0 16px 36px rgba(0,0,0,0.6)", ...slideStyle(frame, fps, 900, 520, 60, 0) }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 8.5, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.6 }}>{exhibit}</div>
            <div style={{ fontFamily: FONT.body, fontSize: 17, fontWeight: 800, lineHeight: 1.3, marginTop: 8 }}>
              <span style={{ backgroundImage: `linear-gradient(90deg, ${p.warm}, ${p.hot})`, backgroundRepeat: "no-repeat", backgroundSize: `${hl * 100}% 100%`, padding: "0 3px" }}>{highlight || quote}</span>
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 8.5, marginTop: 9, opacity: 0.6 }}>{source}</div>
            {stamp ? (
              <div style={{ ...abs, right: -12, top: -16, border: `3px solid ${p.news}`, color: p.news, fontFamily: FONT.display, fontSize: 15, padding: "4px 8px", background: "rgba(255,255,255,0.75)", ...stampStyle(frame, fps, 1800) }}>{stamp}</div>
            ) : null}
          </div>
        </div>
        <GuideTag show={showGuide} text="Evidence frame" />
      </Exit>
    </Frame>
  );
};

const DEFAULT_CHIPS = [
  { label: "Source", text: "Rockstar Games, GTA VI Trailer 2 (May 2025)", icon: "doc" as const, x: 22, y: 300, delayMs: 250 },
  { label: "Footage", text: "GTA Vice City (2002)", icon: "play" as const, x: 360, y: 30, delayMs: 700 },
];

export const Citation: React.FC<Host & CitationProps> = ({
  durFrames,
  skin = "2002",
  mode = "lower",
  showGuide,
  chips = DEFAULT_CHIPS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const plate = plateOn(mode);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? <DriftPlate skin={skin} uid="cite" durFrames={durFrames} /> : null}
      <Exit durFrames={durFrames}>
        {chips.map((chip) => {
          const open = progress(frame, fps, chip.delayMs ?? 200, 550, EASE.snap);
          const icon = chip.icon ?? "doc";
          return (
            <div key={`${chip.label}-${chip.x}`} style={{ ...abs, left: chip.x, top: chip.y, display: "flex", alignItems: "center", gap: 7, background: "rgba(10,4,7,0.62)", borderRadius: 18, padding: "5px 12px 5px 5px", borderLeft: `3px solid ${p.hot}`, clipPath: wipeInset(open), maxWidth: 420 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: grad(p, 135), display: "flex", alignItems: "center", justifyContent: "center", ...popStyle(frame, fps, (chip.delayMs ?? 200) + 250, 350) }}>
                <svg viewBox="0 0 12 12" width="10" height="10">
                  {icon === "play" ? <path d="M3 2 L10 6 L3 10Z" fill="#FFFFFF" /> : icon === "doc" ? <path d="M3 1 H8 L10 3 V11 H3Z" fill="#FFFFFF" /> : unexpected(icon)}
                </svg>
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 9, fontWeight: 700, color: p.cream, letterSpacing: "0.04em", textTransform: "uppercase" }}>{chip.label}</div>
              <div style={{ fontFamily: FONT.body, fontSize: 11, color: "#FFFFFF" }}>{chip.text}</div>
            </div>
          );
        })}
        <GuideTag show={showGuide} text="Source chips" />
      </Exit>
    </Frame>
  );
};

const OUTLINE = "0 2px 0 #171717, 2px 0 0 #171717, -2px 0 0 #171717, 0 -2px 0 #171717, 2px 2px 0 #171717, -2px -2px 0 #171717, 2px -2px 0 #171717, -2px 2px 0 #171717, 0 6px 14px rgba(0,0,0,0.6)";

export const ShortsCaptions: React.FC<Host & ShortsProps> = ({
  durFrames,
  skin = "2002",
  mode = "cutaway",
  showGuide,
  keyword = "GTA VI vs",
  accent = "2002",
  words = [
    { text: "What's" },
    { text: "left" },
    { text: "of" },
    { text: "TOMMY'S", gradient: true },
    { text: "VICE", gradient: true },
    { text: "CITY?", gradient: true },
  ],
  noteTitle = "9:16 captions",
  noteBody = "Keyword line on top, short phrases, key nouns in the sunset stroke.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PAL[skin];
  const plate = plateOn(mode);
  return (
    <Frame skin={skin} texture={textureFor(skin, mode)}>
      {plate ? (
        <div style={{ ...abs, inset: 0, filter: "blur(14px) brightness(0.5)" }}>
          <Scene variant="dusk" skin={skin} uid="cap-bg" />
        </div>
      ) : null}
      <Exit durFrames={durFrames}>
        <div style={{ ...abs, left: 219, top: 0, width: 202, height: 360, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,0.25)" }}>
          <div style={{ ...abs, left: -219, top: 0, width: 640, height: 360, transform: "scale(1.3)", transformOrigin: "66% 55%" }}>
            <Scene variant="dusk" skin={skin} uid="cap" />
          </div>
          <div style={{ ...abs, left: 0, right: 0, top: 36, textAlign: "center", fontFamily: FONT.display, fontSize: 13, color: "#FFFFFF", textShadow: OUTLINE, ...slideStyle(frame, fps, 100, 400, 0, -20) }}>
            {keyword} <span style={{ color: p.warm }}>{accent}</span>
          </div>
          <div style={{ ...abs, left: 6, right: 6, top: 226, textAlign: "center", lineHeight: 1.05 }}>
            {words.map((word, i) => (
              <span key={`${word.text}-${i}`} style={{ display: "inline-block", margin: "0 3px", ...springStyle(frame, fps, 300 + i * 330, 300) }}>
                {word.gradient ? <SunsetTitle text={word.text} size={22} sweepAtMs={2600} /> : <span style={{ fontFamily: FONT.display, fontSize: 22, color: "#FFFFFF", textShadow: OUTLINE }}>{word.text}</span>}
              </span>
            ))}
          </div>
        </div>
        {showGuide ? (
          <div style={{ ...abs, left: 436, top: 120, width: 180, ...slideStyle(frame, fps, 700, 450, -40, 0) }}>
            <div style={{ height: 3, width: 40, background: grad(p, 90), marginBottom: 8 }} />
            <div style={{ fontFamily: FONT.display, fontSize: 16, color: "#FFFFFF" }}>{noteTitle}</div>
            <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: "rgba(255,255,255,0.8)", marginTop: 6, lineHeight: 1.45 }}>{noteBody}</div>
          </div>
        ) : null}
      </Exit>
    </Frame>
  );
};
