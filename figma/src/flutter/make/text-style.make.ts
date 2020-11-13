import { Color, FontStyle, FontWeight, TextDecoration, TextStyle, Theme } from "@bridged.xyz/flutter-builder/lib";
import { commonLetterSpacing } from "../../figma-utils/common-text-height-spacing";
import { ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { convertFontWeight } from "../../utils/text-convert";
import { makeColor } from ".";
import { TextStyleRepository } from "@bridged.xyz/design-sdk/lib/figma";

/**
 * get the code of Text#style (text-style) via the name of the defined textstyle.
 * I.E, "H1" will give you "Theme.of(context).textTheme.headline1"
 * @param textStyleName 
 */
function getThemedTextStyleByName(textStyleName: string): TextStyle {
    const styleDef = TextStyleRepository.getStyleDefFromTextStyleName(textStyleName)
    return (Theme.of().textTheme[styleDef] as TextStyle)
}

export function makeTextStyleFromDesign(style: globalThis.TextStyle): TextStyle {

    let decoration: TextDecoration = makeTextDecoration(style.textDecoration)
    const fontFamily: string = style.fontName.family
    const fontWeight: FontWeight = FontWeight[`w${convertFontWeight(style.fontName.style)}`];
    // percentage is not supported
    const letterSpacing = style.letterSpacing.unit === 'PIXELS' ? style.letterSpacing.value : undefined
    const fontStyle = makeFontStyle(style.fontName)

    return new TextStyle(
        {
            fontSize: style.fontSize,
            fontWeight: fontWeight,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            letterSpacing: letterSpacing,
            decoration: decoration,
        }
    )
}

export function makeTextStyle(node: ReflectTextNode): TextStyle {

    // TODO lineSpacing

    const fontColor: Color = makeColor(node.fills)

    let fontSize: number
    if (node.fontSize) {
        fontSize = node.fontSize
    }

    const decoration: TextDecoration = makeTextDecoration(node.textDecoration)
    let fontStyle: FontStyle = makeFontStyle(node.fontName)

    let fontFamily: string
    if (node.fontName) {
        fontFamily = node.fontName.family;
    }

    let fontWeight: FontWeight;
    if (node.fontName) {
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




export function makeFontStyle(fontName: FontName): FontStyle {
    if (!fontName) { return }

    let fontStyle: FontStyle
    if (fontName && fontName.style.toLowerCase().match("italic")) {
        fontStyle = FontStyle.italic
    }
    return fontStyle
}

export function makeTextDecoration(textDecoration: globalThis.TextDecoration): TextDecoration {
    if (!textDecoration) { return }
    let decoration: TextDecoration
    if (textDecoration === "UNDERLINE") {
        decoration = TextDecoration.underline;
    }
    return decoration
}