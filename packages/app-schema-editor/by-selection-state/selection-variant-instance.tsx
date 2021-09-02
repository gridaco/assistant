import React, { useState } from "react";
import { nodes } from "@design-sdk/core";
import {
  _FigmaVariantPropertyCompatType_to_string,
  VariantPropertyParser,
} from "@design-sdk/figma/features/variant";
import { CodeBox } from "@ui/codebox";
import {
  buildeExampleData,
  buildInterfaceString,
  jsxViewExampleBuilder,
} from "../interface-code-builder";
import { nameit, NameCases } from "@coli.codes/naming";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const _format_interface_pascal = (n) => {
    return nameit(n + "-props", {
      case: NameCases.pascal,
    }).name;
  };

  const [interfaceName, setInterfaceName] = useState(
    _format_interface_pascal(props.node.name)
  );

  const formattedInterfaceName = _format_interface_pascal(interfaceName);

  const master = props.node.mainComponent;
  const parser = new VariantPropertyParser(master);
  const data_of_properties = parser.getData(master);
  const interface_raw_code = buildInterfaceString({
    name: formattedInterfaceName,
    properties: parser.properties.map((d) => {
      return {
        name: d.key,
        type: d.type,
      };
    }),
  });
  const viewName = nameit(master.parent.name, {
    case: NameCases.pascal,
  }).name;
  // display available layer schema as this component's property

  return (
    <>
      <h6>instance of variant</h6>
      {/* TODO: add copy  - 1interface_raw_code1 */}
      <PropsInterfaceView
        onInterfaceNameChange={(n) => {
          setInterfaceName(n);
        }}
        properties={parser.properties}
        initialInterfaceName={interfaceName}
        onChange={() => {}}
      />

      <CodeBox
        language="jsx"
        code={buildeExampleData({
          name: "data",
          interfaceName: formattedInterfaceName,
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
