import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { usePairSelection } from "../../../utils/plugin-hooks";
import { findDatasourceNodeAndOthers } from "./data-source-node";
import { fromApp } from "./events";

export function DataMapperScreen() {
  const pairSelection = usePairSelection();

  if (!pairSelection) {
    return <>two nodes must be selected</>;
  }

  // one of the selection must be data source and other must be target node.
  const __$ = findDatasourceNodeAndOthers(
    pairSelection.first,
    pairSelection.second
  );
  const datasourceNode = __$.datasource;
  const otherNode = __$.others[0];

  const handleMapDataToSelected = () => {
    fromApp({
      sourceNodeId: datasourceNode.id,
      targetNodeId: otherNode.id,
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

      {otherNode ? (
        <>target node is selected</>
      ) : (
        <>target node is not selected</>
      )}

      {datasourceNode && otherNode ? (
        <Button onClick={handleMapDataToSelected}>Map Data</Button>
      ) : (
        <></>
      )}
    </>
  );
}
