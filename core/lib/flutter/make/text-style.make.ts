import { Color, FontStyle, FontWeight, TextDecoration, TextStyle as FLTextStyle, Theme } from "@bridged.xyz/flutter-builder/lib";
import { TextStyle as RFTextStyle, FontStyle as RFFontStyle, TextDecoration as RFTextDecoration } from "@reflect.bridged.xyz/core"
import { ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { makeColor } from ".";
import { TextStyleRepository } from "@bridged.xyz/design-sdk/lib/figma";
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree";

/**
 * get the code of Text#style (text-style) via the name of the defined textstyle.
 * I.E, "H1" will give you "Theme.of(context).textTheme.headline1"
 * @param textStyleName 
 */
function getThemedTextStyleByName(textStyleName: string): FLTextStyle {
    const styleDef = TextStyleRepository.getStyleDefFromTextStyleName(textStyleName)
    return (Theme.of().textTheme[styleDef] as FLTextStyle)
}

export function makeTextStyleFromDesign(style: RFTextStyle): FLTextStyle {

    let decoration: TextDecoration = makeTextDecoration(style.decoration)
    const fontFamily: string = style.fontFamily
    const fontWeight: FontWeight = FontWeight[style.fontWeight];
    // percentage is not supported
    const letterSpacing = style.letterSpacing
    const fontStyle = makeFontStyle(style.fontStyle)

    return new FLTextStyle(
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

// TODO lineSpacing
export function makeTextStyle(node: ReflectTextNode): FLTextStyle {

    const fontColor: Color = makeColor(node.fills)

    let fontSize: number
    if (node.fontSize) {
        fontSize = node.fontSize
    }

    const decoration: TextDecoration = makeTextDecoration(node.textStyle.decoration)
    let fontStyle: FontStyle = makeFontStyle(node.textStyle.fontStyle)

    let fontFamily: string
    if (node.textStyle) {
        fontFamily = node.textStyle.fontFamily;
    }

    let fontWeight: FontWeight;
    if (node.textStyle) {
        fontWeight = FontWeight[`${node.textStyle.fontWeight}`]
    }

    let letterSpacing: number
    if (node.textStyle.letterSpacing > 0) {
        letterSpacing = node.textStyle.letterSpacing
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
    return new FLTextStyle(
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




export function makeFontStyle(style: RFFontStyle): FontStyle {
    switch (style) {
        case RFFontStyle.italic:
            return FontStyle.italic as Snippet
        case RFFontStyle.normal:
            return // not returning any value, since normal is a default value.
    }
}

export function makeTextDecoration(textDecoration: RFTextDecoration): TextDecoration {
    if (!textDecoration) { return }
    let decoration: TextDecoration
    if (textDecoration === RFTextDecoration.underline) {
        decoration = TextDecoration.underline as Snippet;
    }
    return decoration
}