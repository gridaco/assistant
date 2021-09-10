import React, { useEffect, useState } from "react";
import { nodes, utils } from "@design-sdk/core";
import { ISingleLayerProperty, IProperties } from "../types";
import { PluginSdk } from "@plugin-sdk/app";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";
import { NameCases, nameit } from "@coli.codes/naming";
import { FigmaNumber } from "@design-sdk/figma/features/variant";
import { MappedPropertyStorage } from "../storage";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;
  const [properties, setProperties] = useState<ISingleLayerProperty[]>(null);

  const interfaceName = nameit(node.name + "-props", {
    case: NameCases.pascal,
  }).name;

  const storage = new MappedPropertyStorage(node.id);
  useEffect(() => {
    storage.getProperties().then((properties) => {
      setProperties(properties);
    });
  }, []);

  return (
    <>
      <PropsInterfaceView
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
      />
    </>
  );
}
