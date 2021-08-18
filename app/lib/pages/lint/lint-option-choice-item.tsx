import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";
import { Column, Row } from "../../components/style/global-style";

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
  return (
    <Wrapper>
      <Row>
        <StyledArrow selected={props.selected}>
          <Icon src={RightArrowIcon} />
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
    img {
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
