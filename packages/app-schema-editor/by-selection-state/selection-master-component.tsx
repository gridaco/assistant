import React, { useEffect, useState } from "react";
import { nodes, utils } from "@design-sdk/core";
import { ISingleLayerProperty, IProperties } from "../types";
import { PluginSdk } from "@plugin-sdk/app";
import { PropsInterfaceView } from "../interface-code-builder/props-interface-view";
import { NameCases, nameit } from "@coli.codes/naming";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;
  const [properties, setProperties] = useState<ISingleLayerProperty[]>(null);

  const interfaceName = nameit(node.name + "-props", {
    case: NameCases.pascal,
  }).name;

  //1. list all layers under this component
  const grandchilds = utils.mapGrandchildren(node);

  //2. extract schema from layers
  useEffect(() => {
    Promise.all(
      grandchilds.map((c) => {
        return PluginSdk.fetchMetadata_grida<ISingleLayerProperty>(
          c.id,
          "layer-property-data"
        );
      })
    ).then((res) => {
      const layersWithPropertyData = res.filter((i) => i !== undefined);
      setProperties(layersWithPropertyData);
    });
  }, []);

  return (
    <>
      <PropsInterfaceView
        onInterfaceNameChange={() => {}}
        properties={[]}
        initialInterfaceName={interfaceName}
        onChange={() => {}}
      />
      {/*  */}
      {properties ? (
        <ul>
          {properties.map((p) => {
            return <li>{JSON.stringify(p)}</li>;
          })}
        </ul>
      ) : (
        <>Loading..</>
      )}
    </>
  );
}
