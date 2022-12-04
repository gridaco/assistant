import { css } from "@emotion/react";

export const ButtonStyle = css`
  /* width: calc(50% - 5px); */
  /* for unused .MuiButton-root margin: 0  */
  /* margin-left: 5px !important; */
  height: 48px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;
  box-sizing: border-box;
  padding-top: 14px;
  padding-bottom: 14px;
  cursor: pointer;
  outline: none;
`;

export const BlackButtonStyle = css`
  ${ButtonStyle}
  border: 1px solid #151617;
  background: #151617;
  color: #fff;
  min-width: 60%;

  // for reset material-ui button style
  &:hover {
    color: #fff;
    opacity: 0.9;
  }

  &:active {
    opacity: 1;
  }

  &:disabled {
    background: #949494;
    color: #bbb;
    border: 1px solid #949494;
  }
`;

export const TextButtonBase = css`
  ${ButtonStyle}
  border: 0;
  color: #151617;
  background: transparent;
  &:hover {
    background: rgba(221, 221, 221, 0.2);
  }
`;

export const BlackTextButtonStyle = css`
  ${TextButtonBase}
  color: #151617;
  &:hover {
    background: rgba(221, 221, 221, 0.2);
  }
`;

export const WhiteTextButtonStyle = css`
  ${TextButtonBase}
  color: #FFFF;
  &:hover {
    background: rgba(221, 221, 221, 0.2);
  }
`;

export const BlueButtonStyle = css`
  ${ButtonStyle}
  background: rgba(38, 99, 255, 1);
  border: solid 1px rgba(68, 132, 255, 1);
  color: #fff;
  &:hover {
    background: rgba(57, 112, 251, 1);
  }
  &:disabled {
    opacity: 50%;
  }
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
