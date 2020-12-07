import { BorderRadiusGeometry, BorderRadius, Radius } from "@bridged.xyz/flutter-builder/lib";
import { ReflectRectangleNode, ReflectEllipseNode, ReflectFrameNode, mixed } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { interpretRadius } from "../interpreter/radius.interpret";

export function makeBorderRadius(node: ReflectRectangleNode | ReflectEllipseNode | ReflectFrameNode): BorderRadiusGeometry {
    if (node instanceof ReflectEllipseNode)
        return undefined;
    if (
        (node.cornerRadius === undefined) ||
        (node.cornerRadius.all === 0)
    ) {
        return undefined;
    }

    return node.cornerRadius.all !== undefined
        ? BorderRadius.circular(node.cornerRadius.all as number)
        : BorderRadius.only(
            {
                topLeft: interpretRadius(node.cornerRadius.tl),
                topRight: interpretRadius(node.cornerRadius.tr),
                bottomLeft: interpretRadius(node.cornerRadius.bl),
                bottomRight: interpretRadius(node.cornerRadius.br)
            })
}