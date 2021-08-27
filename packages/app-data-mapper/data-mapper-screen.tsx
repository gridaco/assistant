import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { useRangeSelection } from "plugin-app";
import { findDatasourceNodeAndOthers } from "./data-source-node";
import { fromApp } from "./__plugin/events";

export function DataMapperScreen() {
  const pairSelections = useRangeSelection(2, 5);

  if (!pairSelections) {
    return <>more than two nodes must be selected with data source included</>;
  }

  // one of the selection must be data source and other must be target node.
  const __$ = findDatasourceNodeAndOthers(...pairSelections.nodes);
  const datasourceNode = __$.datasource;
  const otherNodes = __$.others;

  const handleMapDataToSelected = () => {
    fromApp({
      sourceNodeId: datasourceNode.id,
      targetNodesId: otherNodes.map((n) => n.id),
    });
  };

  return (
    <>
      <h3>data mapper</h3>
      <p>
        select one datasource and other to target. only pair selection is
        allowed to use this feature
      </p>

      {datasourceNode ? (
        <>data source is selected</>
      ) : (
        <>data source is not selected</>
      )}

      {otherNodes ? (
        <>target node is selected</>
      ) : (
        <>target node is not selected</>
      )}

      {datasourceNode && otherNodes ? (
        <Button onClick={handleMapDataToSelected}>Map Data</Button>
      ) : (
        <></>
      )}
    </>
  );
}
