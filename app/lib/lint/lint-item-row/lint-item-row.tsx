import * as React from "react";
import styled from "@emotion/styled";
import { LintError, LintErrorIcon } from "../lint-error-icon";
import { LintLevelIndicator } from "../lint-level-indicator";

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
}

interface State {}

export class LintItemRow extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  CloseIcon = require("../../components/assets/close.svg") as string;
  ExpandIcon = require("../../components/assets/expand.svg") as string;

  render() {
    return (
      <Wrapper>
        <Inner>
          {this.props.icon && <LintErrorIcon id={LintError.name} />}
          <Title>{this.props.error.name}</Title>
          <LintLevelIndicator color={this.props.level} />
          {this.props.expand ? <this.ExpandIcon /> : <this.CloseIcon />}
        </Inner>
        <SubTitle>{this.props.error.userMessage}</SubTitle>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  background: #fff;

  &:hover {
    background: #fcfcfc;
  }
`;

const Inner = styled.div`
  display: flex;
`;
const Title = styled.h6`
  margin: 0;

  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  margin-right: auto;
`;

const SubTitle = styled.h6`
  margin: 0;
  font-size: 12px;
  line-height: 14px;
  margin-top: 4px;
  max-width: 262px;

  color: #666666;
`;
