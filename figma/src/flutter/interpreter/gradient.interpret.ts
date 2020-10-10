import { Color } from "@bridged.xyz/flutter-builder/dist/dart-ui/color";
import { Gradient } from "@bridged.xyz/flutter-builder/dist/painting/gradient";
import { LinearGradient } from "@bridged.xyz/flutter-builder/dist/painting/linear-gradient";
import { makeColorFromRGBO } from "../make/color.make";

export default function (gradient: GradientPaint): Gradient {
    const stopPoints: Array<number> = []
    const colors: Array<Color> = []
    for (const stop of gradient.gradientStops) {
        const color = makeColorFromRGBO(stop.color, stop.color.a)
        console.log(color)
        colors.push(color)
        stopPoints.push(stop.position)
    }

    switch (gradient.type) {
        case "GRADIENT_LINEAR":
            return new LinearGradient({
                colors: colors,
                stops: stopPoints
            })
        case "GRADIENT_RADIAL":
            console.error("GRADIENT_RADIAL not handled")
            // TODO
            break;
        case "GRADIENT_ANGULAR":
            console.error("GRADIENT_ANGULAR not handled")
            // TODO
            break;
        case "GRADIENT_DIAMOND":
            console.error("GRADIENT_DIAMOND not handled")
            // TODO
            break;
    }
}