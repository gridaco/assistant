import { ReflectDefaultShapeMixin } from "@bridged.xyz/design-sdk/lib/nodes";
import { BorderSide } from "@bridged.xyz/flutter-builder/lib";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { makeColor } from "./color.make";

export function makeBorderSide(node: ReflectDefaultShapeMixin) {
    // TODO -> move this as member method
    if (!node.strokes || node.strokes.length === 0) {
        return undefined;
    }

    return new BorderSide({
        color: makeColor(node.strokes),
        width: roundNumber(node.strokeWeight),
    })
}