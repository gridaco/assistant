import { BorderRadiusGeometry } from "@bridged.xyz/flutter-builder/dist/painting/border-radius-geomatry";
import { Radius } from "@bridged.xyz/flutter-builder/dist/dart-ui/radius";
import { BorderRadius } from "@bridged.xyz/flutter-builder/dist/painting/border-radius";

export function interpretRectCorner(rect: RectangleNode) {
    let borderRadius: BorderRadiusGeometry

    // figma.mixed means lrtb values are mixed.
    if (rect.cornerRadius == figma.mixed) {
        borderRadius = BorderRadius.only({
            topLeft: rect.topLeftRadius == 0 ? undefined : Radius.circular(rect.topLeftRadius),
            topRight: rect.topRightRadius == 0 ? undefined : Radius.circular(rect.topRightRadius),
            bottomLeft: rect.bottomLeftRadius == 0 ? undefined : Radius.circular(rect.bottomLeftRadius),
            bottomRight: rect.bottomRightRadius == 0 ? undefined : Radius.circular(rect.bottomRightRadius),
        })
    } else {
        if (rect.cornerRadius != 0) {
            borderRadius = BorderRadius.circular(rect.cornerRadius)
        }
    }

    return borderRadius
}