import { ReflectNode } from "./base.node";
export interface FontName {
    family: string
    style: string
}

type mixed = "mixed"

export class ReflectTextNode extends ReflectNode {
    // fills: Array<Fill>
    fontName: FontName
    fontSize: number | mixed
    letterSpacing: LetterSpacing
    lineHeight: LineHeight

}
