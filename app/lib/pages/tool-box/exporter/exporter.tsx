import React from "react";
import { FigmaExporter } from "./figma-exporter";
import { VanillaExporter } from "./vanilla-exporter";

export function ExporterScreen() {
  return (
    <>
      <FigmaExporter />
    </>
  );
  //   <VanillaExporter />;
}
