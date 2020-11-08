import { Widget, TextAlign, Text } from "@bridged.xyz/flutter-builder";
import { ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { makeTextStyle } from "./text-style.make";

/**
 * makes Text from TextNode
 * @param node text node from desing
 */
export function makeText(node: ReflectTextNode): Text {
    // only undefined in testing
    let alignHorizontal = node.textAlignHorizontal?.toString()?.toLowerCase() ?? "left";
    alignHorizontal =
        alignHorizontal === "justified" ? "justify" : alignHorizontal;


    // todo if layoutAlign !== MIN, Text will be wrapped by Align
    // if alignHorizontal is LEFT, don't do anything because that is native
    let textAlign: TextAlign
    if (alignHorizontal !== "left") {
        textAlign = TextAlign[alignHorizontal]
    }

    //#region get text content
    let text = node.characters;
    switch (node.textCase) {
        case "LOWER":
            text = text.toLowerCase();
            break;
        case "UPPER":
            text = text.toUpperCase();
            break;
        case "TITLE":
            // TODO
            break;
        case "ORIGINAL":
            break;
    }

    //#endregion
    const escapedText = escapeDartString(text);
    const textStyle = makeTextStyle(node);

    return new Text(escapedText, {
        style: textStyle,
        textAlign: textAlign
    })
}


function escapeDartString(text: string): string {
    const splittedChars = text.split("\n");
    text = splittedChars.length > 1 ? splittedChars.join("\\n") : text;


    // \ -> \\
    text = text.split("\\").join("\\\\");

    // $ -> \$''"
    // const re_dollar_sign = new RegExp('\$', 'g');
    text = text.split('$').join('\\$');
    // text = text.replace(re_dollar_sign, '\\$')

    // " -> \"
    // const re_double_quote = new RegExp('\"', 'g');
    // text = text.replace(re_double_quote, '\\"')
    text = text.split('"').join('\\"');

    // ' -> \'
    // const re_single_quote = new RegExp("\'", 'g');
    // text = text.replace(re_single_quote, "\\'")
    text = text.split("'").join("\\'");

    return text;
}