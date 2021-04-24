import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ASSISTANT_PLUGIN_NAMESPACE } from "../../constants";
import { useSingleSelection } from "../../utils/plugin-hooks";
import { PluginSdk } from "../../utils/plugin-provider/plugin-app-sdk";
import {
  SingleLayerPropertyDefinition,
  ISingleLayerProperty,
} from "./single-property";
import { ReflectSceneNodeType } from "@bridged.xyz/design-sdk/lib/nodes";
import { mapGrandchildren } from "@bridged.xyz/design-sdk/lib/utils";
import {
  extractTypeFromVariantNames_Figma,
  FimaVariantPropertyData,
  getVariantNamesSetFromReference_Figma,
} from "@bridged.xyz/design-sdk/lib/utils/variant";
import { IReflectNodeReference } from "@bridged.xyz/design-sdk/lib/nodes/lignt";

const ERROR_MESSAGES = {
  nothing_is_selected: "Nothing is selected",
  you_must_select_instance_or_component_type_of_node:
    "You must select instance or component type of node.",
};

type EditerMode =
  // single layer - no matter where it lives under a componennt or a raw group, etc.
  | "single-layer-property"
  // component set frame
  | "master-variant-set"
  // componennt with/without variant compat (can be used for both, but use it only for non variant component)
  | "master-component"
  // instance of simple or varianted component
  | "instance"
  // non is set, loading state
  | "loading";

export function SchemaEditor(props: {}) {
  const [mode, setMode] = useState<EditerMode>("loading");

  // use selection hook, then update the mode corresponding to selected layer on design tool

  const selection = useSingleSelection();

  useEffect(() => {
    if (selection) {
      if (
        selection?.node?.origin != ReflectSceneNodeType.component &&
        selection?.node?.origin != ReflectSceneNodeType.variant_set &&
        selection?.node?.origin != ReflectSceneNodeType.instance
      ) {
        setMode("single-layer-property");
      } else if (selection?.node?.origin == ReflectSceneNodeType.component) {
        setMode("master-component");
      } else if (selection?.node?.origin == ReflectSceneNodeType.variant_set) {
        setMode("master-variant-set");
      } else if (selection?.node?.origin == ReflectSceneNodeType.instance) {
        setMode("instance");
      }
    } else {
      setMode("loading");
    }
  }, [selection]);

  const Body = () => {
    if (!selection) {
      // Empty state
      return <_Mode_Empty />;
    }
    switch (mode) {
      case "loading":
        return <_Mode_Loading />;
      case "single-layer-property":
        return <_Mode_SingleLayerProperty node={selection.node} />;
      case "master-variant-set":
        return <_Mode_Variant_Set />;
      case "master-component":
        return <_Mode_Component node={selection.node} />;
      case "instance":
        return <_Mode_Instance node={selection.node} />;
      default:
        throw `${mode} not handled`;
    }
  };

  return (
    <>
      <p>schema editor</p>
      <Body />
    </>
  );
}

function _Mode_Empty() {
  return <>Nothing is selected</>;
}

function _Mode_Loading() {
  return <>loading..</>;
}

function _Mode_SingleLayerProperty(props: { node: IReflectNodeReference }) {
  const { node } = props;
  const id = node.id;

  const [data, setData] = useState<ISingleLayerProperty[]>([]);
  const handleOnSave = (d: ISingleLayerProperty) => {
    const newData = data;
    newData.push(d);
    setData(newData);

    // this update logic shall be applied to master node's corresponding layer
    PluginSdk.updateMetadata({
      id: id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE,
      key: "layer-property-data",
      value: data,
    });
  };

  useEffect(() => {
    PluginSdk.fetchMetadata({
      id: id,
      namespace: ASSISTANT_PLUGIN_NAMESPACE,
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

function _Mode_Variant_Set(props: {
  node?: IReflectNodeReference;
  defaultComponent?: IReflectNodeReference;
}) {
  // TODO
  return <p>select component inside variant set</p>;
}

function _Mode_Component(props: { node: IReflectNodeReference }) {
  const { node } = props;
  const [properties, setProperties] = useState<ISingleLayerProperty[]>(null);

  // 0. check if variant compat component (if it's parent is variant-set then it is.)
  const isVariantCompat =
    node.parentReference.origin == ReflectSceneNodeType.variant_set;

  // if variant, load default property set by variant namings.
  let variantProperties: FimaVariantPropertyData[];
  if (isVariantCompat) {
    const names = getVariantNamesSetFromReference_Figma(node);
    variantProperties = extractTypeFromVariantNames_Figma(names);
  }

  //1. list all layers under this component
  const grandchilds = mapGrandchildren(node);

  //2. extract schema from layers
  useEffect(() => {
    Promise.all(
      grandchilds.map((c) => {
        return PluginSdk.fetchMetadata_bridged<ISingleLayerProperty>(
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
          {variantProperties.map((n) => {
            return (
              <p>
                name:{n.name}, type:{n.type}
              </p>
            );
          })}
        </>
      ) : (
        <></>
      )}
      {/*  */}
      {properties ? (
        <>
          {properties.map((p) => {
            return <p>{JSON.stringify(p)}</p>;
          })}
        </>
      ) : (
        <>Loading..</>
      )}
    </>
  );
}

function _Mode_Instance(props: { node: IReflectNodeReference }) {
  return <></>;
}
