import styled from "@emotion/styled";
import React from "react";

export function SecondaryWorkmodeChoice(props: {
  name: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return <Title>{props.name}</Title>;
}

// not used
interface Props {
  disabled: boolean;
}

const Title = styled.h6`
  font-size: 21px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
  color: #cfcfcf;
  cursor: pointer;

  &:hover {
    color: #606060;
  }
`;
