import { nodeWidthHeight } from "../../figma-utils/node-width-height";
import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { Size } from "@bridged.xyz/flutter-builder/lib";


export function convertToSize(node: ReflectSceneNode): Size {
  const size = nodeWidthHeight(node, false);

  const propWidth = size.width
    ? size.width as number
    : undefined;

  const propHeight = size.height
    ? size.height
    : undefined;

  return new Size(propWidth, propHeight)
}
