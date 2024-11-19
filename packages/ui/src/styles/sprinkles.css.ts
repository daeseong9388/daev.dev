import type { ConditionalValue } from "@vanilla-extract/sprinkles";
import { calc } from "@vanilla-extract/css-utils";
import {
  createMapValueFn,
  createNormalizeValueFn,
  createSprinkles,
  defineProperties,
} from "@vanilla-extract/sprinkles";
import { mapValues } from "es-toolkit/compat";

import { vars } from "./themes.css";
import { breakpoints } from "./utils";

const space = vars.spacing;
export type Space = keyof typeof space;

const negativeSpace = {
  ["-xs"]: `${calc(space.xs).negate()}`,
  ["-sm"]: `${calc(space.sm).negate()}`,
  ["-md"]: `${calc(space.md).negate()}`,
  ["-lg"]: `${calc(space.lg).negate()}`,
  ["-xl"]: `${calc(space.xl).negate()}`,
  ["-2xl"]: `${calc(space["2xl"]).negate()}`,
  ["-3xl"]: `${calc(space["3xl"]).negate()}`,
};

const margins = {
  ...space,
  ...negativeSpace,
};

const responsiveProperties = defineProperties({
  conditions: mapValues(breakpoints, (bp) =>
    bp === 0 ? {} : { "@media": `screen and (min-width: ${bp}px)` },
  ),
  defaultCondition: "mobile",
  properties: {
    position: ["absolute", "relative", "fixed"],
    display: ["none", "block", "inline", "inline-block", "flex"],
    alignItems: ["flex-start", "center", "flex-end"],
    justifyContent: ["flex-start", "center", "flex-end", "space-between"],
    flexDirection: ["row", "row-reverse", "column", "column-reverse"],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    marginTop: margins,
    marginBottom: margins,
    marginLeft: margins,
    marginRight: margins,
    pointerEvents: ["none", "auto"],
    overflow: ["hidden"],
    opacity: [0, 1],
    textAlign: ["left", "center", "right"],
    minWidth: [0],
    maxWidth: vars.contentWidth,
    transition: {
      slow: "transform .3s ease, opacity .3s ease",
      fast: "transform .15s ease, opacity .15s ease",
    },
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    margin: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],
  },
});

export const mapResponsiveValue = createMapValueFn(responsiveProperties);
export const normalizeResponsiveValue =
  createNormalizeValueFn(responsiveProperties);

export type ResponsiveValue<Value extends string | number> = ConditionalValue<
  typeof responsiveProperties,
  Value
>;

export const lightMode = "light";
export const darkMode = "dark";

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { selector: `.${darkMode} &` },
  },
  defaultCondition: "lightMode",
  properties: {
    background: vars.palette,
    color: vars.palette,
  },
});

const unresponsiveProperties = defineProperties({
  properties: {
    flexWrap: ["wrap", "nowrap"],
    top: [0],
    bottom: [0],
    left: [0],
    right: [0],
    flexShrink: [0],
    flexGrow: [0, 1],
    zIndex: [-1, 0, 1],
    width: { full: "100%" },
    borderRadius: vars.border.radius,
    cursor: ["pointer"],
  },
  shorthands: {
    inset: ["top", "bottom", "left", "right"],
  },
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  unresponsiveProperties,
  colorProperties,
);

export type Sprinkles = Parameters<typeof sprinkles>[0];
