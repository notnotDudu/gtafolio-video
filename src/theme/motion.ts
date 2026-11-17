import React from "react";
import { Easing, interpolate } from "remotion";

export const EASE = {
  snap: Easing.bezier(0.16, 1, 0.3, 1),
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  glide: Easing.bezier(0.65, 0, 0.35, 1),
  exit: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

export const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

type EaseFn = (t: number) => number;

export const progress = (frame: number, fps: number, delayMs: number, durMs: number, easing: EaseFn = EASE.snap) => {
  const start = (delayMs / 1000) * fps;
  const end = start + (durMs / 1000) * fps;
  if (end - start < 0.001) return frame >= start ? 1 : 0;
  return interpolate(frame, [start, end], [0, 1], { ...clamp, easing });
};

export const loop01 = (frame: number, fps: number, periodMs: number) => {
  const period = Math.max(1, (periodMs / 1000) * fps);
  const wrapped = ((frame % period) + period) % period;
  return wrapped / period;
};

export const mix = (p: number, from: number, to: number) => from + (to - from) * p;

export const stops = (p: number, points: number[], values: number[]) => interpolate(p, points, values, clamp);

export const exitStyle = (frame: number, fps: number, durFrames: number): React.CSSProperties => {
  const outFrames = Math.min(Math.round(0.3 * fps), Math.max(1, durFrames - 1));
  const start = Math.max(0, durFrames - outFrames);
  const p = interpolate(frame, [start, durFrames], [0, 1], { ...clamp, easing: EASE.exit });
  if (p <= 0.001) return { opacity: 1 };
  return { opacity: 1 - p, filter: `blur(${(p * 8).toFixed(2)}px)` };
};

/** Triple-stroke title spring: scale 0.6, blur 8, overshoot 1.07, settle 1. */
export const springStyle = (frame: number, fps: number, delayMs: number, durMs = 650): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, durMs, Easing.linear);
  if (p <= 0) return { opacity: 0, transform: "scale(0.6)", filter: "blur(8px)" };
  if (p >= 1) return { opacity: 1, transform: "scale(1)" };
  const opacity = stops(p, [0, 0.4, 1], [0, 1, 1]);
  const scale = stops(p, [0, 0.55, 0.78, 1], [0.6, 1.07, 0.97, 1]);
  const blur = stops(p, [0, 0.55, 1], [8, 0, 0]);
  return {
    opacity,
    transform: `scale(${scale})`,
    filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
  };
};

export const popStyle = (frame: number, fps: number, delayMs: number, durMs = 350): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, durMs, EASE.pop);
  if (p <= 0) return { opacity: 0, transform: "scale(0.4)" };
  if (p >= 1) return { opacity: 1, transform: "scale(1)" };
  return { opacity: Math.min(1, p * 3), transform: `scale(${0.4 + 0.6 * p})` };
};

export const slideStyle = (
  frame: number,
  fps: number,
  delayMs: number,
  durMs: number,
  dx: number,
  dy: number,
  easing: EaseFn = EASE.snap,
): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, durMs, easing);
  if (p >= 1) return { opacity: 1 };
  if (p <= 0) return { opacity: 0, transform: `translate(${dx}px, ${dy}px)` };
  return { opacity: p, transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px)` };
};

/** Tracked caps: 0.9em and a blur, settling to 0.38em. */
export const trackStyle = (frame: number, fps: number, delayMs: number, durMs = 1000): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, durMs, EASE.snap);
  const blur = mix(p, 6, 0);
  return {
    opacity: p,
    letterSpacing: `${mix(p, 0.9, 0.38)}em`,
    filter: blur > 0.25 ? `blur(${blur}px)` : undefined,
  };
};

export const fadeStyle = (frame: number, fps: number, delayMs: number, durMs = 400): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, durMs, EASE.glide);
  return { opacity: p };
};

export const stampStyle = (frame: number, fps: number, delayMs: number): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, 380, EASE.pop);
  if (p <= 0) return { opacity: 0, transform: "scale(2.4) rotate(-16deg)" };
  if (p >= 1) return { opacity: 1, transform: "scale(1) rotate(-8deg)" };
  const scale = stops(p, [0, 0.7, 1], [2.4, 0.94, 1]);
  const rot = stops(p, [0, 0.7, 1], [-16, -8, -8]);
  return { opacity: Math.min(1, p / 0.35), transform: `scale(${scale}) rotate(${rot}deg)` };
};

export const shakeStyle = (frame: number, fps: number, delayMs: number): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, 220, Easing.linear);
  if (p <= 0 || p >= 1) return {};
  const xs = [0, -4, 4, -3, 2, 0];
  const ys = [0, 3, -2, 1, -1, 0];
  const pos = p * (xs.length - 1);
  const i = Math.min(xs.length - 2, Math.floor(pos));
  const f = pos - i;
  const x = xs[i] + (xs[i + 1] - xs[i]) * f;
  const y = ys[i] + (ys[i + 1] - ys[i]) * f;
  return { transform: `translate(${x}px, ${y}px)` };
};

export const cardDropStyle = (frame: number, fps: number, delayMs: number): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, 900, Easing.linear);
  if (p <= 0) return { opacity: 0, transform: "translate(-40px, -320px) rotate(-16deg)" };
  if (p >= 1) return { opacity: 1, transform: "rotate(-3deg)" };
  const x = stops(p, [0, 0.58, 1], [-40, 0, 0]);
  const y = stops(p, [0, 0.58, 0.8, 1], [-320, 12, -4, 0]);
  const rot = stops(p, [0, 0.58, 0.8, 1], [-16, -1, -3.6, -3]);
  return { opacity: stops(p, [0, 0.58, 1], [0, 1, 1]), transform: `translate(${x}px, ${y}px) rotate(${rot}deg)` };
};

export const letterStyle = (frame: number, fps: number, delayMs: number): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, 460, Easing.linear);
  if (p <= 0) return { opacity: 0, display: "inline-block", transform: "translateY(26px) scale(0.3) rotate(-14deg)" };
  if (p >= 1) return { opacity: 1, display: "inline-block" };
  const y = stops(p, [0, 0.7, 1], [26, -4, 0]);
  const s = stops(p, [0, 0.7, 1], [0.3, 1.12, 1]);
  const r = stops(p, [0, 0.7, 1], [-14, 3, 0]);
  return {
    opacity: stops(p, [0, 0.45, 1], [0, 1, 1]),
    display: "inline-block",
    transform: `translateY(${y}px) scale(${s}) rotate(${r}deg)`,
  };
};

export const phoneStyle = (frame: number, fps: number, delayMs: number): React.CSSProperties => {
  const p = progress(frame, fps, delayMs, 900, Easing.linear);
  if (p >= 1) return { opacity: 1 };
  if (p <= 0) return { opacity: 0, transform: "translateY(420px) rotate(9deg)" };
  const y = stops(p, [0, 0.62, 1], [420, -12, 0]);
  const r = stops(p, [0, 0.62, 1], [9, -1.5, 0]);
  return { opacity: Math.min(1, p * 2), transform: `translateY(${y}px) rotate(${r}deg)` };
};

export const wipeInset = (p: number, edge: "left" | "right" = "left") =>
  edge === "left" ? `inset(0 ${(1 - Math.min(1, Math.max(0, p))) * 100}% 0 0)` : `inset(0 0 0 ${(1 - Math.min(1, Math.max(0, p))) * 100}%)`;
