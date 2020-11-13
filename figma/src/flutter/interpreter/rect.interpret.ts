import { Container, Gradient, BoxDecoration, Color } from "@bridged.xyz/flutter-builder/lib";
import { makeColorFromRGBO } from "../make/color.make";
import { interpretGradient } from "./gradient.interpret"
import { interpretRectCorner } from "./corner.interpret";
import { roundNumber } from "@reflect.bridged.xyz/uiutils/lib/pixels";
import { ReflectRectangleNode } from "@bridged.xyz/design-sdk/lib/nodes";
export function interpretRect(rect: ReflectRectangleNode): Container {
    const fills = rect.fills as Array<Paint>
    const fillsCount = fills.length
    const hasSingleBackgroundFill = fillsCount == 1;
    const hasManyBackgroundFill = fillsCount > 1;
    const hasFills = fillsCount > 0;

    const stoke = retrievePrimaryStroke(rect.strokes)
    const hasStroke: boolean = stoke != undefined


    let backgroundColor: Color
    let gradient: Gradient
    //#region handle background fill
    if (hasFills) {
        if (hasSingleBackgroundFill) {
            const singleFill = fills[0]
            const fillVisible = singleFill.visible
            const fillOpacity = singleFill.opacity

            const backgroundType = backgroundTypeFromFill(singleFill)
            switch (backgroundType) {
                case BackgroundType.solid:
                    const solidFill = (singleFill as SolidPaint)
                    backgroundColor = makeColorFromRGBO(solidFill.color, solidFill.opacity)
                    break;
                case BackgroundType.gradient:
                    const gradientFill = (singleFill as GradientPaint)
                    gradient = interpretGradient(gradientFill)
                    break;
                case BackgroundType.image:
                    const imageFill = (singleFill as ImagePaint)
                    break
            }
        } else if (hasManyBackgroundFill) {
            const primaryFill = retrievePrimaryFill(fills)
            const backgroundType = backgroundTypeFromFill(primaryFill)
            switch (backgroundType) {
                case BackgroundType.solid:
                    const solidFill = (primaryFill as SolidPaint)
                    backgroundColor = makeColorFromRGBO(solidFill.color, solidFill.opacity)
                    break;
                case BackgroundType.gradient:
                    const gradientFill = (primaryFill as GradientPaint)
                    gradient = interpretGradient(gradientFill)
                    break;
                case BackgroundType.image:
                    const imageFill = (primaryFill as ImagePaint)
                    break
            }
        }
    }
    //#endregion handle background fill

    //#region handle brder radius


    //#endregion



    const decoration = new BoxDecoration({
        color: backgroundColor,
        gradient: gradient,
        borderRadius: interpretRectCorner(rect)
    })

    // const backgroundColor =
    // const docorationOrColor : boolean =  

    return new Container(
        {
            width: roundNumber(rect.width),
            height: roundNumber(rect.height),
            decoration: decoration
        }
    );
}


/**
 * retrieves @enum BackgroundType from Paint fill
 * @param fill the single fill in the fills of specific node
 */
function backgroundTypeFromFill(fill: Paint): BackgroundType {
    const fillType = fill.type;

    const isSolid = fillType == "SOLID"
    if (isSolid) {
        return BackgroundType.solid
    }

    const isGradient = fillType == "GRADIENT_ANGULAR" || fillType == "GRADIENT_DIAMOND" || fillType == "GRADIENT_LINEAR" || fillType == "GRADIENT_RADIAL"
    if (isGradient) {
        return BackgroundType.gradient
    }

    const isImage = fillType == "IMAGE"
    if (isImage) {
        return BackgroundType.image
    }
}


/**
 * the converted fill type represented as 3 types. used with @see backgroundTypeFromFill
 */
enum BackgroundType {
    gradient,
    solid,
    image
}


/**
 * retrives the most likely usable stroke from list of strokes. if single, just return it.
 * this is explicitly declared for future usage and logic separation.
 * @param strokes 
 */
function retrievePrimaryStroke(strokes: ReadonlyArray<Paint>): Paint {
    return retrievePrimaryPaint(strokes)
}

/**
 * retrives the most likely usable stroke from list of strokes. if single, just return it.
 * this is explicitly declared for future usage and logic separation.
 * @param fills
 */
function retrievePrimaryFill(fills: ReadonlyArray<Paint>): Paint {
    return retrievePrimaryPaint(fills)
}

/**
 * retrives the most likely usable paint from list of paints. if single, just return it. 
 * if multiple, remove all invisible elements and return the first one available.
 * @param paints 
 */
function retrievePrimaryPaint(paints: ReadonlyArray<Paint>): Paint {
    if (paints.length > 1) {
        try {
            return paints.filter((p) => { return p.visible && p.opacity == 1 })[0]
        }
        catch (e) {
            return undefined
        }
    } else if (paints.length == 1) {
        return paints[0]
    } else {
        return undefined
    }
}