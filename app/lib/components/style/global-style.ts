import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const ButtonStyle = css`
  width: calc(50% - 5px);
  /* for unused .MuiButton-root margin: 0  */
  /* margin-left: 5px !important; */
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  border: 1px solid #151617;
  box-sizing: border-box;
  padding-top: 16px;
  padding-bottom: 16px;

  // FIXME: CHEKC IS RIGHT CA[ITALIZE? ]
  text-transform: capitalize;
`;

export const BlackButton = css`
  ${ButtonStyle}

  background: #151617;
  width: 66.666666%;

  // for reset material-ui button style
  &:hover {
    color: #fff;
    background: #17181a;
  }
`;

export const WhtieButton = css`
  ${ButtonStyle}

  color: #151617;
  background: #fff;
`;
