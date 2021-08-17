import * as React from "react";
import styled from "@emotion/styled";
import { LintError, LintErrorIcon } from "../lint-error-icon";
import { LintLevelIndicator } from "../lint-level-indicator";
import { choiceItem } from "../lint-list-view";

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

export function LintItemRow(props: Props) {
  const CloseIcon = require("../../components/assets/close.svg") as string;
  const ExpandIcon = require("../../components/assets/expand.svg") as string;

  return (
    <Wrapper>
      <Inner>
        <IconWrapper>
          <LintErrorIcon id={props.icon} />
        </IconWrapper>

        <Title>{props.error.name}</Title>
        <IndicatorWrapper>
          <LintLevelIndicator color={"warning"} />
        </IndicatorWrapper>

        {props.expand ? <img src={ExpandIcon} /> : <img src={CloseIcon} />}
      </Inner>
      <SubTitle>{props.error.userMessage}</SubTitle>
      {props.onTap([choiceItem])}
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

  &:hover {
    background: #fcfcfc;
  }
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
