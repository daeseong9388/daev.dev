import type { Sprinkles } from "@/styles/sprinkles.css";
import { AllHTMLAttributes, createElement, ElementType } from "react";
import { sprinkles } from "@/styles/sprinkles.css";
import cn from "classnames";

export type SpaceProps = {
  padding?: Sprinkles["padding"];
  paddingX?: Sprinkles["paddingX"];
  paddingY?: Sprinkles["paddingY"];
  paddingTop?: Sprinkles["paddingTop"];
  paddingBottom?: Sprinkles["paddingBottom"];
  paddingLeft?: Sprinkles["paddingLeft"];
  paddingRight?: Sprinkles["paddingRight"];
  margin?: Sprinkles["margin"];
  marginX?: Sprinkles["marginX"];
  marginY?: Sprinkles["marginY"];
  marginTop?: Sprinkles["marginTop"];
  marginBottom?: Sprinkles["marginBottom"];
  marginLeft?: Sprinkles["marginLeft"];
  marginRight?: Sprinkles["marginRight"];
};

export type FlexProps = {
  display?: Sprinkles["display"];
  alignItems?: Sprinkles["alignItems"];
  justifyContent?: Sprinkles["justifyContent"];
  flexDirection?: Sprinkles["flexDirection"];
  flexWrap?: Sprinkles["flexWrap"];
  flexGrow?: Sprinkles["flexGrow"];
  flexShrink?: Sprinkles["flexShrink"];
};

export type LayoutProps = {
  position?: Sprinkles["position"];
  top?: Sprinkles["top"];
  bottom?: Sprinkles["bottom"];
  left?: Sprinkles["left"];
  right?: Sprinkles["right"];
  inset?: Sprinkles["inset"];
  width?: Sprinkles["width"];
  maxWidth?: Sprinkles["maxWidth"];
  minWidth?: Sprinkles["minWidth"];
  zIndex?: Sprinkles["zIndex"];
};

export type StyleProps = {
  background?: Sprinkles["background"];
  color?: Sprinkles["color"];
  borderRadius?: Sprinkles["borderRadius"];
  opacity?: Sprinkles["opacity"];
  pointerEvents?: Sprinkles["pointerEvents"];
  cursor?: Sprinkles["cursor"];
  textAlign?: Sprinkles["textAlign"];
  transition?: Sprinkles["transition"];
  overflow?: Sprinkles["overflow"];
};

export type BoxProps = SpaceProps &
  FlexProps &
  LayoutProps &
  StyleProps & {
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
    | keyof SpaceProps
    | keyof FlexProps
    | keyof LayoutProps
    | keyof StyleProps
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
