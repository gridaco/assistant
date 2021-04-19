import Divider from "@material-ui/core/Divider";
import React, { useState } from "react";

export function ComponentizerScreen() {
  const [selectionCount, setSelectionCount] = useState<number>(0);
  // PluginSdk.selectedNodes
  return (
    <>
      <h3>componentizer</h3>
      <p>
        This creates batch components from selection. this operation might be
        expenive, if there are lots of set to convert to component (500+), we
        recommand you to run this operation as in limited number with multiple
        entries
      </p>
      <Divider />
      {selectionCount == 0 ? (
        <p>
          👉 nothing is selected. (select layers to convert as individual
          component)
        </p>
      ) : (
        <>
          <p>selection(s): {selectionCount}</p>
          <button>convert {selectionCount} node(s) as component</button>
        </>
      )}
    </>
  );
}
