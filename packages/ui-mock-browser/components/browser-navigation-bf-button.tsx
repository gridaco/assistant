import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ForwardArrowIcon from "./icon/forward-arrow";

interface BrowserNavigationBfButtonProps {
  isBack?: boolean;
}

export function BrowserNavigationBfButton(
  props?: BrowserNavigationBfButtonProps
) {
  return (
    <Wrap>
      <ArrowIconWrap isBack={props.isBack}>
        <ForwardArrowIcon />
      </ArrowIconWrap>
    </Wrap>
  );
}

const Wrap = styled.div`
  &:hover {
    background-color: rgba(242, 242, 242, 1);
    border-radius: 4px;
  }
`;

const ArrowIconWrap = styled.span<{ isBack?: boolean }>`
  position: absolute;
  left: calc((calc((50% + 0px)) - 8px));
  top: calc((calc((50% + 0px)) - 8px));

  transform: ${(props) => (props.isBack ? "rotate(180deg)" : "rotate(0deg)")};
`;
