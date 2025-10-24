import {
  Inter,
  Merriweather,
  Playfair_Display,
  Roboto,
} from "next/font/google";
import localFont from "next/font/local";

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

// JetBrains Mono - 使用本地 Variable Font
export const jetbrains = localFont({
  src: "../../public/fonts/JetBrainsMono-2.304/fonts/variable/JetBrainsMono[wght].ttf",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800", // Variable font 支援 100-800 字重範圍
});

// Traditional Chinese version (主要使用)
export const genRyuMin = localFont({
  src: [
    {
      path: "../../public/fonts/GenRyuMin2TW-otf/GenRyuMin2TW-EL.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-otf/GenRyuMin2TW-L.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-otf/GenRyuMin2TW-R.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-otf/GenRyuMin2TW-M.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-otf/GenRyuMin2TW-SB.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-otf/GenRyuMin2TW-B.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2TW-otf/GenRyuMin2TW-H.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-genryumin",
  display: "swap",
});

// Japanese version (for Japanese content)
export const genRyuMinJP = localFont({
  src: [
    {
      path: "../../public/fonts/GenRyuMin2JP-otf/GenRyuMin2JP-EL.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-otf/GenRyuMin2JP-L.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-otf/GenRyuMin2JP-R.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-otf/GenRyuMin2JP-M.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-otf/GenRyuMin2JP-SB.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-otf/GenRyuMin2JP-B.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/GenRyuMin2JP-otf/GenRyuMin2JP-H.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-genryumin-jp",
  display: "swap",
});

export const fontVariables = [
  playfair.variable,
  merriweather.variable,
  inter.variable,
  roboto.variable,
  jetbrains.variable,
  genRyuMin.variable,
  genRyuMinJP.variable,
].join(" ");
