import React, { useEffect, useState } from "react";
import { useSingleSelection } from "plugin-app";
import { _FigmaVariantPropertyCompatType_to_string } from "@design-sdk/figma/dist/features/variant";
import {
  analyzeNode,
  SchemaDefinitionLike,
} from "@design-sdk/figma/dist/node-analysis";
import * as Modes from "./by-selection-state";

type EditerMode =
  | SchemaDefinitionLike
  // non is set, loading state
  | "no-selection";

export function SchemaEditor(props: {}) {
  // use selection hook, then update the mode corresponding to selected layer on design tool
  const selection = useSingleSelection();

  const mode = analyzeNode(selection?.node) ?? "no-selection";

  const Body = () => {
    if (!selection || mode === "no-selection") {
      // Empty state
      return <Modes.NoSelection />;
    }
    switch (mode) {
      case "invalid-target":
        return <Modes.InvalidSelection node={selection.node} />;
      case "single-layer-property":
        return <Modes.ConfigurableLayer node={selection.node} />;
      case "base-master-component":
        return <Modes.BaseMaster />;
      case "variant-set":
        return <Modes.VariantSet />;
      case "master-variant-compoent":
        return <Modes.VariantMaster node={selection.node} />;
      case "variant-instance":
        return <Modes.VariantInstance node={selection.node} />;
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
      <Body />
    </>
  );
}
