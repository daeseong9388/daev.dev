import { globalStyle } from "@vanilla-extract/css";

// Box sizing rules
globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

// Prevent font size inflation
globalStyle("html", {
  MozTextSizeAdjust: "none",
  WebkitTextSizeAdjust: "none",
  textSizeAdjust: "none",
});

// Remove default margin
globalStyle("body, h1, h2, h3, h4, p, figure, blockquote, dl, dd", {
  marginBlockEnd: 0,
});

// globalStyle('*', {
//   margin: 0
// });

// Remove list styles
globalStyle("ul[role='list'], ol[role='list']", {
  listStyle: "none",
});

// Set core body defaults
globalStyle("body", {
  minHeight: "100vh",
  lineHeight: 1.5,
  WebkitFontSmoothing: "antialiased",
});

// Allow percentage-based heights in the application
globalStyle("html, body", {
  height: "100%",
});

// Set shorter line heights
globalStyle("h1, h2, h3, h4, button, input, label", {
  lineHeight: 1.1,
});

// Balance text wrapping
globalStyle("h1, h2, h3, h4", {
  textWrap: "balance",
});

// A elements default styles
globalStyle("a:not([class])", {
  textDecorationSkipInk: "auto",
  color: "currentColor",
});

// Image handling, Improve media defaults
globalStyle("img, picture, video, canvas, svg", {
  display: "block",
  maxWidth: "100%",
});

// Form elements
globalStyle("input, button, textarea, select", {
  // fontFamily: 'inherit',
  // fontSize: 'inherit'
  font: "inherit",
});

// Avoid text overflows
globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word",
});

// Create a root stacking context
globalStyle("#root, #__next", {
  isolation: "isolate",
});

// Textarea without rows
globalStyle("textarea:not([rows])", {
  minHeight: "10em",
});

// Target scroll margin
globalStyle(":target", {
  scrollMarginBlock: "5ex",
});
