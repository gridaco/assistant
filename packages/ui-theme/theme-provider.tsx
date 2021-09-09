import React from "react";

// =========== issue: https://github.com/storybookjs/storybook/issues/10231
import { ThemeProvider as _ThemeProvider, useTheme } from "@emotion/react";
// import { ThemeProvider as _ThemeProvider, useTheme } from "emotion-theming";
// ===========
import styled from "@emotion/styled";

import { light } from "./light";
import { dark } from "./dark";

/**
 * if both light and dark is checked, it follows system theme, otherwise fallbacks to light.
 * @param props
 * @returns
 */
export function EditorThemeProvider(props: {
  children: JSX.Element[] | JSX.Element;
  light?: boolean;
  dark?: boolean;
  theme?: "light" | "dark";
  debug?: boolean;
}) {
  /**
   * 1. use theme props
   * 2. use light props
   * 3. use dark props
   * 4. otherwise, fallback to light
   */
  const themename = props?.theme ?? props.light ?? props.dark ?? "light";
  const themedata = themename ? light : dark;
  return (
    <_ThemeProvider theme={themedata}>
      {props.debug && <ThemeDebugger />}
      {props.children}
    </_ThemeProvider>
  );
}

function ThemeDebugger() {
  const theme = useTheme();
  console.log("theme", theme);
  return <code style={{ height: 100 }}>{JSON.stringify(theme)}</code>;
}

export { useTheme };
export { styled };
