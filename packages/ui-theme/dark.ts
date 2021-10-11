import * as lightTheme from "./light";

export const colors = {
  ...lightTheme.colors,
  text: "rgb(248,248,250)",
  textMuted: "rgb(180,180,180)",
  textDisabled: "rgb(100,100,100)",
  inputBackground: "rgb(50,50,52)",
  divider: "rgba(255,255,255,0.1)",
  canvas: {
    ...lightTheme.colors.canvas,
    background: "rgb(19,20,21)",
  },
};

export const textStyles = lightTheme.textStyles;
export const fonts = lightTheme.fonts;
export const sizes = lightTheme.sizes;

export const dark = {
  colors: colors,
  fonts: fonts,
  textStyles: textStyles,
  sizes: sizes,
};
