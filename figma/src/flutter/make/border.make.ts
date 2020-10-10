import { Border } from "@bridged.xyz/flutter-builder";
import { ReflectSceneNode } from "../../node-convert/mixin";
import { makeColor } from "./color.make";

// generate the border, when it exists
export function makeBorder(node: ReflectSceneNode): Border {
    if (node.type === "GROUP" || !node.strokes || node.strokes.length === 0) {
        return undefined;
    }

    // generate the border, when it should exist
    return node.strokeWeight
        ? Border.all(
            {
                color: makeColor(node.strokes),
                width: node.strokeWeight
            }
        )
        : undefined;
}
