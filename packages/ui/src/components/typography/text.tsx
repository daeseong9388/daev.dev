import { ElementType, ReactNode } from "react";
import { Box } from "@/components/layout/box";
import { Sprinkles, sprinkles } from "@/styles/sprinkles.css";
import * as styles from "@/styles/typography.css";
import cn from "classnames";

const colorMap = {
  neutral: { lightMode: "gray700", darkMode: "gray100" },
  strong: { lightMode: "gray900", darkMode: "gray100" },
  code: { lightMode: "white" },
  link: { lightMode: "gray700", darkMode: "gray100" },
  secondary: { lightMode: "gray500", darkMode: "gray400" },
  highlight: { lightMode: "pink500" },
} as const;

interface TextStyleProps {
  size?: keyof typeof styles.text;
  color?: keyof typeof colorMap;
  weight?: keyof typeof styles.weight;
  align?: Sprinkles["textAlign"];
  baseline?: boolean;
  type?: Exclude<keyof typeof styles.font, "brand" | "heading">;
}

export interface TextProps extends TextStyleProps {
  component?: ElementType;
  children: ReactNode;
}

export const getTextStyles = ({
  size = "standard",
  color = "neutral",
  weight = "regular",
  type = "body",
  align,
  baseline = true,
}: TextStyleProps) =>
  cn(
    styles.font[type],
    baseline ? styles.text[size].trimmed : styles.text[size].untrimmed,
    sprinkles({ color: colorMap[color], textAlign: align }),
    styles.weight[weight],
  );

export default ({
  component = "span",
  size,
  color,
  weight,
  align,
  baseline = true,
  type,
  children,
}: TextProps) => {
  return (
    <Box
      component={component}
      display="block"
      className={getTextStyles({ size, color, weight, type, align, baseline })}
    >
      {children}
    </Box>
  );
};
