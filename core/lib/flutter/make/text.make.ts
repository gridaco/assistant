import { Widget, TextAlign, Text } from "@bridged.xyz/flutter-builder/lib";
import { ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes/types";
import { makeTextStyle } from "./text-style.make";
import { interpretTextAlign } from "../interpreter/text-align.interpreter";

/**
 * makes Text from TextNode
 * @param node text node from desing
 */
export function makeText(node: ReflectTextNode): Text {
    const textAlign = interpretTextAlign(node.textAlignHorizontal)

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

    console.log(text, text.replace('\n', '\\n'))

    // \ -> \\
    text = text.split("\\").join("\\\\");

    // \n -> \\n
    text = text.split("\n").join("\\n");

    // \r -> \\n
    text = text.split("\r").join("\\r");

    // \t -> \\t
    text = text.split("\t").join("\\t");

    // $ -> \$''"
    text = text.split('$').join('\\$');

    // " -> \"
    text = text.split('"').join('\\"');

    // ' -> \'
    text = text.split("'").join("\\'");

    return text;
}