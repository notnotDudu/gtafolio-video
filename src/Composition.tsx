import React from "react";
import { Composition } from "remotion";
import { Edl } from "./edl/types";
import { galleryDuration } from "./gallery/catalog";
import { Gallery } from "./gallery/Gallery";
import { GtafolioVideo } from "./player/GtafolioVideo";

type RequireContext = {
  keys: () => string[];
  (id: string): { default?: Edl } | Edl;
};

declare const require: {
  context: (path: string, deep: boolean, filter: RegExp) => RequireContext;
};

const edlContext = require.context("./edl", false, /\.json$/);

const idFor = (file: string) =>
  file
    .replace(/^\.\//, "")
    .replace(/\.json$/, "")
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const edits = edlContext.keys().map((key) => {
  const loaded = edlContext(key);
  const edl = (loaded && typeof loaded === "object" && "default" in loaded ? loaded.default : loaded) as Edl;
  return { id: idFor(key), edl };
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Gallery" component={Gallery} durationInFrames={galleryDuration} fps={30} width={1920} height={1080} />
      {edits.map(({ id, edl }) => (
        <Composition
          key={id}
          id={id}
          component={GtafolioVideo}
          durationInFrames={Math.max(1, Math.round(edl.duration * edl.fps))}
          fps={edl.fps}
          width={edl.width}
          height={edl.height}
          defaultProps={{ edl }}
        />
      ))}
    </>
  );
};
