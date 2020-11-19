import { ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes/types";

export function commonLineHeight(node: ReflectTextNode): number {
  if (node.lineHeight &&
    node.lineHeight.unit !== "AUTO" &&
    Math.round(node.lineHeight.value) !== 0) {
    if (node.lineHeight.unit === "PIXELS") {
      return node.lineHeight.value;
    } else {
      if (node.fontSize) {
        // based on tests, using Inter font with varied sizes and weights, this works.
        // example: 24 * 20 / 100 = 4.8px, which is correct visually.
        return (node.fontSize * node.lineHeight.value) / 100;
      }
    }
  }

  return 0;
}

