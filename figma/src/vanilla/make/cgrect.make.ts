import { ReflectFrameNode, ReflectRectangleNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { CGRectManifest } from "@reflect.bridged.xyz/core/lib";

export function makeCGRect(node: ReflectFrameNode | ReflectRectangleNode): CGRectManifest {
    const fill = node.primaryColor
    const borderRadius = {

    }

    return {
        // TODO
        borderRadius: undefined,
        width: node.width,
        height: node.height,
        shadow: node.primaryShadow,
        fill: fill,
        opacity: node.opacity
    }
}