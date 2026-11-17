import { Skin } from "../theme/palette";

export type { Skin };

export type OverlayMode = "gallery" | "cutaway" | "lower";

export type LockupProps = {
  monogram?: string;
  wordmark?: string;
  tagline?: string;
  episode?: string;
};

export type PresentsProps = {
  brand?: string;
  presents?: string;
  kicker?: string;
  titleA?: string;
  titleB?: string;
  subtitle?: string;
};

export type PostcardProps = {
  line1?: string;
  line2?: string;
  chapter?: string;
  credit?: string;
  script?: string;
};

export type ChyronProps = {
  live?: string;
  station?: string;
  desk?: string;
  clock?: string;
  headline?: string;
  ticker?: string;
};

export type SocialComment = { handle: string; text: string };

export type SocialProps = {
  handle?: string;
  caption?: string;
  live?: boolean;
  comments?: SocialComment[];
  asideTitle?: string;
  asideBody?: string;
};

export type CctvProps = {
  camera?: string;
  target?: string;
  zoom?: string;
  exhibit?: string;
  quote?: string;
  highlight?: string;
  source?: string;
  stamp?: string;
};

export type MapTone = "cool" | "warm" | "hot";

export type MapBlip = { x: number; y: number; tone: MapTone; letter: string; delayMs?: number };

export type MapLabel = { x: number; y: number; text: string; delayMs?: number };

export type MapLegend = { tone: MapTone | "line"; label: string };

export type MapProps = {
  blips?: MapBlip[];
  labels?: MapLabel[];
  route?: string;
  credit?: string;
  legend?: MapLegend[];
  showRoute?: boolean;
};

export type WipeProps = {
  thenYear?: string;
  thenLabel?: string;
  nowYear?: string;
  nowLabel?: string;
  tag?: string;
};

export type CounterProps = {
  to?: number;
  label?: string;
  caption?: string;
};

export type BeatProps = {
  chapter?: string;
  title?: string;
  progressLabel?: string;
  progress?: number;
  progressText?: string;
  tag?: string;
};

export type RapRow = { label: string; value: string };

export type RapProps = {
  file?: string;
  name?: string;
  rows?: RapRow[];
  heat?: number;
  heatMax?: number;
  stamp?: string;
  tag?: string;
};

export type TimelineSign = { year: string; caption: string; accent?: boolean; delayMs?: number };

export type TimelineProps = { signs?: TimelineSign[]; pan?: number };

export type CitationChip = {
  label: string;
  text: string;
  icon?: "play" | "doc";
  x: number;
  y: number;
  delayMs?: number;
};

export type CitationProps = { chips?: CitationChip[] };

export type ShortsWord = { text: string; gradient?: boolean };

export type ShortsProps = {
  keyword?: string;
  accent?: string;
  words?: ShortsWord[];
  noteTitle?: string;
  noteBody?: string;
};

export type EndNote = { title: string; body: string };

export type EndProps = {
  clock?: string;
  date?: string;
  notes?: EndNote[];
  subscribe?: string;
  subscribed?: string;
  slots?: [string, string];
  variant?: "full" | "corner";
};

export type OverlayName =
  | "lockup"
  | "presents"
  | "postcard"
  | "chyron"
  | "social"
  | "cctv"
  | "map"
  | "wipe"
  | "counter"
  | "beat"
  | "rap"
  | "timeline"
  | "citation"
  | "shortsCaptions"
  | "end";

type OverlayBase = {
  id: string;
  start: number;
  end: number;
  /** Omitted overlays inherit edl.skin. */
  skin?: Skin;
  mode: OverlayMode;
};

export type OverlayEvent =
  | (OverlayBase & { component: "lockup"; props: LockupProps })
  | (OverlayBase & { component: "presents"; props: PresentsProps })
  | (OverlayBase & { component: "postcard"; props: PostcardProps })
  | (OverlayBase & { component: "chyron"; props: ChyronProps })
  | (OverlayBase & { component: "social"; props: SocialProps })
  | (OverlayBase & { component: "cctv"; props: CctvProps })
  | (OverlayBase & { component: "map"; props: MapProps })
  | (OverlayBase & { component: "wipe"; props: WipeProps })
  | (OverlayBase & { component: "counter"; props: CounterProps })
  | (OverlayBase & { component: "beat"; props: BeatProps })
  | (OverlayBase & { component: "rap"; props: RapProps })
  | (OverlayBase & { component: "timeline"; props: TimelineProps })
  | (OverlayBase & { component: "citation"; props: CitationProps })
  | (OverlayBase & { component: "shortsCaptions"; props: ShortsProps })
  | (OverlayBase & { component: "end"; props: EndProps });

