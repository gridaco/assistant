import * as React from "react";
import styled from "@emotion/styled";
import type { ReflectLintFeedbackLevel } from "@reflect-ui/lint/lib/feedbacks";
import { LintError, LintErrorIcon } from "../lint-error-icon";
import { LintLevelIndicator } from "../lint-level-indicator";
import { choiceItem } from "../lint-list-view";
import { OptionChoiceItem } from "../lint-option-choice-item";
import { default as CloseIcon } from "@assistant/icons/caret-up";
import { default as ExpandIcon } from "@assistant/icons/caret-down";

interface Props {
  onTap: Function;
  name: string;
  icon?: any;
  expand: boolean;
  level: ReflectLintFeedbackLevel;
  error: {
    name: string;
    userMessage: string;
  };
  children?: any;
  /** true by default */
  expandable?: boolean;
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

export function LintItemRow({
  onTap,
  icon,
  error,
  level,
  expand,
  expandable = true,
}: Props) {
  return (
    <Wrapper>
      <Outer onClick={() => onTap()}>
        <Inner>
          <IconWrapper>
            <LintErrorIcon id={icon} />
          </IconWrapper>

          <Title>{error.name}</Title>
          <IndicatorWrapper>
            <LintLevelIndicator color={level} />
          </IndicatorWrapper>

          {expandable && <>{expand ? <CloseIcon /> : <ExpandIcon />}</>}
        </Inner>
        <SubTitle>{error.userMessage}</SubTitle>
      </Outer>
      {expandable && expand && (
        <ChoiceWrapper>{Options([choiceItem])}</ChoiceWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: #fff;
  height: auto;
  margin-bottom: 16px;

  // for reset parent margin
  margin-right: -16px;
  margin-left: -16px;
  padding: 16px;
  padding-bottom: 16px;

  &:hover {
    background: #fcfcfc;
  }
`;

const Outer = styled.div`
  padding-bottom: 32px;
  cursor: pointer;
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
  margin-left: 6px;

  color: #666666;
`;

const ChoiceWrapper = styled.div`
  margin-bottom: 5px;
  display: block;

  &:last-child {
    margin-bottom: 0;
  }
`;
