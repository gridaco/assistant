import { ReflectLineNode, ReflectRectangleNode, ReflectSceneNode, ReflectSceneNodeType } from "@bridged.xyz/design-sdk/lib/nodes";
import { Colors, Divider } from "@bridged.xyz/flutter-builder";

export function makeDivider(node: ReflectLineNode | ReflectRectangleNode) {
    // node.strokeCap
    // todo implement
    return new Divider({
        height: 1,
        thickness: 1,
        color: Colors.black
    })
}