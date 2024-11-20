import { Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";

export const fontNotoSansKR = Noto_Sans_KR({
  display: "swap",
  variable: "--font-noto",
  subsets: ["latin"],
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "avenir next",
    "avenir",
    "segoe ui",
    "helvetica neue",
    "helvetica",
    "Ubuntu",
    "roboto",
    "noto",
    "arial",
    "sans-serif",
  ],
});

export const fontRecursiveVF = localFont({
  src: "../fonts/Recursive_VF.woff2",
  variable: "--font-recursive",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "avenir next",
    "avenir",
    "segoe ui",
    "helvetica neue",
    "helvetica",
    "Ubuntu",
    "roboto",
    "noto",
    "arial",
    "sans-serif",
  ],
});

// export const fontPretendard = localFont({
//   src: '../public/fonts/PretendardVariable.woff2',
//   weight: '100 900',
//   display: 'swap',
//   fallback: [
//     '-apple-system',
//     'BlinkMacSystemFont',
//     'avenir next',
//     'avenir',
//     'segoe ui',
//     'helvetica neue',
//     'helvetica',
//     'Ubuntu',
//     'roboto',
//     'noto',
//     'arial',
//     'sans-serif'
//   ]
// });
//
