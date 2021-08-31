import React, { useEffect, useState } from "react";
import { nodes, utils } from "@design-sdk/core";
import { variant } from "@design-sdk/figma/features";
import { ISingleLayerProperty, IProperties } from "../types";
import { PluginSdk } from "@plugin-sdk/app";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/features/variant";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;
  const [properties, setProperties] = useState<ISingleLayerProperty[]>(null);

  // 0. check if variant compat component (if it's parent is variant-set then it is.)
  const isVariantCompat =
    node.parentReference.origin == nodes.ReflectSceneNodeType.variant_set;

  // if variant, load default property set by variant namings.
  let variantProperties: variant.VariantProperty[];
  if (isVariantCompat) {
    const names = variant.getVariantNamesSetFromReference_Figma(node);
    variantProperties = variant.extractTypeFromVariantNames_Figma(names);
  }

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

  //3. display available layer schema as this component's property

  return (
    <>
      <h6>Properties</h6>
      {/*  */}
      {variantProperties ? (
        <>
          <h6>variant properties</h6>
          <ul>
            {variantProperties.map((n) => {
              return (
                <li>
                  name:{n.key}, type:
                  {`${_FigmaVariantPropertyCompatType_to_string(n.type)}`}
                </li>
              );
            })}
          </ul>
          <h6>data</h6>
        </>
      ) : (
        <></>
      )}
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
