import React from "react";
import { CodeViewWithControl } from "@app/design-to-code/code-view-with-control";
import * as nodes from "@design-sdk/figma-node";
import styled from "@emotion/styled";
import Warning from "@assistant/icons/warning";

export default function (props: { node: nodes.IReflectNodeReference }) {
  return (
    <>
      <Wrapper>
        <Title>
          <Icon>
            <Warning />
          </Icon>
          Not a component
        </Title>
        <Description>
          You have to click one of the layer that is already a component or in a
          component.
        </Description>
        <div>
          <CustomButton>Move to Preview Tab</CustomButton>
          <CustomButton>Learn more</CustomButton>
        </div>
      </Wrapper>
      <InnerWrapper>
        <CodeViewWithControl
          targetid={props.node.id}
          disabled
          cachedOnly
          editor="prism"
          customMessages={["@oops this is not a component"]}
        />
      </InnerWrapper>
    </>
  );
}

const Wrapper = styled.div`
  background: #1e1e1e;
  color: #fff;
  padding: 16px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
`;

const Icon = styled.div`
  display: inline-block;
  margin-right: 8px;
`;

const Title = styled.h1`
  color: #c7c7c7;
  margin: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
`;

const Description = styled.h6`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #717171;
  margin: 8px 0;
`;

const CustomButton = styled.button`
  border: 0;
  outline: none;
  background: rgba(255, 255, 255, 0);
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  /* identical to box height */
  padding-left: 0;
  padding-right: 0;

  text-decoration-line: underline;

  color: #868686;
  cursor: pointer;

  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }
`;

const InnerWrapper = styled.div`
  white-space: pre;

  * {
    font-family: "Source Code Pro", "Courier New", "Lucida Console", Monaco;
  }

  // TEMP STYLE
  pre {
    padding: 0 16px;
  }
`;
