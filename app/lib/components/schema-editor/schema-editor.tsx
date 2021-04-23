import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  SingleLayerPropertyDefinition,
  ISingleLayerProperty,
} from "./single-property";

const ERROR_MESSAGES = {
  nothing_is_selected: "Nothing is selected",
  you_must_select_instance_or_component_type_of_node:
    "You must select instance or component type of node.",
};

type EditerMode = "single-layer-property" | "variant-component" | "loading";

export function SchemaEditor(props: {}) {
  const [mode, setMode] = useState<EditerMode>("loading");

  // use selection hook, then update the mode corresponding to selected layer on design tool

  useEffect(() => {
    // initially set mode
    // DEV
    setMode("single-layer-property");
  });

  const handleOnSave = (d: ISingleLayerProperty) => {
    // todo
  };

  const Body = () => {
    switch (mode) {
      case "loading":
        return <>loading..</>;
      case "single-layer-property":
        return <SingleLayerPropertyDefinition onSave={handleOnSave} />;
      case "variant-component":
        return <>loading..</>;
    }
  };

  return (
    <>
      <p>schema editor</p>
      <Body />
    </>
  );
}
