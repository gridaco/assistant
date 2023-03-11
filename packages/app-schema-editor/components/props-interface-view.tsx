import React, { useState } from "react";
import { Interface as InterfaceView } from "@code-ui/interface";
import {
  InterfaceAttr,
  InterfaceTypeOption,
  KindOfType,
} from "@code-ui/interface/dist/lib/type";
import { nameit, NameCases } from "@coli.codes/naming";

import {
  FigmaVariantPropertyCompatType,
  VariantProperty,
} from "@design-sdk/figma/dist/features/variant";

const regxNumberType = /(number)/;
const regxBooleanType = /(boolean)/;

interface ISelectionCodeUiInterface {
  properties: VariantProperty[];
  initialInterfaceName: string;
  onChange: () => void;
  onInterfaceNameChange: (n: string) => void;
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

export function PropsInterfaceView(props: ISelectionCodeUiInterface) {
  const [interfaceName, setInterfaceName] = useState(
    props.initialInterfaceName
  );
  const interfaceAttrs: InterfaceAttr[] = props.properties.map((d) => {
    const attrTypes = typeToString(d.type);
    const _contorl: InterfaceTypeOption = {
      name: attrTypes,
      value: attrTypes,
      description: `type is ${attrTypes}`,
    };
    return {
      label: nameit(d.key, {
        case: NameCases.camel,
      }).name,
      contorls: [_contorl],
    };
  });

  function onchange(field: string, value: string) {
    if (field == "interfaceName") {
      setInterfaceName(value);
      props.onInterfaceNameChange(value);
    }
  }

  return (
    <InterfaceView
      lang={"js"}
      theme={"monokai"}
      interfaceName={interfaceName}
      attrs={interfaceAttrs}
      onChange={onchange}
    />
  );
}
