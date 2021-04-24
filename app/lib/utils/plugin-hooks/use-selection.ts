import { useEffect, useState } from "react";
import type { IReflectNodeReference } from "@bridged.xyz/design-sdk/lib/nodes/lignt";
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

/**
 * pair selection - this is multi selection with 2, explicitly requested by client
 */
interface _PairSelectionEvent {
  first: IReflectNodeReference;
  second: IReflectNodeReference;
  nodes: IReflectNodeReference[];
}

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

export function usePairSelection(): _PairSelectionEvent {
  const [pair, setPair] = useState<_PairSelectionEvent>(null);
  const selection = useSelection();
  useEffect(() => {
    if (selection) {
      if (selection.type == SelectionType.multi) {
        if (selection.nodes.length == 2) {
          setPair({
            first: selection.nodes[0],
            second: selection.nodes[1],
            nodes: selection.nodes,
          });
        }
      }
    }
  });
  return pair;
}

/**
 * len >= min
 * len < max
 * @param min
 * @param max
 * @returns
 */
export function useRangeSelection(min: number, max: number) {
  const [rangedSelections, setRangedSelections] = useState<MultiSelectionData>(
    null
  );
  const selection = useSelection();
  useEffect(() => {
    if (selection) {
      if (selection.type == SelectionType.multi) {
        if (selection.nodes.length >= min && selection.nodes.length < max) {
          setRangedSelections(selection);
        }
      }
    }
  });
  return rangedSelections;
}
