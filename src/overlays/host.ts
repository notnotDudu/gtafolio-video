import { OverlayMode } from "../edl/types";
import { Skin } from "../theme/palette";

export type Host = {
  durFrames: number;
  skin?: Skin;
  mode?: OverlayMode;
  showGuide?: boolean;
};

export const plateOn = (mode?: OverlayMode) => mode !== "lower";
