import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";
import { LintColor } from "./lint-colors";

interface ILintLevelIndicator {
  color: LintColor;
}

export function LintLevelIndicator(props: ILintLevelIndicator) {
  return <Indicator color={props.color} />;
}

interface IIndicator {
  color: LintColor;
}

const Indicator = styled.div<IIndicator>`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  ${(props) =>
    props.color === LintColor.warn
      ? css`
          background: #ffc700;
        `
      : props.color === LintColor.error
      ? css`
          background: #ff3a3a;
        `
      : props.color === LintColor.ignore
      ? css`
          background: #c6c6c6;
        `
      : props.color === LintColor.todo
      ? css`
          background: #000;
        `
      : css`
          background: #fff;
        `};
`;
