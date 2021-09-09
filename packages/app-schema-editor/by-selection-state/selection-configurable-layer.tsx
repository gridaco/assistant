import React, { useEffect, useState } from "react";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";
import { PluginSdk } from "@plugin-sdk/app";
import { SingleLayerPropertyDefinition } from "../single-property";
import { ISingleLayerProperty, IProperties } from "../types";
import { nodes } from "@design-sdk/core";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/features/variant";
import { nameit, NameCases } from "@coli.codes/naming";
import { CodeBox } from "@ui/codebox";
import { isMemberOfComponentLike } from "@design-sdk/figma/node-analysis/component-like-type-analysis/analyze";

type ConfigurableLayerContext =
  /**
   * frame with auto layout
   */
  | "frame-layouted"
  /**
   *
   */
  | "text"
  /**
   *
   */
  | "vector-colored"
  /**
   *
   */
  | "shape-with-image";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;
  const id = node.id;

  const [data, setData] = useState<IProperties>([]);
  const handleOnSave = (d: ISingleLayerProperty) => {
    const newData = data;
    newData.push(d);
    setData(newData);
    _update_all();
  };

  const manifest = isMemberOfComponentLike(node);

  if (manifest) {
    // with this, you can show root parent's info
    manifest.parent.type;
    manifest.parent.node;
  } else {
    throw "logical error.";
  }
  // TODO: layer analysis. configurable layer can be raw layyer or instance of a component (including variant isntance.)
  // << this is irrelevant comment to below code.

  const _update_all = () => {
    // this update logic shall be applied to master node's corresponding layer
    PluginSdk.updateMetadata({
      id: id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE,
      key: "layer-property-data",
      value: data,
    });
  };

  const handleOnRemove = (at: number) => {
    data.splice(at, at + 1);
    setData([...data]);
    _update_all();
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

  const _has_saved_data = data.length > 0;
  return (
    <>
      <CodeBox
        editor="prism"
        language="typescript"
        code={`/** parent’s interface */
interface Props {
  property_a : TYPE
  // properties of ${node.name}
  // -------------------------------

  // -------------------------------
}`}
      />

      {_has_saved_data ? (
        data.map((d, i) => (
          <SingleLayerPropertyDefinition
            onRemove={() => {
              handleOnRemove(i);
            }}
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
              name: nameit(node.name, { case: NameCases.camel }).name,
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
