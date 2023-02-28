import styled from "@emotion/styled";
import React from "react";

export function SecondaryWorkmodeChoice(props: {
  name: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return <Title onClick={props.onClick}>{props.name}</Title>;
}

const Title = styled.h6`
  font-size: 19px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
  color: #cfcfcf;
  cursor: pointer;
  text-transform: capitalize;
  margin: 0; // for reset h6 inital margin
  margin-right: 10px;
  user-select: none;

  /* &:nth-child(3n) {
    margin-right: 0;
  } */

  &:hover {
    color: #606060;
  }
`;
