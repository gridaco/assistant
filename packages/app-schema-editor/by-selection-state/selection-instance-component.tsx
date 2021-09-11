import React, { useEffect, useState } from "react";
import { nodes } from "@design-sdk/core";
import { ISingleLayerProperty } from "../types";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";
import { NameCases, nameit } from "@coli.codes/naming";
import { FigmaNumber } from "@design-sdk/figma/features/variant";
import { MappedPropertyStorage } from "../storage";
import { CodeBox } from "@ui/codebox";
import { buildeExampleDataDeclaration } from "../interface-code-builder";
import this_interface_builder from "./selection-instance-component.coli";
import {
  reactNamer,
  tsNamer,
} from "../interface-code-builder/scoped-property-id-namer";
import { stringfy } from "coli";
import { CodeStyleWrapper } from "./_shared-components";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const [properties, setProperties] = useState<ISingleLayerProperty[]>([]);

  const master = props.node.mainComponent;
  const interfaceName = nameit(master.name + "-props", {
    case: NameCases.pascal,
  }).name;

  const storage = new MappedPropertyStorage(master.id);
  useEffect(() => {
    storage.getProperties().then((properties) => {
      setProperties(properties);
    });
  }, []);

  const interface_code_coli = this_interface_builder({
    mainInterfaceName: interfaceName,
    properties: properties,
    propertyNamer: tsNamer(master.id),
  });
  const interface_code_string = stringfy(interface_code_coli, {
    language: "typescript",
  });

  const properties_as_data_map = properties.reduce(function (map, p) {
    map[p.schema.name] = p.schema.type;
    return map;
  }, {});

  return (
    <CodeStyleWrapper>
      <CodeBox language="typescript" code={interface_code_string} />
      {/* <PropsInterfaceView
        onInterfaceNameChange={() => {}}
        properties={
          properties?.map((i) => {
            return {
              key: i.schema.name,
              type: FigmaNumber, // FIXME: change this to - i.schema.type
              nullable: false, // TODO:
            };
          }) ?? []
        }
        initialInterfaceName={interfaceName}
        onChange={() => {}}
      /> */}
      <CodeBox
        language="jsx"
        code={buildeExampleDataDeclaration({
          name: "data",
          interfaceName: interfaceName,
          properties: properties_as_data_map,
        })}
      />
    </CodeStyleWrapper>
  );
}
