import styled from "@emotion/styled";
import React from "react";
export function Divider({
  theme = "light",
  color = "#bbb",
}: {
  theme?: "dark" | "light";
  color?: string;
}) {
  return <DividerStyled />;
}

const DividerStyled = styled.div`
  border-top: 1px solid #bbb;
`;
