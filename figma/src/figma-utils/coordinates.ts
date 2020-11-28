import { ReflectSceneNode, ReflectSceneNodeType } from "@bridged.xyz/design-sdk/lib/nodes/types";

/**
 * In Figma, Groups have absolute position while Frames have relative.
 * This is a helper to retrieve the node.parent.x without worries.
 * Usually, after this is called, node.x - parentX is done to solve that scenario.
 *
 * Input is expected to be node.parent.
 * TODO - inspect this.
 */
export function coordinates(node: ReflectSceneNode): [number, number] {
  if (node.type !== ReflectSceneNodeType.group) {
    return [0, 0]
  } else {
    return [node.x, node.y]
  }
}
