import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";
import { Level } from "./lint-colors";

interface ILintLevelIndicator {
  color: string;
}

export function LintLevelIndicator(props: ILintLevelIndicator) {
  return <Indicator color={props.color} />;
}

interface IIndicator {
  color: string;
}

const Indicator = styled.div<IIndicator>`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  ${(props) =>
    props.color == Level.warn
      ? css`
          background: #ffc700;
        `
      : props.color == Level.error
      ? css`
          background: #ff3a3a;
        `
      : props.color == Level.ignore
      ? css`
          background: #c6c6c6;
        `
      : props.color == Level.todo
      ? css`
          background: #000;
        `
      : css`
          background: #fff;
        `};
`;
