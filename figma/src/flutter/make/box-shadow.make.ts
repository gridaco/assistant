import { BoxShadow, Offset } from "@bridged.xyz/flutter-builder";
import { ReflectSceneNode } from "../../node-convert/mixin";
import { makeColorFromRGBO } from "./color.make";

export function makeBoxShadow(node: ReflectSceneNode): Array<BoxShadow> {
    let boxShadows: Array<BoxShadow> = [];

    if (node.effects?.length > 0) {
        const dropShadow: Array<ShadowEffect> = node.effects.filter(
            (d): d is ShadowEffect => d.type === "DROP_SHADOW" && d.visible !== false
        );

        if (dropShadow.length > 0) {

            dropShadow.forEach((d: ShadowEffect) => {
                const boxShadow = new BoxShadow({
                    color: makeColorFromRGBO(d.color, d.color.a),
                    blurRadius: d.radius,
                    offset: new Offset(d.offset.x, d.offset.y)
                })
                boxShadows.push(boxShadow)
            });
        }
        // TODO inner shadow, layer blur
    }

    // return undefined if array is empty, since it's not needed.
    return boxShadows.length > 0 ? boxShadows : undefined;
}