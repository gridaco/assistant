import React from "react";
import { CodeViewWithControl } from "@app/design-to-code/code-view-with-control";
import { nodes } from "@design-sdk/core";
import styled from "@emotion/styled";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  function mdiWarning() {
    return (
      <Svg
        width="16"
        height="13"
        viewBox="0 0 16 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.666748 13H15.3334L8.00008 0.333374L0.666748 13ZM8.66675 11H7.33341V9.66671H8.66675V11ZM8.66675 8.33337H7.33341V5.66671H8.66675V8.33337Z"
          fill="#C7C7C7"
        />
      </Svg>
    );
  }

  return (
    <>
      <Wrapper>
        <Title>
          {mdiWarning()}
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
      <CodeViewWithControl
        targetid={props.node.id}
        disabled
        editor="prism"
        customMessages={["@oops this is not a component"]}
      />
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

const Svg = styled.svg`
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
