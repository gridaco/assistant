import type { ReflectSceneNode } from "@design-sdk/core/nodes";
import { atom, GetRecoilValue, selector } from "recoil";

const ATOM_KEY_CURRENT_NODE_SELECTION_PRIMARY =
  "state.selection.node.primary.id";
const SELECT_KEY_CURRENT_NODE_SELECTION_PRIMARY =
  "state.selection.node.primary";

// current primary selected node's id
export const currentlySelectedPrimaryNodeId = atom({
  key: ATOM_KEY_CURRENT_NODE_SELECTION_PRIMARY,
  default: "",
});

// current primary selected node
export const currentlySelectedPrimaryNode = selector<ReflectSceneNode>({
  get: ({ get }) => {
    const id = get(currentlySelectedPrimaryNodeId);
    // TODO fetch node data via id
    throw "not implemeted";
  },
  key: SELECT_KEY_CURRENT_NODE_SELECTION_PRIMARY,
});
