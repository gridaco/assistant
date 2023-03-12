import React, { useEffect, useState } from "react";
import { SingleLayerPropertyDefinition } from "../components/single-property";
import { ISingleLayerProperty, IProperties } from "../types";
import * as nodes from "@design-sdk/figma-node";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/dist/features/variant";
import { nameit, NameCases } from "@coli.codes/naming";
import { CodeBox } from "@ui/codebox";
import { isMemberOfComponentLike } from "@design-sdk/figma/dist/node-analysis/component-like-type-analysis/analyze";
import { get_suggestions } from "../property-suggestions";
import { MappedPropertyStorage } from "../storage";
import {
  findWithRelativeIndexPath,
  getRelativeIndexPath,
} from "@design-sdk/figma-xpath";
import { stringfy } from "coli";
import this_interface_builder from "./selection-configurable-layer.coli";
import { tsNamer } from "../interface-code-builder/scoped-property-id-namer";
import { CodeStyleWrapper } from "./_shared-components";
import { ISingleLayerPropertyMapping } from "../types/single-layer-property-type";
import styled from "@emotion/styled";

export default function (props: { node: nodes.IReflectNodeReference }) {
  const { node } = props;

  const [localProperties, setLocalProperties] = useState<IProperties>([]);
  const [parentProperties, setParentProperties] = useState<IProperties>([]);
  const [editingProperties, setEditingProperties] = useState<IProperties>([]);
  const manifest = isMemberOfComponentLike(node);
  if (manifest) {
    // with this, you can show root parent's info
    manifest.parent.type;
    manifest.parent.node;
  } else {
    throw "logical error.";
  }

  const this_root = manifest.parent.node;
  const this_relative_index_path = getRelativeIndexPath(
    manifest.parent.node,
    node
  );

  const mainComponent = this_root.mainComponent || this_root;
  const id = mainComponent.id;

  const main_component_sibling_layer = findWithRelativeIndexPath(
    mainComponent,
    this_relative_index_path
  );

  const storage = new MappedPropertyStorage(id);

  const handleOnSave = (d: ISingleLayerProperty) => {
    console.log("on save", d);
    storage
      .upsertLayerProperty({
        layerId: d.layer.id,
        name: d.schema.name,
        type: d.schema.type,
        accessor: d.layer.propertyType,
      })
      .then(() => {
        refreshThisPropertiesList();
      });
  };

  // TODO: layer analysis. configurable layer can be raw layyer or instance of a component (including variant isntance.)
  // << this is irrelevant comment to below code.

  const handleOnRemove = (at: number) => {
    storage.remove(localProperties[at].id);
    refreshThisPropertiesList();
  };

  const empty_placeholder: ISingleLayerPropertyMapping = {
    schema: {
      name: nameit(node.name, { case: NameCases.camel }).name,
      type: "string",
    },
    layer: {
      id: main_component_sibling_layer.id,
      propertyType: undefined,
      location: "auto",
    },
  };

  const initiallyLoadThisPropertiesList = async () => {
    const d = await refreshThisPropertiesList();
    if (d?.length === 0) {
      setEditingProperties([empty_placeholder]);
    }
  };

  const handle_add_new_field = () => {
    setEditingProperties([...editingProperties, empty_placeholder]);
  };

  const handle_cancel_new_field = () => {
    editingProperties.pop();
    setEditingProperties([...editingProperties]);
  };

  const refreshThisPropertiesList = async () => {
    const d = await storage.getPropertiesOf(main_component_sibling_layer.id);
    if (d?.length > 0) {
      setLocalProperties(d);
    }
    return d;
  };

  useEffect(() => {
    // load list for the first time.
    initiallyLoadThisPropertiesList();
    storage
      .getPropertiesExcept(main_component_sibling_layer.id)
      .then(setParentProperties);
  }, []);

  const all_suggestions = get_suggestions(node);
  const suggestions = Array.isArray(all_suggestions)
    ? all_suggestions
    : (all_suggestions && [all_suggestions]) || [];

  const final_code = stringfy(
    this_interface_builder({
      root: mainComponent,
      rootInterfaceName: mainComponent.name, // TODO: pass built name
      rootProperties: parentProperties,
      propertyNamer: tsNamer(mainComponent.id),
      layerProperties: localProperties,
      layer: node,
    }),
    {
      language: "typescript",
    }
  );

  const _has_saved_data = localProperties.length > 0;
  const _is_editing_data = editingProperties.length > 0;
  return (
    <CodeStyleWrapper>
      <CodeBox editor="prism" language="typescript" code={final_code} />

      <div key={localProperties?.length ?? ""}>
        {_has_saved_data && (
          <>
            {localProperties.map((d, i) => (
              <SingleLayerPropertyDefinition
                onRemove={() => {
                  handleOnRemove(i);
                }}
                key={d?.schema.name}
                onSave={handleOnSave}
                initial={d}
                suggestions={suggestions}
              />
            ))}
          </>
        )}
        {_is_editing_data && ( // automatically preset a new property
          <>
            {editingProperties.map((d, i) => (
              <SingleLayerPropertyDefinition
                initialMode={"editing"}
                onSave={handleOnSave}
                onCancel={handle_cancel_new_field}
                initial={d}
                suggestions={suggestions}
              />
            ))}
          </>
        )}
        <OptionalBtn onClick={handle_add_new_field}>add new</OptionalBtn>
      </div>
    </CodeStyleWrapper>
  );
}
const OptionalBtn = styled.button`
  text-decoration: underline;
  outline: none;
  background: transparent;
  color: #868686;
  border: none;
  cursor: pointer;
  align-items: center;
`;
