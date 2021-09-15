import React from "react";
import { Docstring } from "@code-ui/docstring";
import { CodeBox } from "@ui/codebox";
import styled from "@emotion/styled";

export default function () {
  return (
    <>
      <Wrapper>
        <Docstring
          controls={[
            { name: "Select a component from figma" },
            {
              name:
                "Click one of master component / instance / variant or layer under listed kinds.",
            },
            {
              tag: "@",
              name: "lang",
              template: "{{tag}}{{name}} {{lang.value}}",
              options: [
                { name: "ts", value: "typescript" },
                { name: "dart", value: "dart" },
              ],
            },
          ]}
          expandableConfig={undefined}
          onChange={function (field: string, value: any): void {
            throw new Error("Function not implemented.");
          }}
        />
        <DisabledOverlay>
          <DummyInterfacePreview />
        </DisabledOverlay>
      </Wrapper>
    </>
  );
}

const __placeholder_dummy_interface_code =
  //
  `interface ComponentProps {
  property1: type;
  property2: type;
  property3: type;
}
`;

function DummyInterfacePreview() {
  return (
    <CodeBox
      editor="prism"
      code={__placeholder_dummy_interface_code}
      language={"typescript"}
      disabled={true}
    />
  );
}

const Wrapper = styled.div`
  /* 366px is preview(200) + navigation(52+40) + padding 16*2 height*/
  height: calc(100vh - 324px);
  font-family: "Source Code Pro", "Courier New", "Lucida Console", Monaco;
  background: #1e1e1e;
  padding: 16px;
  overflow-x: auto;

  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #717171;
  white-space: pre;

  .token {
    font-size: 14px;
    line-height: 98%;
    font-weight: 400;
  }

  * {
    font-family: "Source Code Pro", "Courier New", "Lucida Console", Monaco;
    overflow: visible;
  }

  -ms-overflow-style: none; // IE에서 스크롤바 감춤
  &::-webkit-scrollbar {
    display: none !important; // 윈도우 크롬 등
  }
`;

const DisabledOverlay = styled.div`
  margin-top: 25px;
`;
