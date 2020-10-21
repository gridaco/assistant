import { nodeWidthHeight } from "../../figma-utils/node-width-height";
import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes/types";

export type Size = {
  w: number
  h: number
}

export function convertToSize(node: ReflectSceneNode): Size {
  const size = nodeWidthHeight(node, false);

  const propWidth = size.width
    ? size.width as number
    : undefined;

  const propHeight = size.height
    ? size.height
    : undefined;

  return {
    w: propWidth,
    h: propHeight
  }
}
