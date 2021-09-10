import React, { useEffect, useState } from "react";
import { nodes } from "@design-sdk/core";
import { ISingleLayerProperty } from "../types";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";
import { NameCases, nameit } from "@coli.codes/naming";
import { FigmaNumber } from "@design-sdk/figma/features/variant";
import { MappedPropertyStorage } from "../storage";
import { CodeBox } from "@ui/codebox";
import { buildeExampleData } from "../interface-code-builder";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const [properties, setProperties] = useState<ISingleLayerProperty[]>(null);

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
      <CodeBox
        language="jsx"
        code={buildeExampleData({
          name: "data",
          interfaceName: interfaceName,
          properties: {},
        })}
      />
    </>
  );
}
