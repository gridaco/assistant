import { Color } from "@bridged.xyz/flutter-builder/lib";
import { retrieveFill } from "../../figma-utils/retrieve-fill";
import { rgbTo8hex } from "../../utils/color";

/**
 * Retrieve the SOLID color for Flutter when existent, otherwise ""
 */
export function makeColor(fills: ReadonlyArray<Paint> | PluginAPI["mixed"]): Color {
    const fill = retrieveFill(fills);

    if (fill?.type === "SOLID") {
        // todo maybe ignore text color when it is black?
        const opacity = fill.opacity ?? 1.0;
        return makeColorFromRGBO(fill.color, opacity)
    }

    return undefined;
}


export function makeColorFromRGBO(color: RGB, opacity: number): Color {
    try {
        if (color.r + color.g + color.b === 0 && opacity === 1) {
            return Color.fromHex("#000000")
            // TOOD - change with return Colors.black
        }

        if (color.r + color.g + color.b === 3 && opacity === 1) {
            return Color.fromHex("#FFFFFFFF")
            // TOOD - change with  return Colors.white;
        }

        return Color.fromHex(rgbTo8hex(color, opacity));
    } catch (e) {
        return
    }
}
