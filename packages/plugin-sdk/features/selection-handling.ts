import type { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { SceneNode } from "@bridged.xyz/design-sdk/lib/figma/types/v1";

const __handlers: CanvasUserSelectionHandler[] = [];

export type CanvasUserSelecion = readonly SceneNode[] | ReflectSceneNode[];
export type CanvasUserSelectionHandler = (
  selection: CanvasUserSelecion
) => void;

export function invokeSelectionUpdate(newSelection: CanvasUserSelecion) {
  console.log("invoking selection update again from app side");
  __handlers.forEach((h) => {
    h(newSelection);
  });
}

export function registerHandler(handler: CanvasUserSelectionHandler) {
  __handlers.push(handler);
}

export function removeHandler(target: CanvasUserSelectionHandler) {
  // TODO
  throw "removeHandler not implemented";
}
