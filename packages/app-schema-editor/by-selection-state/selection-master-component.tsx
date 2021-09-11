import React, { useEffect, useState } from "react";
import { nodes, utils } from "@design-sdk/core";
import { ISingleLayerProperty, IProperties } from "../types";
import { PluginSdk } from "@plugin-sdk/app";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";
import { NameCases, nameit } from "@coli.codes/naming";
import { FigmaNumber } from "@design-sdk/figma/features/variant";
import { MappedPropertyStorage } from "../storage";
import { CodeBox } from "@ui/codebox";
import this_interface_builder from "./selection-master-component.coli";
import { reactNamer } from "../interface-code-builder/scoped-property-id-namer";
import { stringfy } from "coli";
import { CodeStyleWrapper } from "./_shared-components";
export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;
  const [mappedProperties, setMappedProperties] = useState<
    ISingleLayerProperty[]
  >([]);

  const interfaceName = nameit(node.name + "-props", {
    case: NameCases.pascal,
  }).name;

  const storage = new MappedPropertyStorage(node.id);
  useEffect(() => {
    storage.getProperties().then((properties) => {
      setMappedProperties(properties);
    });
  }, []);

  const interface_code_coli = this_interface_builder({
    mainInterfaceName: interfaceName,
    properties: mappedProperties,
    propertyNamer: reactNamer(node.id),
  });
  const interface_code_string = stringfy(interface_code_coli, {
    language: "typescript",
  });

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
    </CodeStyleWrapper>
  );
}
