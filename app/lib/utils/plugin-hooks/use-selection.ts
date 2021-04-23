import { useEffect, useState } from "react";
import { SceneNode } from "@bridged.xyz/design-sdk/lib/figma/types/v1";
export enum SelectionType {
  "single", // updated with single selection
  "multi", // updated with multi selection
  "none", // nothing was selected - but not recognized as cancel (when it was none before)
  "cancel", // Deselection
}

interface SingleSelectionData {
  type: SelectionType.single;
  node: SceneNode;
  id: string;
}

interface MultiSelectionData {
  type: SelectionType.multi;
  nodes: SceneNode[];
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
        const node = message.data;
        handleSelectionChange(node);
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
            //@ts-ignore
            type: SelectionType.single,
            nodes: node,
            id: node.id,
          });
        } else {
          setselectednode({
            //@ts-ignore
            type: SelectionType.none,
            nodes: [],
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
