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
import { Interface } from "@code-ui/interface";
import {
  InterfaceAttr,
  InterfaceProps,
  InterfaceTypeOption,
} from "@code-ui/interface/dist/lib/type";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node;
  const regxNumberType = /(number)/;
  const regxBooleanType = /(boolean)/;

  const parser = new VariantPropertyParser(master);
  const data_of_properties = parser.getData(master);
  const interfaceName = nameit(master.parent.name + "-props", {
    case: NameCases.pascal,
  }).name;

  function typeToString(_data: FigmaVariantPropertyCompatType): any {
    if (typeof _data === "symbol") {
      const isNumberType = regxNumberType.test(_data.toString());
      const isBooleanType = regxBooleanType.test(_data.toString());

      if (isNumberType) {
        return "number";
      } else if (isBooleanType) {
        // will be change to boolean
        // it just for interface package typo missing
        return "bool";
      }
    } else if (_data.type) {
      return _data.type;
    } else {
      return "any";
    }
  }

  const interfaceAttrs: InterfaceAttr[] = parser.properties.map((d) => {
    const attrTypes = typeToString(d.type);
    const _contorl: InterfaceTypeOption = {
      name: attrTypes,
      value: attrTypes,
      description: `type is ${attrTypes}`,
    };
    return {
      label: d.key,
      contorls: [_contorl],
    };
  });
  const viewName = nameit(master.parent.name, {
    case: NameCases.pascal,
  }).name;

  return (
    <>
      <h6>variant</h6>

      <Interface
        lang={"js"}
        theme={"monokai"}
        interfaceName={interfaceName}
        attrs={interfaceAttrs}
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
