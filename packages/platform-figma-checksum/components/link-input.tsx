import React from "react";
import styled from "@emotion/styled";

export function LinkInput() {
  return (
    <RootWrapperInput>
      <Placeholder>
        https://www.figma.com/file/a98bc76d/assistant?node-id=1234%3A5678
      </Placeholder>
    </RootWrapperInput>
  );
}

const RootWrapperInput = styled.div`
  width: 349px;
  height: 52px;
  min-height: 100vh;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 4px;
  position: relative;
  box-shadow: 0px 4px 16px rgba(176, 176, 176, 0.12);
  align-self: stretch;
`;

const Placeholder = styled.span`
  color: rgba(232, 232, 232, 1);
  text-overflow: ellipsis;
  font-size: 14px;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 400;
  text-align: left;
  position: absolute;
  left: 13px;
  top: 18px;
`;
