import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ForwardArrowIcon from "./icon/forward-arrow";

interface ButtonGroupProps {
  forwardEnable?: boolean;
  backEnable?: boolean;
  handleClick: (isBack: boolean) => void;
}
interface BrowserNavigationBfButtonProps {
  isBack?: boolean;
  hasHistory: boolean;
  onClick?: (isBack: boolean) => void;
}

export function BrowserNavigationBfButton(
  props?: BrowserNavigationBfButtonProps
) {
  console.log(props.hasHistory);
  return (
    <BtnWrap
      onClick={() => props.onClick(!!props.isBack)}
      isShow={!props.hasHistory}
      disabled={!props.hasHistory}
    >
      <ArrowIconWrap isBack={props.isBack}>
        <ForwardArrowIcon />
      </ArrowIconWrap>
    </BtnWrap>
  );
}

export function BrowserNavigationBfButtonGroup(props: ButtonGroupProps) {
  return (
    <Wrap>
      <BrowserNavigationBfButton
        onClick={() => props.handleClick(true)}
        hasHistory={props.backEnable}
        isBack={true}
      />
      <BrowserNavigationBfButton
        onClick={() => props.handleClick(false)}
        hasHistory={props.forwardEnable}
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  justify-content: flex-start;
  flex-direction: row;
  align-items: start;
  flex: none;

  button {
    &:first-child {
      margin-right: 6px;
    }
  }
`;

const BtnWrap = styled.button<{ isShow: boolean }>`
  /* clear button origin style */
  border: 0;
  padding: 0;

  position: relative;
  width: 28px;
  height: 24px;
  border-radius: 4px;

  background-color: transparent;

  ${(props) =>
    props.isShow
      ? css`
          cursor: default;
          opacity: 0;
        `
      : css`
          cursor: pointer;
        `}

  &:hover {
    background-color: rgba(242, 242, 242, 1);
    border-radius: 4px;
  }
`;

const ArrowIconWrap = styled.span<{ isBack?: boolean }>`
  position: absolute;
  left: calc(50% - 8px);
  top: calc(50% - 8px);

  transform: ${(props) => (props.isBack ? "rotate(180deg)" : "rotate(0deg)")};

  & > svg {
    display: block;
  }
`;
