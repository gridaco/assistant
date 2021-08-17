import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";

interface Props {
  selected: boolean;
  placeholder?: boolean;
  choice: {
    title: string;
    explanation: string;
  };
}

export function OptionChoiceItem(props: Props) {
  const RightArrowIcon =
    require("../../../lib/components/assets/right-arrow.svg") as string;
  alert("hi");
  return (
    <>
      <StyledArrow selected={props.selected}>
        <img src={RightArrowIcon} />
      </StyledArrow>
      <Title>{props.choice.title}</Title>
      <SubTitle>{props.choice.explanation}</SubTitle>
    </>
  );
}

const StyledArrow = styled.div<{ selected: boolean }>`
  cursor: pointer;

  ${(props) =>
    props.selected
      ? css`
          fill: "#000";
        `
      : props.placeholder
      ? css`
          fill: "#DEDEDE";
        `
      : css`
          fill: "rgba(255,255,255,0)";

          &:hover {
            fill: "#8B8B8B;";
          }
        `}
`;

const Title = styled.h6`
  margin: 0;

  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;

  color: #000000;
`;

const SubTitle = styled.body`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #8a8a8a;
`;
