import React from "react";
import { nodes } from "@design-sdk/core";
import { VariantPropertyParser } from "@design-sdk/figma/features/variant";
import { CodeBox } from "@ui/codebox";
import {
  buildeExampleData,
  buildInterfaceString,
} from "../interface-code-builder";
import { nameit, NameCases } from "@coli.codes/naming";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node;

  const parser = new VariantPropertyParser(master);
  const data_of_properties = parser.getData(master);
  const interfaceName = nameit(master.parent.name + "-props", {
    case: NameCases.pascal,
  }).name;
  return (
    <>
      <h6>variant</h6>
      <CodeBox
        language="jsx"
        code={buildInterfaceString({
          name: interfaceName,
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
        code={buildeExampleData({
          name: "data",
          interfaceName: interfaceName,
          properties: data_of_properties,
        })}
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
