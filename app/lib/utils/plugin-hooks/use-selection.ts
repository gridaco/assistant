import { useEffect, useState } from "react";
import { IReflectNodeReference } from "@bridged.xyz/design-sdk/lib/nodes";
export enum SelectionType {
  "single", // updated with single selection
  "multi", // updated with multi selection
  "none", // nothing was selected - but not recognized as cancel (when it was none before)
  "cancel", // Deselection
}

interface SingleSelectionData {
  type: SelectionType.single;
  node: IReflectNodeReference;
  id: string;
}

interface MultiSelectionData {
  type: SelectionType.multi;
  nodes: IReflectNodeReference[];
}

interface NoneSelectionData {
  type: SelectionType.none;
}

type SelectionData =
  | SingleSelectionData
  | MultiSelectionData
  | NoneSelectionData;

export function useSelection(): SelectionData | undefined {
  const [selectednode, setselectednode] = useState<SelectionData>(undefined);

  useEffect(() => {
    function evl(ev) {
      const message = ev.data.pluginMessage;
      if (message?.type == "selectionchange") {
        const nodes = message.data;
        console.log("use-selection:nodes", nodes);

        handleSelectionChange(nodes);
      }
    }

    function handleSelectionChange(node) {
      if (Array.isArray(node)) {
        setselectednode({
          type: SelectionType.multi,
          nodes: node,
        });
      } else {
        if (node) {
          setselectednode({
            type: SelectionType.single,
            node: node,
            id: node.id,
          });
        } else {
          setselectednode({
            type: SelectionType.none,
          });
        }
      }
    }

    window.addEventListener("message", evl);

    return () => {
      window.removeEventListener("message", evl);
    };
  });

  return selectednode;
}

export function useSingleSelection(): SingleSelectionData | undefined {
  const [single, setSingle] = useState<SingleSelectionData>(null);
  const selection = useSelection();
  useEffect(() => {
    if (selection) {
      if (selection.type == SelectionType.single) {
        setSingle(selection);
      }
    }
  });

  return single;
}
