import React, { useEffect, useState } from "react";
import { ASSISTANT_PLUGIN_NAMESPACE__NOCHANGE } from "@core/constant";
import { SingleLayerPropertyDefinition } from "../single-property";
import { ISingleLayerProperty, IProperties } from "../types";
import { nodes } from "@design-sdk/core";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/features/variant";
import { nameit, NameCases } from "@coli.codes/naming";
import { CodeBox } from "@ui/codebox";
import { isMemberOfComponentLike } from "@design-sdk/figma/node-analysis/component-like-type-analysis/analyze";
import { get_suggestions } from "../property-suggestions";
import { MappedPropertyStorage } from "../storage";
import { IReflectNodeReference } from "@design-sdk/core/nodes/lignt";
export default function (props: { node: nodes.light.IReflectNodeReference }) {
  const { node } = props;

  const [data, setData] = useState<IProperties>([]);
  const handleOnSave = (d: ISingleLayerProperty) => {
    const newData = data;
    newData.push(d);
    setData([...newData]);
    _sync_data_with_storage();
  };

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

  // TODO: layer analysis. configurable layer can be raw layyer or instance of a component (including variant isntance.)
  // << this is irrelevant comment to below code.

  const _sync_data_with_storage = () => {
    // this update logic shall be applied to master node's corresponding layer
    storage.sync(data);
  };

  const handleOnRemove = (at: number) => {
    data.splice(at, at + 1);
    setData([...data]);
    _sync_data_with_storage();
  };

  useEffect(() => {
    storage.getProperties().then((d) => {
      if (d) {
        setData(d);
      }
    });
  }, []);

  const all_suggestions = get_suggestions(node);
  const suggestions = Array.isArray(all_suggestions)
    ? all_suggestions
    : (all_suggestions && [all_suggestions]) || [];

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

      <div key={data?.length ?? ""}>
        {_has_saved_data ? (
          <>
            {data.map((d, i) => (
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
            <button>add new</button>
          </>
        ) : (
          // automatically preset a new property
          <SingleLayerPropertyDefinition
            initialMode={"editing"}
            onSave={handleOnSave}
            initial={{
              schema: {
                name: nameit(node.name, { case: NameCases.camel }).name,
                type: "string",
              },
              layer: {
                id: main_component_sibling_layer.id,
                propertyType: undefined,
                location: "auto",
              },
            }}
            suggestions={suggestions}
          />
        )}
      </div>
    </>
  );
}

/**
 * relative path of current node. (not main component)
 * e.g. 0/1
 * ```
 * instance
 *   - layer
 *     - layer
 *     - THIS
 *   - layer
 * ```
 */
function getRelativeIndexPath(
  root: IReflectNodeReference,
  target: IReflectNodeReference
) {
  const paths = [];
  while (target) {
    if (target.id === root.id) {
      break;
    }
    paths.push(target.parent.children.findIndex((c) => c.id === target.id));
    target = target.parent;
  }

  return paths.reverse().join("/");
}

function findWithRelativeIndexPath(
  root: IReflectNodeReference,
  indexPath: string | number[]
): IReflectNodeReference {
  if (typeof indexPath === "string") {
    indexPath = indexPath.split("/").map(Number);
  }

  let children = root.children;
  let i = 0;
  for (const at of indexPath) {
    if (i === indexPath.length - 1) {
      return children[at];
    }
    children = children[at].children;
    i++;
  }
}
