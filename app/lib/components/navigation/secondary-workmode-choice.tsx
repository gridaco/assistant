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
  text-transform: capitalize;
  margin: 0; // for reset h6 inital margin
  margin-right: 10px;

  /* &:nth-child(3n) {
    margin-right: 0;
  } */

  &:hover {
    color: #606060;
  }
`;
