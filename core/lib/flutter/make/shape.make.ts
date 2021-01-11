import { ShapeBorder, Border, BorderSide, CircleBorder, RoundedRectangleBorder } from "@bridged.xyz/flutter-builder/lib";
import { ReflectRectangleNode, ReflectEllipseNode, ReflectFrameNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { makeBorderRadius } from "./border-radius.make";
import { makeColor } from "./color.make";

// TODO this is not fully implemented.
export function makeShape(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode): ShapeBorder {
    const strokeColor = makeColor(node.strokes);
    const side: Border = strokeColor && node.strokeWeight > 0
        ? new BorderSide({
            width: node.strokeWeight,
            color: strokeColor
        })
        : undefined;

    if (node.type === "ELLIPSE") {
        return new CircleBorder({
            side: side
        })
    }

    return new RoundedRectangleBorder({
        side: side,
        borderRadius: makeBorderRadius(node)
    })
}
