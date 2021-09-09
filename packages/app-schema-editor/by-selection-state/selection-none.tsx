import React from "react";
import { Docstring } from "@code-ui/docstring";
import { CodeBox } from "@ui/codebox";
import styled from "@emotion/styled";

export default function () {
  return (
    <>
      <div style={{ backgroundColor: "#1e1e1e", padding: 16 }}>
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
      </div>
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
    />
  );
}

const DisabledOverlay = styled.div`
  /* TODO: add overlay color */
  /* color: #8c1d1d1d; */
`;
