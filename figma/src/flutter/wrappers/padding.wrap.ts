import { Widget, Padding } from "@bridged.xyz/flutter-builder";
import { AltFrameNode, AltEllipseNode, ReflectRectangleNode } from "../../node-convert/mixin";
import { makeEdgeInsets } from "../make/edge-insets.make";

export function wrapWithPadding(node: AltFrameNode | AltEllipseNode | ReflectRectangleNode,
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
