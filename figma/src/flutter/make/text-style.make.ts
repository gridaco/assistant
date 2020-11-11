import { Color, FontStyle, FontWeight, TextDecoration, TextStyle, Theme } from "@bridged.xyz/flutter-builder";
import { commonLetterSpacing } from "../../figma-utils/common-text-height-spacing";
import { ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { typographyIntelisenceMapping } from "../../utils/text-style-map";
import { convertFontWeight } from "../../utils/text-convert";
import { makeColor } from ".";

/**
 * get the code of Text#style (text-style) via the name of the defined textstyle.
 * I.E, "H1" will give you "Theme.of(context).textTheme.headline1"
 * @param textStyleName 
 */
function getThemedTextStyleByName(textStyleName: string): TextStyle {
    for (const key of typographyIntelisenceMapping.keys()) {
        for (const canditate of typographyIntelisenceMapping.get(key)) {
            if (textStyleName.toLowerCase().includes(canditate)) {
                console.log(`the givven name ${textStyleName} matches with ${canditate}. themed style is.. ${key}`)
                return (Theme.of().textTheme[key] as TextStyle)
            }
        }
    }
    throw `No matching textstyle guideline for name "${textStyleName}" found.`
}

export function makeTextStyle(node: ReflectTextNode): TextStyle {


    // TODO lineSpacing


    const fontColor: Color = makeColor(node.fills)


    let fontSize: number
    if (node.fontSize !== figma.mixed) {
        fontSize = node.fontSize
    }

    let decoration: TextDecoration
    if (node.textDecoration === "UNDERLINE") {
        decoration = TextDecoration.underline;
    }

    let fontStyle: FontStyle
    if (node.fontName !== figma.mixed &&
        node.fontName.style.toLowerCase().match("italic")) {
        fontStyle = FontStyle.italic
    }

    let fontFamily: string
    if (node.fontName !== figma.mixed) {
        fontFamily = node.fontName.family;
    }

    let fontWeight: FontWeight;
    if (node.fontName !== figma.mixed) {
        fontWeight = FontWeight[`w${convertFontWeight(node.fontName.style)}`]
    }

    let letterSpacing: number
    if (letterSpacing > 0) {
        letterSpacing = commonLetterSpacing(node);
    }

    // try to make with themed text style
    try {
        const themedTextStyle = getThemedTextStyleByName(node.textStyle.name);
        return themedTextStyle.copyWith({
            color: fontColor
        })
    } catch (e) {
        // console.log(`no textstyle for node ${node.name}. skipping to custom textStyle builder. (cannot use theme)`)
        // console.error(e)
    }


    // make and return new text style
    return new TextStyle(
        {
            color: fontColor,
            fontSize: fontSize,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            letterSpacing: letterSpacing,
            decoration: decoration,
        }
    )
}