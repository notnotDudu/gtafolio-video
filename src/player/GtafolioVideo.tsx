import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip, Edl, Transition, WordStamp } from "../edl/types";
import { OverlayView } from "../overlays/registry";
import { FONT, PAL } from "../theme/palette";
import { Scene } from "../theme/scene";
import { VhsLayer } from "../theme/stage";
import { unexpected } from "../theme/never";
import { KaraokeCaptions } from "./captions";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const footageSrc = (file: string) => {
  if (file.startsWith("audio/") || file.startsWith("sfx/") || file.startsWith("fonts/")) return staticFile(file);
  return staticFile(`footage/${file}`);
};

const playbackRate = (clip: Clip) => {
  if (clip.speed && clip.speed > 0) return clip.speed;
  const timeline = clip.end - clip.start;
  const source = clip.srcOut - clip.srcIn;
  if (timeline <= 0 || source <= 0) return 1;
  return source / timeline;
};

const cropped = (clip: Clip): React.CSSProperties => {
  if (!clip.crop) return { width: "100%", height: "100%", objectFit: "cover" };
  const { x, y, w, h } = clip.crop;
  return {
    position: "absolute",
    width: `${100 / Math.max(w, 0.01)}%`,
    height: `${100 / Math.max(h, 0.01)}%`,
    left: `${(-x / Math.max(w, 0.01)) * 100}%`,
    top: `${(-y / Math.max(h, 0.01)) * 100}%`,
    objectFit: "fill",
  };
};

const Placeholder: React.FC<{ clip: Clip }> = ({ clip }) => {
  const look = clip.placeholder;
  const variant = look?.variant ?? "dusk";
  const colors = look?.colors;
  return (
    <AbsoluteFill>
      {colors ? (
        <AbsoluteFill style={{ background: `linear-gradient(160deg, ${colors[0]}, ${colors[1]})` }} />
      ) : (
        <AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, width: 640, height: 360, zoom: 3 }}>
            <Scene variant={variant} skin={clip.grade === "2002" ? "2002" : "2026"} uid={clip.id} />
          </div>
        </AbsoluteFill>
      )}
      <div style={{ position: "absolute", left: 36, bottom: 28, fontFamily: FONT.mono, fontSize: 18, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", textShadow: "0 2px 8px #000" }}>
        Placeholder / {look?.label ?? clip.note ?? clip.file}
      </div>
    </AbsoluteFill>
  );
};

const ShotMedia: React.FC<{ clip: Clip; fps: number }> = ({ clip, fps }) => {
  const style = cropped(clip);
  switch (clip.kind) {
    case "placeholder":
      return <Placeholder clip={clip} />;
    case "still":
      return <Img src={footageSrc(clip.file)} style={style} />;
    case "video":
      return (
        <OffthreadVideo
          src={footageSrc(clip.file)}
          trimBefore={Math.max(0, Math.round(clip.srcIn * fps))}
          playbackRate={playbackRate(clip)}
          muted
          style={style}
        />
      );
    default:
      return unexpected(clip.kind);
  }
};

const TransitionLayer: React.FC<{ blend?: Transition; durFrames: number }> = ({ blend, durFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!blend || blend.duration <= 0) return null;
  const span = Math.max(1, Math.round(blend.duration * fps));
  const start = Math.max(0, durFrames - span);
  const p = interpolate(frame, [start, durFrames], [0, 1], clamp);
  switch (blend.type) {
    case "cut":
      return null;
    case "dip":
      return <AbsoluteFill style={{ background: "#000", opacity: p }} />;
    case "flash": {
      const peak = p < 0.45 ? p / 0.45 : 1 - (p - 0.45) / 0.55;
      return <AbsoluteFill style={{ background: "#FFFFFF", opacity: Math.max(0, peak) }} />;
    }
    case "wipe":
      return (
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, transparent ${Math.max(0, p * 100 - 6)}%, #FFFFFF ${p * 100}%, transparent ${Math.min(100, p * 100 + 8)}%)`,
          }}
        />
      );
    default:
      return unexpected(blend.type);
  }
};

