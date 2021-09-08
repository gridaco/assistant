import { css } from "@emotion/react";

export const ButtonStyle = css`
  width: calc(50% - 5px);
  /* for unused .MuiButton-root margin: 0  */
  /* margin-left: 5px !important; */
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  box-sizing: border-box;
  padding-top: 16px;
  padding-bottom: 16px;
  cursor: pointer;
  outline: none;

  // FIXME: CHEKC IS RIGHT capitalize?
  text-transform: capitalize;
`;

export const BlackButtonStyle = css`
  ${ButtonStyle}
  border: 1px solid #151617;
  background: #151617;
  color: #fff;
  width: 61%;

  // for reset material-ui button style
  &:hover {
    color: #fff;
    background: #17181a;
  }

  &:disabled {
    background: #949494;
    color: #bbb;
    border: 1px solid #949494;
  }
`;

export const WhtieButtonStyle = css`
  ${ButtonStyle}
  /* border: 1px solid #151617; */
  border: 0;
  color: #151617;
  background: #fff;
`;

export const TransparentButtonStyle = css`
  ${ButtonStyle}
  color: #c1c1c1;
  border: 0;
  background: rgba(255, 255, 255, 0);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