export type KenBurns = {
  zoomFrom: number;
  zoomTo: number;
  origin?: string;
  originTo?: string;
};

export type Crop = { x: number; y: number; w: number; h: number };

export type TransitionKind = "cut" | "dip" | "flash" | "wipe";

export type Transition = { type: TransitionKind; duration: number };

export type PlaceholderLook = {
  variant?: "dusk" | "day" | "night";
  label?: string;
  colors?: [string, string];
};

export type Clip = {
  id: string;
  kind: "video" | "still" | "placeholder";
  file: string;
  srcIn: number;
  srcOut: number;
  start: number;
  end: number;
  speed?: number;
  crop?: Crop;
  kenBurns?: KenBurns;
  grade?: "2026" | "2002" | "none";
  transitionOut?: Transition;
  placeholder?: PlaceholderLook;
  note?: string;
};

export type WordStamp = { word: string; start: number; end: number };

export type Duck = {
  under: "narration";
  to: number;
  near: number;
  far: number;
};

export type AudioEvent = {
  id: string;
  file: string;
  start: number;
  end?: number;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
  duck?: Duck;
};

export type CaptionStyle = "karaoke";

export type SafeArea = { top: number; right: number; bottom: number; left: number };

export type Captions = {
  enabled: boolean;
  style: CaptionStyle;
  safeArea: SafeArea;
  maxWords: number;
  words: WordStamp[];
};

/** Full-frame tape over the picture. Plates and the wipe paint their own treatment. */
export type VhsPass = {
  enabled: boolean;
  /** 0 is clean, 1 is the plate recipe. The channel default stays low so gameplay stays readable. */
  strength?: number;
};

export type Edl = {
  id: string;
  title: string;
  fps: number;
  width: number;
  height: number;
  duration: number;
  /** Channel skin. 2002 is the Vice VHS look. 2026 is the HDR sunset look. */
  skin: Skin;
  vhs?: VhsPass;
  narration: { file: string; volume: number };
  music: AudioEvent[];
  sfx: AudioEvent[];
  clips: Clip[];
  overlays: OverlayEvent[];
  captions: Captions;
};

export type ShotListCue =
  | string
  | {
      component: OverlayName;
      props?: OverlayEvent["props"];
      start?: number;
      end?: number;
      skin?: Skin;
      mode?: OverlayMode;
      id?: string;
    };

export type ShotListRow = {
  beat: number;
  start: number;
  end: number;
  source_file: string;
  src_in: number;
  src_out: number;
  kind: "video" | "still" | "placeholder";
  note: string;
  overlay_cue?: ShotListCue | ShotListCue[] | null;
  speed?: number;
  crop?: Crop;
  kenBurns?: KenBurns;
  grade?: "2026" | "2002" | "none";
  transitionOut?: Transition;
  placeholder?: PlaceholderLook;
};

export type EpisodeInput = {
  id: string;
  title: string;
  fps?: number;
  width?: number;
  height?: number;
  duration: number;
  skin?: Skin;
  vhs?: VhsPass;
  narration: { file: string; volume?: number };
  music?: AudioEvent[];
  sfx?: AudioEvent[];
  words: WordStamp[];
  shots: ShotListRow[];
  autoSfx?: boolean;
  captions?: Partial<Captions>;
};

export const OVERLAY_NAMES: OverlayName[] = [
  "lockup",
  "presents",
  "postcard",
  "chyron",
  "social",
  "cctv",
  "map",
  "wipe",
  "counter",
  "beat",
  "rap",
  "timeline",
  "citation",
  "shortsCaptions",
  "end",
];

export const isOverlayName = (value: string): value is OverlayName =>
  (OVERLAY_NAMES as string[]).includes(value);
