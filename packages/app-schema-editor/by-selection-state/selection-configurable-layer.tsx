import React, { useEffect, useState } from "react";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";
import { PluginSdk } from "@plugin-sdk/app";
import { SingleLayerPropertyDefinition } from "../single-property";
import { ISingleLayerProperty, IProperties } from "../types";
import { nodes } from "@design-sdk/core";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/features/variant";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;
  const id = node.id;

  const [data, setData] = useState<IProperties>([]);
  const handleOnSave = (d: ISingleLayerProperty) => {
    const newData = data;
    newData.push(d);
    setData(newData);

    // this update logic shall be applied to master node's corresponding layer
    PluginSdk.updateMetadata({
      id: id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
      key: "layer-property-data",
      value: data,
    });
  };

  useEffect(() => {
    PluginSdk.fetchMetadata({
      id: id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
      key: "layer-property-data",
    }).then((d) => {
      if (d) {
        setData(d);
      }
    });
  }, []);

  return (
    <>
      {data.length > 0 ? (
        data.map((d) => (
          <SingleLayerPropertyDefinition
            key={d?.schema.name}
            onSave={handleOnSave}
            initial={d}
          />
        ))
      ) : (
        //   automatically preset a new property
        <SingleLayerPropertyDefinition
          key={"new"}
          initialMode={"editing"}
          onSave={handleOnSave}
          initial={{
            schema: {
              name: `${node.name}`,
              type: "string",
            },
            targetProperty: undefined,
            locateMode: "auto",
          }}
        />
      )}
    </>
  );
}
