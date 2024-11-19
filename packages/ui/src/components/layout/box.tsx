import type { Sprinkles } from "@/styles/sprinkles.css.js";
import { AllHTMLAttributes, createElement, ElementType } from "react";
import cn from "classnames";
import { sprinkles } from "@/styles/sprinkles.css.js";

export type BoxProps = Sprinkles & {
  component?: ElementType;
  className?: string;
} & Omit<
    AllHTMLAttributes<HTMLElement>,
    | "className"
    | "content"
    | "height"
    | "translate"
    | "color"
    | "width"
    | "cursor"
    | keyof Sprinkles
  >;

export const getProps = (props: BoxProps) => {
  const {
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    display,
    gap,
    alignItems,
    justifyContent,
    flexDirection,
    flexWrap,
    flexGrow,
    flexShrink,
    position,
    top,
    bottom,
    left,
    right,
    inset,
    width,
    maxWidth,
    minWidth,
    zIndex,
    background,
    color,
    borderRadius,
    opacity,
    pointerEvents,
    cursor,
    textAlign,
    transition,
    overflow,
    className,
    ...domProps
  } = props;

  const atomClasses = cn(
    sprinkles({
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      display,
      gap,
      alignItems,
      justifyContent,
      flexDirection,
      flexWrap,
      flexGrow,
      flexShrink,
      position,
      top,
      bottom,
      left,
      right,
      inset,
      width,
      maxWidth,
      minWidth,
      zIndex,
      background,
      color,
      borderRadius,
      opacity,
      pointerEvents,
      cursor,
      textAlign,
      transition,
      overflow,
    }),
    className,
  );

  return { className: atomClasses, ...domProps };
};

export const Box = ({ component = "div", ...props }: BoxProps) => {
  return createElement(component, getProps(props));
};
