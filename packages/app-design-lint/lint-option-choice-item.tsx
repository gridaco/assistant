import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Column, Row } from "@ui/core";

interface Props {
  selected: boolean;
  placeholder?: boolean;
  choice: {
    title: string;
    explanation: string;
  };
}

export function OptionChoiceItem(props: Props) {
  function RightArrowIcon() {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" />
      </svg>
    );
  }
  return (
    <Wrapper>
      <Row>
        <StyledArrow selected={props.selected}>
          <RightArrowIcon />
        </StyledArrow>
        <Column>
          <Title>{props.choice.title}</Title>
          <SubTitle>{props.choice.explanation}</SubTitle>
        </Column>
      </Row>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  cursor: pointer;
  &:hover {
    svg {
      fill: #8b8b8b;
    }
    h6 {
      color: #8a8a8a;
    }
  }
`;

const Icon = styled.img`
  margin-right: 15px;
`;

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

const SubTitle = styled.span`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #8a8a8a;
`;
