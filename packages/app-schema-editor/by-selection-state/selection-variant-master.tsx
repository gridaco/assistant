import React from "react";
import { nodes, utils } from "@design-sdk/core";
import { VariantPropertyParser } from "@design-sdk/figma/features/variant";
import { CodeBox } from "@ui/codebox";
import { buildInterfaceString } from "../interface-code-builder";
import { nameit, NameCases } from "@coli.codes/naming";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node;

  const parser = new VariantPropertyParser(master);
  const data_of_properties = parser.getData(master);

  return (
    <>
      <h6>variant</h6>
      <CodeBox
        language="jsx"
        code={buildInterfaceString({
          name: nameit(master.parent.name + "-props", {
            case: NameCases.pascal,
          }).name,
          properties: parser.properties.map((d) => {
            return {
              name: d.key,
              type: d.type,
            };
          }),
        })}
      />
      <CodeBox
        language="jsx"
        code={`const data = ${JSON.stringify(data_of_properties, null, 2)}`}
      />

      <CodeBox
        language="jsx"
        code={`const View = <${
          nameit(master.parent.name, {
            case: NameCases.pascal,
          }).name
        } {...data}/>`}
      />
    </>
  );
}
