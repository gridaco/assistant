import { CrossAxisAlignment } from "@bridged.xyz/flutter-builder/lib"

/**
 * returns CrossAxisAlignment by counterAxisAlignItems
 * @param counterAxisAlignItems
 */
export function interpretCrossAxisAlignment(counterAxisAlignItems: string): CrossAxisAlignment {
    switch (counterAxisAlignItems) {
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
