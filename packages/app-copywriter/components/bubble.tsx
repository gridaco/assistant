import React from "react";
import styled from "@emotion/styled";

export function Bubble({ children }: React.PropsWithChildren<{}>) {
  return <BubbleWrapper>{children}</BubbleWrapper>;
}

const BubbleWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 21px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
`;
