import React, { useEffect, useState } from "react";
import { nodes, utils } from "@design-sdk/core";
import { ISingleLayerProperty, IProperties } from "../types";
import { PluginSdk } from "@plugin-sdk/app";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;
  const [properties, setProperties] = useState<ISingleLayerProperty[]>(null);

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
      <h6>mater component</h6>
      <br />

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