const ShotClip: React.FC<{ clip: Clip }> = ({ clip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = Math.max(1, Math.round((clip.end - clip.start) * fps));
  const burn = clip.kenBurns;
  const zoom = burn ? interpolate(frame, [0, dur], [burn.zoomFrom, burn.zoomTo], clamp) : 1;
  const origin = burn?.originTo
    ? `${interpolate(frame, [0, dur], [percent(burn.origin), percent(burn.originTo)], clamp)}% ${interpolate(frame, [0, dur], [percent(burn.origin, 1), percent(burn.originTo, 1)], clamp)}%`
    : burn?.origin ?? "center center";
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: origin }}>
        <ShotMedia clip={clip} fps={fps} />
      </AbsoluteFill>
      {clip.grade === "2002" ? <VhsLayer /> : <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 58%, rgba(10,4,7,0.45) 100%)", pointerEvents: "none" }} />}
      {clip.grade === "2026" ? <AbsoluteFill style={{ boxShadow: "inset 0 0 80px rgba(241,64,155,0.08)", pointerEvents: "none" }} /> : null}
      <TransitionLayer blend={clip.transitionOut} durFrames={dur} />
    </AbsoluteFill>
  );
};

const percent = (origin: string | undefined, axis = 0) => {
  if (!origin) return 50;
  const parts = origin.split(/\s+/);
  const token = parts[axis] ?? parts[0] ?? "50%";
  const n = Number(token.replace("%", ""));
  return Number.isFinite(n) ? n : 50;
};

const duckLevel = (time: number, words: WordStamp[], full: number, to: number, near: number, far: number) => {
  let dist = 9;
  for (const word of words) dist = Math.min(dist, Math.max(0, word.start - time, time - word.end));
  return interpolate(dist, [near, far], [to, full], clamp);
};

export const GtafolioVideo: React.FC<{ edl: Edl }> = ({ edl }) => {
  const { fps } = useVideoConfig();
  const total = Math.round(edl.duration * fps);
  const at = (seconds: number) => Math.round(seconds * fps);
  return (
    <AbsoluteFill style={{ background: PAL["2026"].ink }}>
      {edl.clips.map((clip, index) => {
        const from = at(clip.start);
        const next = index + 1 < edl.clips.length ? at(edl.clips[index + 1].start) : at(clip.end);
        const dur = Math.max(1, next - from);
        return (
          <Sequence key={clip.id} from={from} durationInFrames={dur} name={clip.id}>
            <ShotClip clip={clip} />
          </Sequence>
        );
      })}
      {edl.overlays.map((overlay) => {
        const from = at(overlay.start);
        const dur = Math.max(1, at(overlay.end) - from);
        return (
          <Sequence key={overlay.id} from={from} durationInFrames={dur} name={`${overlay.component} ${overlay.id}`}>
            <OverlayView event={overlay} durFrames={dur} />
          </Sequence>
        );
      })}
      {edl.captions.enabled ? (
        <KaraokeCaptions words={edl.captions.words} overlays={edl.overlays} maxWords={edl.captions.maxWords} safe={edl.captions.safeArea} />
      ) : null}
      <Audio src={staticFile(edl.narration.file)} volume={edl.narration.volume} />
      {edl.music.map((track) => (
        <Sequence key={track.id} from={at(track.start)} durationInFrames={Math.max(1, at(track.end ?? edl.duration) - at(track.start))} name={track.id}>
          <Audio
            src={staticFile(track.file)}
            loop={track.loop}
            volume={(frame) => {
              const time = track.start + frame / fps;
              const full = track.volume;
              const ducked = track.duck ? duckLevel(time, edl.captions.words, full, track.duck.to, track.duck.near, track.duck.far) : full;
              const fadeIn = interpolate(frame, [0, Math.max(1, (track.fadeIn ?? 0) * fps)], [track.fadeIn ? 0 : 1, 1], { ...clamp, easing: Easing.linear });
              const endFrame = Math.max(1, at(track.end ?? edl.duration) - at(track.start));
              const fadeOut = interpolate(frame, [endFrame - Math.max(1, (track.fadeOut ?? 0) * fps), endFrame], [1, track.fadeOut ? 0 : 1], clamp);
              return ducked * fadeIn * fadeOut;
            }}
          />
        </Sequence>
      ))}
      {edl.sfx.map((hit) => (
        <Sequence key={hit.id} from={at(hit.start)} durationInFrames={Math.min(90, Math.max(1, total - at(hit.start)))} layout="none" name={hit.id}>
          <Audio src={staticFile(hit.file)} volume={hit.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
