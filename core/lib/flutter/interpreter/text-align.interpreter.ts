import { TextAlign as RFTextAlign } from "@reflect.bridged.xyz/core/lib"
import { TextAlign as FLTextAlign } from "@bridged.xyz/flutter-builder/lib";

export function interpretTextAlign(textalign: RFTextAlign): FLTextAlign {
    // only undefined in testing

    // we are not handling "left" align, because it will be set by default.
    switch (textalign) {
        case RFTextAlign.start:
            return FLTextAlign.start as FLTextAlign

        case RFTextAlign.right:
            return FLTextAlign.right as FLTextAlign

        case RFTextAlign.end:
            return FLTextAlign.end as FLTextAlign

        case RFTextAlign.center:
            return FLTextAlign.center as FLTextAlign

        case RFTextAlign.justify:
            return FLTextAlign.justify as FLTextAlign

        default:
            // todo if layoutAlign !== MIN, Text will be wrapped by Align
            // if alignHorizontal is LEFT, don't do anything because that is native
            return undefined
    }
}
