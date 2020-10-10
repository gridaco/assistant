import { Widget, TextAlign, Text } from "@bridged.xyz/flutter-builder";
import { AltTextNode } from "../../node-convert/mixin";
import { makeTextStyle } from "./text-style.make";

/**
 * makes Text from TextNode
 * @param node text node from desing
 */
export function makeText(node: AltTextNode): Text {
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
    const splittedChars = text.split("\n");
    const charsWithLineBreak = splittedChars.length > 1 ? splittedChars.join("\\n") : text;
    //#endregion

    const textStyle = makeTextStyle(node);

    return new Text(charsWithLineBreak, {
        style: textStyle,
        textAlign: textAlign
    })
}