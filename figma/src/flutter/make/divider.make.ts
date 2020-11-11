import { ReflectLineNode, ReflectRectangleNode, ReflectSceneNode, ReflectSceneNodeType } from "@bridged.xyz/design-sdk/lib/nodes";
import { Colors, Divider } from "@bridged.xyz/flutter-builder";
import { makeColor } from "./color.make";

export function makeDivider(node: ReflectLineNode | ReflectRectangleNode | VectorNode) {
    // todo migrate this to detection logic
    if (node.rotation !== 0) { return }
    // node.strokeCap
    // todo implement

    if (node instanceof ReflectRectangleNode) {
        // Case 1 has fill, and stroke
        // Case 2 has 0 height, has stroke
        // Case 3 has no stroke, height > 0 && has fill
        return new Divider({
            // don't use node.height -- for line, it's always 0
            height: node.strokeWeight,
            color: makeColor(node.fills),
            thickness: node.strokeWeight
        })
    }


    if (node instanceof ReflectLineNode) {
        return new Divider({
            // don't use node.height -- for line, it's always 0
            height: node.strokeWeight,
            color: makeColor(node.fills),
            thickness: node.strokeWeight
        })
    }
}