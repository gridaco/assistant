import React from "react";
import { nodes, utils } from "@design-sdk/core";
import { variant } from "@design-sdk/figma/features";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/features/variant";
import { CodeBox } from "@ui/codebox";
import { buildInterfaceString } from "../interface-code-builder";

export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const master = props.node.mainComponent;

  // 0. check if variant compat component (if it's parent is variant-set then it is.)
  // load default property set by variant namings.
  const names = variant.getVariantNamesSetFromReference_Figma(master);
  const variantProperties: variant.VariantProperty[] =
    variant.extractTypeFromVariantNames_Figma(names);

  // display available layer schema as this component's property
  return (
    <>
      <h6>instance of variant</h6>
      <CodeBox
        language="jsx"
        code={buildInterfaceString({
          name: "Props",
          properties: variantProperties.map((d) => {
            return {
              name: d.key,
              type: d.type,
            };
          }),
        })}
      />
    </>
  );
}
