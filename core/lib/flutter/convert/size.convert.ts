import { nodeWidthHeight } from "@bridged.xyz/design-sdk/lib/utils/node-width-height";
import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { double, Double, Size } from "@bridged.xyz/flutter-builder/lib";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib";
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree";

/**
 * converts size for flutter, with autolayout manifest.
 * @param node
 */
export function convertToSize(node: ReflectSceneNode): Size {
  const size = nodeWidthHeight(node, false);

  let propWidth: double;
  if (typeof size.width === 'number') {
    propWidth = size.width
      ? roundNumber(size.width)
      : undefined;
  }
  // if has parent
  else if (node.hasParent) {
    // propWidth = Double.infinity as Snippet
    // TODO - FIXME - handle height. this should not be infinite it it contains something.
  }

  let propHeight: double;
  if (typeof size.height === 'number') {
    propHeight = size.height
      ? roundNumber(size.height)
      : undefined;
  } else if (node.hasParent) {
    // propHeight = Double.infinity as Snippet
    // TODO - FIXME - handle height. can it ever be infinite?
  }

  return new Size(propWidth, propHeight)
}
