import { BoxShadow, Offset } from "@bridged.xyz/flutter-builder/lib";
import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { makeColorFromRGBO } from "./color.make";

export function makeBoxShadow(node: ReflectSceneNode): Array<BoxShadow> {
    let boxShadows: Array<BoxShadow> = [];

    if (node.effects?.length > 0) {
        const shadows: Array<ShadowEffect> = node.effects.filter(
            (d): d is ShadowEffect => (d.type === "DROP_SHADOW" || d.type === "INNER_SHADOW") && d.visible
        );

        // if no shadow filtered available, return undefined
        if (shadows.length == 0) {
            return undefined
        }



        shadows.forEach(function (d: ShadowEffect) {
            let boxShadow: BoxShadow
            if (d.type == "DROP_SHADOW") {
                boxShadow = new BoxShadow({
                    color: makeColorFromRGBO(d.color, d.color.a),
                    blurRadius: requiredNumber(d.radius),
                    spreadRadius: requiredNumber(d.spread),
                    offset: requiredOffset(new Offset(d.offset.x, d.offset.y))
                });
            } else if (d.type == "INNER_SHADOW") {
                // handling inner shadow
                // https://stackoverflow.com/a/55096682/5463235

                boxShadow = new BoxShadow({
                    color: makeColorFromRGBO(d.color, d.color.a),
                    blurRadius: requiredNumber(d.radius),
                    // multiply -1 * blur for spread
                    // TODO inspect this logic again.
                    spreadRadius: requiredNumber((d.spread + d.radius) * -1),
                    offset: requiredOffset(new Offset(d.offset.x, d.offset.y))
                });
            }

            boxShadows.push(boxShadow);
        });
    }

    // return undefined if array is empty, since it's not needed.
    return boxShadows.length > 0 ? boxShadows : undefined;
}

function requiredNumber(number: number): number {
    const rounded = roundNumber(number)
    if (rounded == 0) {
        return undefined
    }
    return rounded
}

/**
 * returns undefined, if offset is redundant.
 */
function requiredOffset(offset: Offset): Offset {
    if (offset.dx == 0 && offset.dy == 0) {
        return undefined
    }
    return offset;
}