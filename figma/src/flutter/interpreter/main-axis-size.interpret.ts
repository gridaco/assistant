import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { MainAxisSize } from "@bridged.xyz/flutter-builder/lib";

export function interpretMainAxisSize(node: ReflectSceneNode): MainAxisSize {
    if (node.layoutGrow === 1) {
        return MainAxisSize.max
    } else {
        return MainAxisSize.min
    }
}