import { retrieveFill } from "@bridged.xyz/design-sdk/lib/utils";
import { Color, Colors } from "@bridged.xyz/flutter-builder/lib";
import { converters } from "@reflect.bridged.xyz/core/lib";

/**
 * Retrieve the SOLID color for Flutter when existent, otherwise ""
 */
export function makeColor(fills: ReadonlyArray<Paint> | Paint): Color | undefined {
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
        if (color.r + color.g + color.b === 0 && opacity === 0) {
            return Colors.transparent
        }
        if (color.r + color.g + color.b === 0 && opacity === 1) {
            return Colors.black;
        }
        if (color.r + color.g + color.b === 3 && opacity === 1) {
            return Colors.white
        }

        return Color.fromHex(converters.color.rgbTo8hex(color, opacity));
    } catch (e) {
        console.error(`error while converting color to rgba color:${color}, opacity:${opacity}`, e)
        return
    }
}
