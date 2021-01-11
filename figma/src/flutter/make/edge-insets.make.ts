import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { commonPadding } from "@bridged.xyz/design-sdk/lib/utils/common-padding";
import { EdgeInsets, EdgeInsetsGeometry } from "@bridged.xyz/flutter-builder/lib";

// This must happen before Stack or after the Positioned, but not before.
export function makeEdgeInsets(node: ReflectSceneNode): EdgeInsetsGeometry {
  if (!("layoutMode" in node)) {
    return undefined;
  }

  const padding = commonPadding(node);
  if (!padding) {
    return undefined;
  }

  if ("all" in padding) {
    return EdgeInsets.all(padding.all)
  }

  // horizontal and vertical, as the default AutoLayout
  if (padding.horizontal + padding.vertical !== 0 &&
    padding.top + padding.bottom + padding.left + padding.right === 0) {
    const propHorizontalPadding: number = padding.horizontal > 0
      ? padding.horizontal
      : undefined;

    const propVerticalPadding: number = padding.vertical > 0
      ? padding.vertical
      : undefined;

    return EdgeInsets.symmetric({
      horizontal: propHorizontalPadding,
      vertical: propVerticalPadding
    })
  }

  // all padding to 0 does not require padding.
  if (padding.left === 0 && padding.right === 0 && padding.top === 0 && padding.bottom === 0) {
    return undefined
  }

  return EdgeInsets.only({
    left: getOnlyIfNotZero(padding.left),
    right: getOnlyIfNotZero(padding.right),
    top: getOnlyIfNotZero(padding.top),
    bottom: getOnlyIfNotZero(padding.bottom)
  })
}


function getOnlyIfNotZero(value): number {
  if (value === 0) {
    return
  }
  return value;
}