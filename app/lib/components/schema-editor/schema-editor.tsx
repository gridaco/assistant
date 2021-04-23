import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { ASSISTANT_PLUGIN_NAMESPACE } from "../../constants";
import { PluginSdk } from "../../utils/plugin-provider/plugin-app-sdk";
import {
  SingleLayerPropertyDefinition,
  ISingleLayerProperty,
} from "./single-property";

const ERROR_MESSAGES = {
  nothing_is_selected: "Nothing is selected",
  you_must_select_instance_or_component_type_of_node:
    "You must select instance or component type of node.",
};

type EditerMode =
  // single layer - no matter where it lives under a componennt or a raw group, etc.
  | "single-layer-property"
  // component with variant compat
  | "master-variant-component"
  // componennt with/without variant compat (can be used for both, but use it only for non variant component)
  | "master-component"
  // instance of simple or varianted component
  | "instance"
  // non is set, loading state
  | "loading";

export function SchemaEditor(props: {}) {
  const [mode, setMode] = useState<EditerMode>("loading");

  // use selection hook, then update the mode corresponding to selected layer on design tool
  const selection = "1"; // TODO useSelection

  useEffect(() => {
    // initially set mode
    // DEV
    setMode("single-layer-property");
  });

  const Body = () => {
    if (!selection) {
      // Empty state
      return <_Mode_Empty />;
    }
    switch (mode) {
      case "loading":
        return <_Mode_Loading />;
      case "single-layer-property":
        return <_Mode_SingleLayerProperty />;
      case "master-variant-component":
        return <>loading..</>;
      case "master-component":
        return <_Mode_Variant_Component />;
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

function _Mode_SingleLayerProperty() {
  const [data, setData] = useState<any[]>([]);
  const handleOnSave = (d: ISingleLayerProperty) => {
    // todo
  };

  PluginSdk.fetchMainComponentMetadata({
    id: nodeId,
    namespace: ASSISTANT_PLUGIN_NAMESPACE,
    key: "layer-property-data",
  }).then((d) => {
    setData(d);
  });

  PluginSdk.updateMainComponentMetadata({
    id: selectednode,
    namespace: ASSISTANT_PLUGIN_NAMESPACE,
    key: "component-meta-data",
    value: newData,
  });

  return <SingleLayerPropertyDefinition onSave={handleOnSave} />;
}

function _Mode_Variant_Component() {
  return <p>variant component mode</p>;
}

function _Mode_Component() {}
