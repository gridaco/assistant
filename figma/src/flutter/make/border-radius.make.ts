import { BorderRadiusGeometry, BorderRadius, Radius } from "@bridged.xyz/flutter-builder";
import { AltRectangleNode, AltEllipseNode, AltFrameNode } from "../../node-convert/mixin";

export function makeBorderRadius(node: AltRectangleNode | AltEllipseNode | AltFrameNode): BorderRadiusGeometry {
    if (node.type === "ELLIPSE")
        return undefined;
    if (node.cornerRadius === 0 ||
        (node.cornerRadius === undefined && node.topLeftRadius === undefined)) {
        return undefined;
    }

    return node.cornerRadius !== figma.mixed
        ? BorderRadius.circular(node.cornerRadius as number)
        : BorderRadius.only(
            {
                topLeft: Radius.circular(node.topLeftRadius),
                topRight: Radius.circular(node.topRightRadius),
                bottomLeft: Radius.circular(node.bottomLeftRadius),
                bottomRight: Radius.circular(node.bottomRightRadius)
            })
}