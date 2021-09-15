import { mediaQuery } from "./media-query";
import { CSSObject } from "@emotion/css";

export const colors = {
  text: "rgb(85, 85, 85)",
  textMuted: "rgb(166, 166, 166)",
  textDisabled: "rgb(166, 166, 166)",
  textDecorativeLight: "rgb(168, 185, 212)",
  textLink: "rgb(58, 108, 234)",
  textLinkFocused: "rgb(35, 82, 124)",
  divider: "rgba(0, 0, 0, 0.07)",
  primary: "#DADADA",
  white: "##FFF",
  black: "#000000",
  inputBackground: "rgb(240, 240, 242)",
  activeBackground: "rgba(0,0,0,0.1)",
  button: {
    primaryText: "white",
    secondaryText: "white",
    get primaryBackground() {
      return colors.primary;
    },
    secondaryBackground: "rgb(160, 160, 160)",
  },
  canvas: {
    background: "rgb(249,249,249)",
  },
  icon: "rgb(139, 139, 139)",
  iconSelected: "rgb(220, 220, 220)",
};

export const fonts = {
  normal: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  monospace: "Menlo, Monaco, Consolas, 'Courier New', monospace",
};

const typeScale = [3.052, 2.441, 1.953, 1.563, 1.25, 1, 0.85];

export const textStyles = {
  title: {
    fontFamily: fonts.normal,
    fontSize: `${typeScale[0]}rem`,
    fontWeight: "bold",
    lineHeight: "1.4",
    [mediaQuery.small]: {
      fontSize: "36px",
    },
  } as CSSObject,
  subtitle: {
    fontFamily: fonts.normal,
    fontSize: `${typeScale[3]}rem`,
    fontWeight: 500,
    lineHeight: "1.75",
    [mediaQuery.small]: {
      fontSize: "18px",
    },
  } as CSSObject,
  body: {
    fontFamily: fonts.normal,
    fontSize: `${typeScale[5]}rem`,
    fontWeight: 400,
    lineHeight: "1.75",
  } as CSSObject,
  code: {
    fontFamily: fonts.monospace,
    fontSize: "90%",
    lineHeight: "1.5",
  } as CSSObject,
};

export const sizes = {
  body: {
    padding: {
      left: 16,
      right: 16,
    },
  },
  spacing: {
    nano: 2,
    micro: 4,
    small: 8,
    medium: 16,
    large: 32,
    xlarge: 64,
    xxlarge: 128,
  },
};

export const light = {
  colors: colors,
  fonts: fonts,
  textStyles: textStyles,
  sizes: sizes,
};
