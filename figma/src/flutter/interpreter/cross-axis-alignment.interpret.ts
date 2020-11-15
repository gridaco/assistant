import { CrossAxisAlignment } from "@bridged.xyz/flutter-builder/lib"

/**
 * returns CrossAxisAlignment by layoutAlign
 * @param layoutAlign 
 */
export function makeCrossAxisAlignment(layoutAlign: string): CrossAxisAlignment {
    switch (layoutAlign) {
        case "MIN":
            return CrossAxisAlignment.start
        case "MAX":
            return CrossAxisAlignment.end
        case "STRETCH":
            return CrossAxisAlignment.stretch
        case "CENTER":
            return CrossAxisAlignment.center
        default:
            return CrossAxisAlignment.center
    }
}
