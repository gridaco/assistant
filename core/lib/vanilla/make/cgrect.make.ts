import { ReflectFrameNode, ReflectRectangleNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { CGRectManifest } from "@reflect.bridged.xyz/core/lib";

export function makeCGRect(node: ReflectFrameNode | ReflectRectangleNode): CGRectManifest {
    const fill = node.primaryColor
    const borderRadius = node.cornerRadius
    const shadow = node.primaryShadow
    console.log('shadow', shadow)
    // TODO shadow support
    // TODO border support
    // TODO gradient support

    return {
        borderRadius: borderRadius,
        width: node.width,
        height: node.height,
        shadow: node.primaryShadow,
        fill: fill,
        opacity: node.opacity,
    }
}