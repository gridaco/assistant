import { useEffect, useState } from "react";
import {
  IReflectNodeReference,
  ReflectSceneNodeType,
} from "@design-sdk/figma-node";
import { detectIf } from "@reflect-ui/detection";

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
          if (
            // do not trigger selection change when same node is selected.
            // to trigger selection change on same node, user should unselect and select again.
            selectednode &&
            selectednode.type == SelectionType.single &&
            node.id == selectednode.id
          ) {
            return;
          }
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

    // add event listener for future user interaction
    window.addEventListener("message", evl);

    return () => {
      window.removeEventListener("message", evl);
    };
  });

  useEffect(() => {
    // trigger once to get current selection if possible.
    parent.postMessage(
      {
        pluginMessage: {
          type: "trigger-selectionchange",
        },
      },
      "*"
    );
  }, []);

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

type ScaffoldMetaNodeType =
  | "unknown"
  | "screen"
  | "frame"
  | "text"
  | "shape"
  | "image"
  | "component-like"
  | "vector"
  | "group";
interface SelectionNodeMeta {
  meta: {
    type: ScaffoldMetaNodeType;
  };
  type: SelectionType.single;
  node: IReflectNodeReference;
  id: string;
}

/** Advanced version of use-single-selection */
export function useSingleSelectionWithMeta() {
  const selection = useSingleSelection();
  const { node } = selection;

  let type_in_meta: ScaffoldMetaNodeType = _reflect_scene_node_type__to__scaffold_meta_node_type(
    node
  );

  return <SelectionNodeMeta>{
    meta: { type: type_in_meta },
    ...selection,
  };
}

function _reflect_scene_node_type__to__scaffold_meta_node_type(
  node: IReflectNodeReference
): ScaffoldMetaNodeType {
  switch (node.type) {
    case ReflectSceneNodeType.text:
      return "text";
    //
    case ReflectSceneNodeType.line:
    case ReflectSceneNodeType.ellipse:
    case ReflectSceneNodeType.rectangle:
      return "shape";
    case ReflectSceneNodeType.vector:
      return "vector";
    //
    case ReflectSceneNodeType.image:
      return "image";
    //
    case ReflectSceneNodeType.component:
    case ReflectSceneNodeType.instance:
      return "component-like";
    case ReflectSceneNodeType.frame:
      const _detection_result_if_screen = detectIf.screen(node as any)
        .result; /** TODO: remove `as any` */

      if (_detection_result_if_screen) {
        return "screen";
        //
      } else {
        return "frame";
      }

    case ReflectSceneNodeType.group:
      return "group";
    //
    case ReflectSceneNodeType.unknown:
      return "unknown";
    default:
      return "unknown";
    //
  }
}
