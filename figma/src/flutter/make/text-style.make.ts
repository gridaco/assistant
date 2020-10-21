import { FontStyle, FontWeight, TextDecoration, TextStyle, Theme } from "@bridged.xyz/flutter-builder";
import { commonLetterSpacing } from "../../figma-utils/common-text-height-spacing";
import { ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { typographyIntelisenceMapping } from "../../utils/text-style-map";
import { getTextStyleById } from "../../utils/figma-api-extended";
import { convertFontWeight } from "../../utils/text-convert";

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
                return Theme.of().textStyle[key]
            }
        }
    }
    throw `No matching textstyle guideline for name "${textStyleName}" found.`
}

export function makeTextStyle(node: ReflectTextNode): TextStyle {
    try {
        const textStyle = getTextStyleById(node.textStyleId as string)
        // console.log(`name of textstyle is... ${textStyle.name}`);
        return getThemedTextStyleByName(textStyle.name);
    } catch (e) {
        // console.log(`no textstyle for node ${node.name}. skipping to custom textStyle builder. (cannot use theme)`)
        // console.error(e)
    }

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

    // TODO lineSpacing
    // TODO color - flutterColor(node.fills)

    return new TextStyle(
        {
            fontSize: fontSize,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            letterSpacing: letterSpacing,
            decoration: decoration,
        }
    )
}