import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OverlayName } from "../edl/types";
import { Citation, CctvEvidence, Chyron, ShortsCaptions, SocialQuote } from "../overlays/broadcast";
import { EndCard, Postcard, RapSheet } from "../overlays/cards";
import { BeatCard, Lockup, Presents, StatCounter } from "../overlays/titles";
import { GpsMap, HighwayTimeline, VhsWipe } from "../overlays/world";
import { unexpected } from "../theme/never";
import { GALLERY_HOLD, GALLERY_ITEMS } from "./catalog";

const Slide: React.FC<{ id: OverlayName }> = ({ id }) => {
  const host = { durFrames: GALLERY_HOLD, mode: "gallery" as const, showGuide: true, skin: "2002" as const };
  switch (id) {
    case "lockup":
      return <Lockup {...host} />;
    case "presents":
      return <Presents {...host} />;
    case "postcard":
      return <Postcard {...host} />;
    case "chyron":
      return <Chyron {...host} />;
    case "social":
      return <SocialQuote {...host} />;
    case "cctv":
      return <CctvEvidence {...host} />;
    case "map":
      return <GpsMap {...host} />;
    case "wipe":
      return <VhsWipe {...host} />;
    case "counter":
      return <StatCounter {...host} />;
    case "beat":
      return <BeatCard {...host} />;
    case "rap":
      return <RapSheet {...host} />;
    case "timeline":
      return <HighwayTimeline {...host} />;
    case "citation":
      return <Citation {...host} />;
    case "shortsCaptions":
      return <ShortsCaptions {...host} />;
    case "end":
      return <EndCard {...host} />;
    default:
      return unexpected(id);
  }
};

export const Gallery: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {GALLERY_ITEMS.map((item, index) => (
        <Sequence key={item.id} from={index * GALLERY_HOLD} durationInFrames={GALLERY_HOLD} name={item.name}>
          <Slide id={item.id} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
