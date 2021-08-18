import * as React from "react";
import styled from "@emotion/styled";
import { LintError, LintErrorIcon } from "../lint-error-icon";
import { LintLevelIndicator } from "../lint-level-indicator";
import { choiceItem } from "../lint-list-view";
import { OptionChoiceItem } from "../../pages/lint/lint-option-choice-item";

interface Props {
  onTap: Function;
  name: string;
  icon?: any;
  expand: boolean;
  level: string;
  error: {
    id: string;
    name: string;
    userMessage: string;
  };
  children?: any;
}

function Options(children: any[]) {
  return (
    <>
      {children.map((item, i) => {
        return <OptionChoiceItem key={i} {...item} />;
      })}
    </>
  );
}

export function LintItemRow(props: Props) {
  const CloseIcon = require("../../components/assets/close.svg") as string;
  const ExpandIcon = require("../../components/assets/expand.svg") as string;

  return (
    <Wrapper>
      <Outer onClick={() => props.onTap()}>
        <Inner>
          <IconWrapper>
            <LintErrorIcon id={props.icon} />
          </IconWrapper>

          <Title>{props.error.name}</Title>
          <IndicatorWrapper>
            <LintLevelIndicator color={props.level} />
          </IndicatorWrapper>

          {props.expand ? <img src={CloseIcon} /> : <img src={ExpandIcon} />}
        </Inner>
        <SubTitle>{props.error.userMessage}</SubTitle>
      </Outer>

      <ChoiceWrapper display={props.expand}>
        {Options([choiceItem])}
      </ChoiceWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #fff;
  height: 100px;
  margin-bottom: 16px;

  // for reset parent margin
  margin-right: -16px;
  margin-left: -16px;
  padding: 16px;
  padding-bottom: 32px;

  &:hover {
    background: #fcfcfc;
  }
`;

const Outer = styled.div`
  padding-bottom: 32px;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: 6px;
`;

const IndicatorWrapper = styled.div`
  margin-right: 10px;
`;

const Title = styled.h6`
  margin: 0;
  margin-right: auto;

  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #202020;
`;

const SubTitle = styled.h6`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  margin-top: 4px;
  max-width: 262px;

  color: #666666;
`;

const ChoiceWrapper = styled.div<{ display: boolean }>`
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 0;
  }

  display: ${(props) => (props.display ? "block" : "none")};
`;
