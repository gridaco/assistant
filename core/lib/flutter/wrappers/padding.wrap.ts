import { Widget, Padding } from "@bridged.xyz/flutter-builder/lib";
import { ReflectFrameNode, ReflectEllipseNode, ReflectRectangleNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { makeEdgeInsets } from "../make/edge-insets.make";

export function wrapWithPadding(node: ReflectFrameNode | ReflectEllipseNode | ReflectRectangleNode,
    child: Widget): Widget {
    const padding = makeEdgeInsets(node);
    if (padding) {
        return new Padding({
            padding: padding,
            child: child
        })
    }
    return child;
}
