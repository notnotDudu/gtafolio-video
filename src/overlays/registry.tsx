import React from "react";
import { OverlayEvent } from "../edl/types";
import { unexpected } from "../theme/never";
import { Host } from "./host";
import { Citation, CctvEvidence, Chyron, ShortsCaptions, SocialQuote } from "./broadcast";
import { EndCard, Postcard, RapSheet } from "./cards";
import { BeatCard, Lockup, Presents, StatCounter } from "./titles";
import { GpsMap, HighwayTimeline, VhsWipe } from "./world";

export const OverlayView: React.FC<{ event: OverlayEvent; durFrames: number }> = ({ event, durFrames }) => {
  const host: Host = {
    durFrames,
    skin: event.skin,
    mode: event.mode,
    showGuide: event.mode === "gallery",
  };
  switch (event.component) {
    case "lockup":
      return <Lockup {...host} {...event.props} />;
    case "presents":
      return <Presents {...host} {...event.props} />;
    case "postcard":
      return <Postcard {...host} {...event.props} />;
    case "chyron":
      return <Chyron {...host} {...event.props} />;
    case "social":
      return <SocialQuote {...host} {...event.props} />;
    case "cctv":
      return <CctvEvidence {...host} {...event.props} />;
    case "map":
      return <GpsMap {...host} {...event.props} />;
    case "wipe":
      return <VhsWipe {...host} {...event.props} />;
    case "counter":
      return <StatCounter {...host} {...event.props} />;
    case "beat":
      return <BeatCard {...host} {...event.props} />;
    case "rap":
      return <RapSheet {...host} {...event.props} />;
    case "timeline":
      return <HighwayTimeline {...host} {...event.props} />;
    case "citation":
      return <Citation {...host} {...event.props} />;
    case "shortsCaptions":
      return <ShortsCaptions {...host} {...event.props} />;
    case "end":
      return <EndCard {...host} {...event.props} />;
    default:
      return unexpected(event);
  }
};
