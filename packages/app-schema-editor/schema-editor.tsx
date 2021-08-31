import React, { useEffect, useState } from "react";
import { useSingleSelection } from "plugin-app";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/features/variant";
import { analyzeNode, SchemaDefinitionLike } from "./analyze-node";
import * as Modes from "./by-selection-state";

type EditerMode =
  | SchemaDefinitionLike
  // non is set, loading state
  | "no-selection";

export function SchemaEditor(props: {}) {
  const [mode, setMode] = useState<EditerMode>("no-selection");

  // use selection hook, then update the mode corresponding to selected layer on design tool
  const selection = useSingleSelection();

  useEffect(() => {
    if (selection) {
      const analysis = analyzeNode(selection?.node);
      setMode(analysis);
    } else {
      setMode("no-selection");
    }
  }, [selection]);

  const Body = () => {
    if (!selection || mode === "no-selection") {
      // Empty state
      return <Modes.NoSelection />;
    }
    switch (mode) {
      case "invalid-target":
        return <Modes.InvalidSelection />;
      case "single-layer-property":
        return <Modes.ConfigurableLayer node={selection.node} />;
      case "base-master-component":
        return <Modes.BaseMaster />;
      case "master-variant-compoent":
        return <Modes.VariantMaster />;
      case "master-variant-set":
        return <Modes.VariantSet />;
      case "master-variant-instance":
        return <Modes.VariantInstance />;
      case "master-component":
        return <Modes.MasterComponent node={selection.node} />;
      case "instance-component":
        return <Modes.InstanceComponent node={selection.node} />;
      default:
        throw `${mode} not handled`;
    }
  };

  return (
    <>
      <p>schema editor</p>
      <p>{selection?.node?.origin}</p>
      <Body />
    </>
  );
}
