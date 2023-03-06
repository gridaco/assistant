import React from "react";
import styled from "@emotion/styled";

export function Bubble({
  onClick,
  children,
  style = {},
}: React.PropsWithChildren<{
  onClick?: () => void;
  style?: React.CSSProperties;
}>) {
  return (
    <BubbleWrapper style={style} onClick={onClick}>
      {children}
    </BubbleWrapper>
  );
}

const BubbleWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 21px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;

  font-family: "Inter", sans-serif;
  font-weight: 400;

  p {
    margin: 0;
    font-size: 16px;
    line-height: 140%;
    color: rgba(0, 0, 0, 0.8);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  transition: all 0.05s ease-in-out;
`;
