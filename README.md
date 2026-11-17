# GTAFolio video

Data-driven Remotion project for the faceless GTAFolio YouTube channel. An edit decision list (EDL JSON), a narration MP3, and word timestamps render the full video with the Sunshine State Broadcast overlay system.

The first episode is the pilot **What's Left of Tommy Vercetti's Vice City in GTA 6?** at 1920x1080, 30 fps, 503.5 seconds (8:23).

Footage stays on the owner's drive. This repo renders with placeholder colour plates until that drive is linked.

## Requirements

- Node `^20.19`, `^22.13`, or `>=24`
- ffmpeg on the PATH for the placeholder bed (already generated in `public/audio`)
- A Mac with the footage drive mounted, when you render real picture

```bash
npm install
npm run check
npm run studio
```

Studio opens the **Gallery** composition (every overlay on the style-guide plate) and one composition per JSON file in `src/edl/`. `pilot.json` registers as **Pilot**.

## Point the project at footage

Real clips are files under a footage root, for example `/Volumes/T7/GTAFolio/Footage`. The player asks Remotion for `staticFile("footage/" + file)`, so the root has to show up as `public/footage`.

Either export the path:

```bash
export FOOTAGE_ROOT=/Volumes/T7/GTAFolio/Footage
npm run footage:link
```

or copy the example and edit it (this file is gitignored):

```bash
cp footage.config.json.example footage.config.json
npm run footage:link
```

`footage:link` checks that the drive is mounted, then symlinks `public/footage` at that directory. If `public/footage` is already a real folder with files in it, the script stops and deletes nothing. The committed folder only holds a `.gitkeep`, which the script removes before creating the symlink.

Clip `file` values are paths relative to that root (`vc/ocean-drive.mp4`). Narration, music, and SFX live in `public/audio` and `public/sfx` and are referenced as `audio/...` and `sfx/...`.

Before a long render on the Mac, confirm the volume is mounted (`ls "$FOOTAGE_ROOT"`), and point temp files at the same drive so Chrome's frame cache does not fill the internal disk:

```bash
export TMPDIR=/Volumes/T7/GTAFolio/tmp
mkdir -p "$TMPDIR"
```

## Render

```bash
npm run render
npm run render:chunk -- --start 0 --end 18 --out out/hook.mp4
npm run stills -- --gallery --out out/stills
npm run stills -- --times 2.5,40,105,225,445,495 --out out/stills
```

| Script | What it does |
| --- | --- |
| `npm run studio` | Remotion Studio |
| `npm run render` | Full Pilot MP4 to `out/pilot.mp4` |
| `npm run render:chunk` | A time range. `--start` and `--end` are seconds. `--frames 0-539` also works. `--composition` and `--out` optional |
| `npm run stills` | PNG stills. `--gallery` for one hero frame of each overlay. `--times 2.5,10` or `--frames 75,300` for an episode |
| `npm run edl:pilot` | Rebuild `src/edl/pilot.json` from the script cues |
| `npm run edl:check` | Validate the pilot EDL |
| `npm run footage:link` | Symlink `public/footage` |
| `npm run check` | Validate, typecheck, lint |

`REMOTION_CONCURRENCY` controls parallel frames (default `2`, sized for a laptop). Output is JPEG frames, overwrite on.

Chunked renders are how a laptop finishes the 8:23. Render ranges, then concat the MP4s with ffmpeg. Each chunk is the same composition, so audio and overlays stay in sync as long as the ranges cover the timeline without gaps.

## Add an episode

1. Put the narration at `public/audio/<id>.mp3` and the word timestamps at `episodes/<id>/words.json` as `[{ "word", "start", "end" }]`.
2. Write a shot list. Each row is `{ beat, start, end, source_file, src_in, src_out, kind, note, overlay_cue }`. `kind` is `video`, `still`, or `placeholder`. `overlay_cue` is a component name, a cue object, an array of those, or null.
3. Convert it:

```bash
npx tsx scripts/shotlist-to-edl.ts \
  --shots episodes/my-episode/shotlist.json \
  --words episodes/my-episode/words.json \
  --narration audio/my-episode.mp3 \
  --duration 503.5 \
  --title "Episode title" \
  --id my-episode \
  --out src/edl/my-episode.json
```

An episode object (`--in episode.json`) works too, with `narration`, `words`, `shots`, and optional `music`.

4. `npx tsx scripts/validate-edl.ts src/edl/my-episode.json`
5. Studio picks the new file up on refresh. The composition id is the file name in Pascal case (`my-episode.json` becomes `MyEpisode`).

Clips must meet: the first starts at 0, each next starts where the previous ends (within one frame), and the last ends at `duration`. Peak overlap of overlays is 2. The validator rejects an em dash anywhere in the JSON.

Placeholder clips draw the dusk, day, or night plate (or a two-colour gradient) plus a small label, with Ken Burns. Swap `kind` to `video` or `still` and point `source_file` at a file under the footage root when the picture arrives. `src_in` / `src_out` are source seconds. Playback rate is `speed`, or `(src_out - src_in) / (end - start)` when speed is omitted. Crop is fractional `x, y, w, h`. Ken Burns is `zoomFrom`, `zoomTo`, and optional `origin` / `originTo`. `transitionOut` is `cut`, `dip`, `flash`, or `wipe`. `grade` of `2026` adds the HDR vignette on that clip.

## Overlays

