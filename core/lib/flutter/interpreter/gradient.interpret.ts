import { Gradient, LinearGradient, Color } from "@bridged.xyz/flutter-builder/lib";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { gradientAngle } from "@bridged.xyz/design-sdk/lib/utils/color";
import { makeColorFromRGBO } from "../make/color.make";
import { gradientDirection } from "../wrappers/container.wrap";

export function interpretGradient(gradient: GradientPaint): Gradient {
    // TODO Handle transform percisely.
    // https://www.figma.com/plugin-docs/api/Transform/
    // https://www.mathworks.com/discovery/affine-transformation.html
    const direction = gradientDirection(gradientAngle(gradient));
    console.log('start making gradient with', gradient.gradientStops)

    let stopPoints: Array<number> = []
    const colors: Array<Color> = []
    for (const stop of gradient.gradientStops) {
        const color = makeColorFromRGBO(stop.color, stop.color.a)
        colors.push(color)
        console.log('color for gradient: ', color)

        // stop point as rounded .00 number
        stopPoints.push(roundNumber(stop.position))
    }


    // remove redundant stops argument if possible.
    if (canIgnoreStops(stopPoints)) {
        stopPoints = undefined
    }

    switch (gradient.type) {
        case "GRADIENT_LINEAR":
            return new LinearGradient({
                begin: direction.begin,
                end: direction.end,
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


/**
 * process stop points.
 * if stop points can be ignored, do not provide one.
 * for example if 2 colors available. and the spots are 0 and 1, you can ignore the stops.
 * [0, 1] -> true
 * [0, 0.8] -> false
 * [0, 0.5, 1] -> true
 * [0, 0.48, 1] -> false
 * [0, 0.33333, 0.33333, 1] -> true
 */
function canIgnoreStops(stops: number[]): boolean {
    const MAX = 1
    const length = stops.length;

    // even distribution will give you the even distance between numbers.
    const evenDistribution = MAX / (length - 1)

    for (let i = 0; i < length; i++) {
        const stop = stops[i]
        const previousStop = stops[i - 1]

        if (i == 0 && stop == 0) {
            // if first stop is 0, it's fine.
            // ignore this case. 
        }
        else if (Math.abs(previousStop - stop) !== evenDistribution) {
            return false
        }
    }

    // if all values are evenly distributed, return true.
    return true
}