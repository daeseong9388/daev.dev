import { precomputeValues } from "@capsizecss/vanilla-extract";
import { createGlobalTheme } from "@vanilla-extract/css";
import colors from "tailwindcss/colors.js";

import { Breakpoint } from "./utils.js";

const grid = 4;
const px = (value: string | number) => `${value}px`;

const notoSansMetric = {
  capHeight: 733,
  ascent: 1160,
  descent: -288,
  lineGap: 0,
  unitsPerEm: 1000,
};

const recursiveMetric = {
  capHeight: 700,
  ascent: 950,
  descent: -250,
  lineGap: 0,
  unitsPerEm: 1000,
};

const fontMetrics = {
  brand: recursiveMetric,
  heading: notoSansMetric,
  body: notoSansMetric,
  code: notoSansMetric,
};

const tailwindPalette = {
  white: "#fff",
  black: "#0e0e10",

  red: colors.red["500"],
  yellow: colors.yellow["300"],
  green50: colors.emerald["50"],
  green200: colors.emerald["200"],
  green300: colors.emerald["300"],
  green400: colors.emerald["400"],
  green500: colors.emerald["500"],
  green600: colors.emerald["600"],

  gray50: colors.gray["50"],
  gray100: colors.gray["100"],
  gray200: colors.gray["200"],
  gray300: colors.gray["300"],
  gray400: colors.gray["400"],
  gray500: colors.gray["500"],
  gray600: colors.gray["600"],
  gray700: colors.gray["700"],
  gray800: colors.gray["800"],
  gray900: colors.gray["900"],

  zinc50: colors.gray["50"],
  zinc100: colors.gray["100"],
  zinc200: colors.gray["200"],
  zinc300: colors.gray["300"],
  zinc400: colors.gray["400"],
  zinc500: colors.gray["500"],
  zinc600: colors.gray["600"],
  zinc700: colors.gray["700"],
  zinc800: colors.gray["800"],

  slate800: colors.slate["800"],
  slate900: colors.slate["900"],

  teal50: colors.teal["50"],
  teal100: colors.teal["100"],
  teal200: colors.teal["200"],
  teal200muted: "#b6eee3",
  teal300: colors.teal["300"],
  teal400: colors.teal["400"],
  teal500: colors.teal["500"],
  teal600: colors.teal["600"],
  teal700: colors.teal["700"],
  teal800: colors.teal["800"],
  teal900: colors.teal["900"],

  blue50: colors.sky["50"],
  blue100: colors.sky["100"],
  blue200: colors.sky["200"],
  blue300: colors.sky["300"],
  blue400: colors.sky["400"],
  blue500: colors.sky["500"],
  blue600: colors.sky["600"],
  blue700: colors.sky["700"],
  blue800: colors.sky["800"],
  blue900: colors.sky["900"],

  pink50: colors.fuchsia["50"],
  pink100: colors.fuchsia["100"],
  pink200: colors.fuchsia["200"],
  pink300: colors.fuchsia["300"],
  pink400: colors.fuchsia["400"],
  pink500: colors.fuchsia["500"],
  pink600: colors.fuchsia["600"],
  pink700: colors.fuchsia["700"],
  pink800: colors.fuchsia["800"],
  pink900: colors.fuchsia["900"],
};

const calculateTypographyStyles = (
  definition: Record<Breakpoint, { fontSize: number; rows: number }>,
  type: keyof typeof fontMetrics,
) => {
  const mobile = precomputeValues({
    fontSize: definition.mobile.fontSize,
    leading: definition.mobile.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  const tablet = precomputeValues({
    fontSize: definition.tablet.fontSize,
    leading: definition.tablet.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  const desktop = precomputeValues({
    fontSize: definition.desktop.fontSize,
    leading: definition.desktop.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  return {
    mobile: {
      fontSize: mobile.fontSize,
      lineHeight: mobile.lineHeight,
      capHeightTrim: mobile.capHeightTrim,
      baselineTrim: mobile.baselineTrim,
    },
    tablet: {
      fontSize: tablet.fontSize,
      lineHeight: tablet.lineHeight,
      capHeightTrim: tablet.capHeightTrim,
      baselineTrim: tablet.baselineTrim,
    },
    desktop: {
      fontSize: desktop.fontSize,
      lineHeight: desktop.lineHeight,
      capHeightTrim: desktop.capHeightTrim,
      baselineTrim: desktop.baselineTrim,
    },
  };
};

export const vars = createGlobalTheme(":root", {
  fonts: {
    brand: "var(--font-recursive)",
    heading: "var(--font-noto)",
    body: "var(--font-noto)",
    code: "var(--font-noto)",
  },
  grid: px(grid),
  spacing: {
    none: "0",
    xs: px(1 * grid),
    sm: px(2 * grid),
    md: px(3 * grid),
    lg: px(5 * grid),
    xl: px(8 * grid),
    "2xl": px(12 * grid),
    "3xl": px(24 * grid),
  },
  contentWidth: {
    xs: px(480),
    sm: px(600),
    standard: px(740),
    lg: px(960),
    xl: px(1120),
    "2xl": px(1350),
  },
  heading: {
    h1: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 36,
          rows: 12,
        },
        tablet: {
          fontSize: 52,
          rows: 15,
        },
        desktop: {
          fontSize: 52,
          rows: 15,
        },
      },
      "heading",
    ),
    h2: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 28,
          rows: 10,
        },
        tablet: {
          fontSize: 38,
          rows: 12,
        },
        desktop: {
          fontSize: 38,
          rows: 12,
        },
      },
      "heading",
    ),
    h3: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 24,
          rows: 8,
        },
        tablet: {
          fontSize: 30,
          rows: 10,
        },
        desktop: {
          fontSize: 30,
          rows: 10,
        },
      },
      "heading",
    ),
    h4: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 22,
          rows: 8,
        },
        tablet: {
          fontSize: 22,
          rows: 9,
        },
        desktop: {
          fontSize: 22,
          rows: 9,
        },
      },
      "heading",
    ),
  },
  text: {
    standard: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 18,
          rows: 9,
        },
        tablet: {
          fontSize: 20,
          rows: 10,
        },
        desktop: {
          fontSize: 20,
          rows: 10,
        },
      },
      "body",
    ),
    code: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 13,
          rows: 6,
        },
        tablet: {
          fontSize: 14,
          rows: 7,
        },
        desktop: {
          fontSize: 14,
          rows: 7,
        },
      },
      "body",
    ),
    sm: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 16,
          rows: 8,
        },
        tablet: {
          fontSize: 16,
          rows: 8,
        },
        desktop: {
          fontSize: 16,
          rows: 8,
        },
      },
      "body",
    ),
    xs: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 15,
          rows: 7,
        },
        tablet: {
          fontSize: 15,
          rows: 7,
        },
        desktop: {
          fontSize: 15,
          rows: 7,
        },
      },
      "body",
    ),
  },
  weight: {
    regular: "400",
    strong: "700",
  },
  palette: tailwindPalette,
  border: {
    width: {
      standard: px(1 * grid),
      lg: px(2 * grid),
    },
    radius: {
      sm: px(2 * grid),
      md: px(4 * grid),
      lg: px(7 * grid),
      full: "9999px",
    },
  },
});
