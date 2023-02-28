import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

export function WorkmodeButton(props: {
  name: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <>
      <WorkmodeLabel active={props.active} onClick={props.onClick}>
        {props.name}
      </WorkmodeLabel>
    </>
  );
}
interface Props {
  active: boolean;
}

const WorkmodeLabel = styled.h3<Props>`
  display: flex;
  text-transform: capitalize;
  font-size: 19px;
  letter-spacing: 0em;
  cursor: pointer;
  user-select: none;

  // reset for h3 init style
  margin: 0;

  &:first-child {
    margin-right: 12px;
  }

  ${(props) =>
    props.active
      ? css`
          font-weight: 700;
          line-height: 26px;
          color: #000;
        `
      : css`
          font-weight: 400;
          line-height: 25px;
          color: #cfcfcf;

          &:hover {
            font-weight: 400;
            line-height: 25px;
            letter-spacing: 0em;
            color: #606060;
          }
        `}
`;
