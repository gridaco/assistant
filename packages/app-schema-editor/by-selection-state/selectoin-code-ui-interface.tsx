import React from "react";
import { Interface } from "@code-ui/interface";
import {
  InterfaceAttr,
  InterfaceTypeOption,
  KindOfType,
} from "@code-ui/interface/dist/lib/type";

import {
  FigmaVariantPropertyCompatType,
  VariantProperty,
} from "@design-sdk/figma/features/variant";

const regxNumberType = /(number)/;
const regxBooleanType = /(boolean)/;

interface ISelectionCodeUiInterface {
  properties: VariantProperty[];
  interfaceName: string;
  onChange: () => void;
}

// only using for interface package!
export function typeToString(_data: FigmaVariantPropertyCompatType): any {
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

export function SelectionCodeUiInterface(props: ISelectionCodeUiInterface) {
  const interfaceAttrs: InterfaceAttr[] = props.properties.map((d) => {
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

  function interfaceHandle(field: string, value: string) {
    console.log(field);
    console.log(value);
  }

  return (
    <Interface
      lang={"js"}
      theme={"monokai"}
      interfaceName={props.interfaceName}
      attrs={interfaceAttrs}
      onChange={interfaceHandle}
    />
  );
}
