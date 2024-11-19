import { ElementType, ReactNode } from "react";
import { Box } from "@/components/layout/box.js";
import { Sprinkles, sprinkles } from "@/styles/sprinkles.css.js";
import * as styles from "@/styles/typography.css.js";
import cn from "classnames";

export type HeadingLevel = keyof typeof styles.heading;
export type HeadingTag = "h1" | "h2" | "h3" | "h4";

const HEADING_TAGS: Record<HeadingLevel, HeadingTag> = {
  "1": "h1",
  "2": "h2",
  "3": "h3",
  "4": "h4",
} as const;

export const getHeadingComponent = (level: HeadingLevel): HeadingTag => {
  const tag = HEADING_TAGS[level];
  if (!tag) {
    throw new Error(`Invalid heading level: ${level}`);
  }

  return tag;
};

export interface HeadingProps {
  children: ReactNode;
  level: HeadingLevel;
  align?: Sprinkles["textAlign"];
  branded?: boolean;
  component?: ElementType;
}

export const getHeadingStyles = (
  level: HeadingLevel,
  branded = false,
  align?: Sprinkles["textAlign"],
) =>
  cn(
    branded ? styles.font.brand : styles.font.heading,
    sprinkles({
      textAlign: align,
      color: { lightMode: "gray900", darkMode: "gray100" },
    }),
    styles.heading[level].trimmed,
  );

export const Heading = ({
  level,
  component,
  branded = false,
  align,
  children,
}: HeadingProps) => {
  return (
    <Box
      component={component || getHeadingComponent(level)}
      className={getHeadingStyles(level, branded, align)}
    >
      {children}
    </Box>
  );
};
