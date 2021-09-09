import { light } from "./light";
import { dark } from "./dark";
import styled, { CreateStyled } from "@emotion/styled";
export * from "./theme-provider";

export const theme = {
  dark: dark,
  light: light,
};

type _Theme = typeof light;
export type Theme = _Theme;

declare module "@emotion/react" {
  export interface Theme extends _Theme {}
}

// //@ts-ignore - below line sometimes throw "Type error: Type 'CreateStyled' is not generic." even if it is generic typed
// export default styled as CreateStyled<_Theme>;
