import React from "react";
import styled from "@emotion/styled";

export function Bubble({
  onClick,
  children,
}: React.PropsWithChildren<{
  onClick?: () => void;
}>) {
  return <BubbleWrapper onClick={onClick}>{children}</BubbleWrapper>;
}

const BubbleWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 21px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;

  p {
    margin: 0;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.8);
  }
`;