The design source is the Sunshine State Broadcast system: a 640x360 stage drawn at 1920x1080 with CSS zoom so type stays sharp, a 6.2 second cycle, and frame-based motion (`useCurrentFrame`, `interpolate`, `spring`). The channel skin is Vice 2002 VHS (`edl.skin`, default `"2002"`): palette, `saturate(1.3) contrast(1.06)`, scanlines, an 8 px pixel grid, a tracking band, chroma, VT323 for the tape readout, and JetBrains Mono for camera labels. `"2026"` keeps the HDR sunset skin. An overlay's own `skin` overrides the channel for that event. The then-vs-now wipe ignores the switch and always paints 2002 on the left and 2026 on the right. Modes are `gallery` (plate plus guide notes), `cutaway` (full plate), and `lower` (foreground over footage).

The footage tape is off unless a clip sets `"vhs": true`, or a window in `vhsRanges` covers the playhead. Each range is `{ "start", "end", "strength" }`. `strength` runs from 0 to 1 and defaults to 0.42. On a flagged shot the pass sits under the overlays: lighter scanlines, a chroma fringe, a tracking band about twice a minute, and noise hashed from the frame so a still matches a render. The pilot turns it on for Vice City longplay, the 2002 UK TV ad, and the GTA 1 top-down shot. GTA VI trailer footage and stills stay clean. Overlays, the lockup, and the captions keep the 2002 skin either way.

The logo gradient is `#3D5BC9`, `#8E4CD0`, `#CA27BE`, `#F1409B`, `#F3657B`, `#F68C5A` with a plum `#200432` stroke.

The library is 14 components. Lockup is the identity sting and is the 15th gallery slide.

| Component | Role |
| --- | --- |
| `lockup` | Identity sting |
| `presents` | Cold open |
| `postcard` | Chapter card |
| `chyron` | News lower third |
| `social` | Quote and comments |
| `cctv` | Evidence monitor |
| `map` | Stylized GPS callout |
| `wipe` | 2002 to 2026 split |
| `counter` | Odometer stat |
| `beat` | Chapter title |
| `rap` | Record card and stamp |
| `timeline` | Highway signs |
| `citation` | Source chips |
| `shortsCaptions` | 9:16 caption demo |
| `end` | End card, or `variant: "corner"` for a subscribe chip |

Full-plate overlays hide the karaoke captions. `chyron`, `timeline`, `cctv`, `social`, and the corner `end` lift the captions into the top safe area. Keep a full-plate card on screen long enough for its entrance (most settle by about 3.5 seconds; lockup wants about 5 seconds).

Captions are karaoke from `words.json`: up to five words a page, a larger cream active word, and a sunset fill when the word is a key noun (Tommy, Vice City, Ocean Beach, and the rest of the list in `src/player/captions.tsx`). The pilot words are the whisper transcript, including its mishears. On-screen overlay copy uses the spellings Houser, Vercetti, Duval, and Caminos.

Music ducks under the narration. A track's `duck` sets `to` (the ducked volume), `near`, and `far` (seconds from the nearest word). The pilot bed is a short loop at 0.16, ducked to 0.04.

## Pilot sample

`npm run edl:pilot` reads `episodes/pilot/words.json` and the cue plan in `scripts/build-pilot-edl.ts`, then writes:

- `episodes/pilot/shotlist.json` (the interchange format)
- `episodes/pilot/episode.json` (the same list plus episode metadata)
- `src/edl/pilot.json` (the render EDL, words included)

`public/audio/narration.mp3` is 503.5 seconds of silence, so the timeline, ducking, and captions can be reviewed before the real voiceover is dropped in. `public/audio/bed.mp3` is a synthesized pad. `public/sfx/*.wav` are synthesized hits. Replace the bed and the hits with tracks you have rights to before publishing.

Schema: `schema/edl.schema.json`. TypeScript types: `src/edl/types.ts`.

## Licensing

Our branding is the sunset wordmark and the plates in this repo. Keep Rockstar logos, the VI numeral, the GTA wordmark, and Weazel marks out of that branding.

Fonts, all free to ship with the video:

| Family | Use | License | Notice |
| --- | --- | --- | --- |
| Anton | Sunset titles | SIL OFL 1.1 | `public/fonts/LICENSE-anton.txt` |
| Lilita One | Wordmark | SIL OFL 1.1, reserved name "Lilita One" | `public/fonts/LICENSE-lilita-one.txt` |
| Alfa Slab One | Postcard names | SIL OFL 1.1, reserved name "Alfa Slab" | `public/fonts/LICENSE-alfa-slab-one.txt` |
| Montserrat | Tracked caps | SIL OFL 1.1 | `public/fonts/LICENSE-montserrat.txt` |
| Oswald | News | SIL OFL 1.1 | `public/fonts/LICENSE-oswald.txt` |
| Inter | Body and social | SIL OFL 1.1 | `public/fonts/LICENSE-inter.txt` |
| JetBrains Mono | CCTV | SIL OFL 1.1 | `public/fonts/LICENSE-jetbrains-mono.txt` |
| VT323 | VHS readout | SIL OFL 1.1 | `public/fonts/LICENSE-vt323.txt` |
| Yellowtail | Postcard script | Apache 2.0 | `public/fonts/LICENSE-yellowtail.txt` |

Pricedown is a commercial face and is not used. The files under `public/fonts/` are the woff2 cuts from Fontsource.

The map component draws original SVG. It is a stylized stand-in. If a shot uses the Yanis v16 Leonida map, that art is CC BY 4.0 and the video needs the credit on screen and in the description. The pilot map cues already carry: "Stylized stand-in. Yanis v16 Leonida map is CC BY 4.0 if that art is used."

The synthesized SFX and music bed are placeholders so the mix has something to duck. Replace them before publish. Trailer audio is never used. Do not import the friend kit's SFX or its Pricedown files.

Whisper captions stay as `words.json` wrote them. Fix spellings in the overlay copy, and in a captions pass, when you want the burned-in line to differ from the transcript.
