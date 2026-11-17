import { loadFont } from "@remotion/fonts";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

const handle = delayRender("Loading GTAFolio fonts");

const face = (family: string, file: string, weight: string) =>
  loadFont({
    family,
    url: staticFile(`fonts/${file}`),
    weight,
    format: "woff2",
  });

Promise.all([
  face("Anton", "anton-400.woff2", "400"),
  face("Lilita One", "lilita-one-400.woff2", "400"),
  face("Alfa Slab One", "alfa-slab-one-400.woff2", "400"),
  face("Yellowtail", "yellowtail-400.woff2", "400"),
  face("VT323", "vt323-400.woff2", "400"),
  face("Montserrat", "montserrat-300.woff2", "300"),
  face("Montserrat", "montserrat-400.woff2", "400"),
  face("Montserrat", "montserrat-500.woff2", "500"),
  face("Montserrat", "montserrat-600.woff2", "600"),
  face("Montserrat", "montserrat-700.woff2", "700"),
  face("Oswald", "oswald-400.woff2", "400"),
  face("Oswald", "oswald-500.woff2", "500"),
  face("Oswald", "oswald-600.woff2", "600"),
  face("Oswald", "oswald-700.woff2", "700"),
  face("Inter", "inter-300.woff2", "300"),
  face("Inter", "inter-400.woff2", "400"),
  face("Inter", "inter-500.woff2", "500"),
  face("Inter", "inter-600.woff2", "600"),
  face("Inter", "inter-700.woff2", "700"),
  face("Inter", "inter-800.woff2", "800"),
  face("JetBrains Mono", "jetbrains-mono-400.woff2", "400"),
  face("JetBrains Mono", "jetbrains-mono-700.woff2", "700"),
])
  .then(() => continueRender(handle))
  .catch((error: unknown) => cancelRender(error));
