import React from "react";
import { nodes } from "@design-sdk/core";
import {
  FigmaNumber,
  FigmaVariantPropertyCompatType,
  VariantPropertyParser,
} from "@design-sdk/figma/features/variant";
import { CodeBox } from "@ui/codebox";
import {
  buildeExampleData,
  buildInterfaceString,
  jsxViewExampleBuilder,
} from "../interface-code-builder";
import { nameit, NameCases } from "@coli.codes/naming";
import {
  InterfaceAttr,
  InterfaceProps,
  InterfaceTypeOption,
} from "@code-ui/interface/dist/lib/type";
import { SelectionCodeUiInterface } from "./selectoin-code-ui-interface";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node;

  const parser = new VariantPropertyParser(master);
  const data_of_properties = parser.getData(master);
  const interfaceName = nameit(master.parent.name + "-props", {
    case: NameCases.pascal,
  }).name;

  const viewName = nameit(master.parent.name, {
    case: NameCases.pascal,
  }).name;

  return (
    <>
      <h6>variant</h6>

      <SelectionCodeUiInterface
        properties={parser.properties}
        interfaceName={interfaceName}
        onChange={() => {}}
      />
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
        code={jsxViewExampleBuilder({
          varName: "view",
          viewTag: viewName,
          typeReference: viewName,
          properties: data_of_properties,
        })}
      />
    </>
  );
}
