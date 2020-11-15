import { mixed, ReflectRectangleNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { BorderRadiusGeometry, Radius, BorderRadius } from "@bridged.xyz/flutter-builder/lib";

export function interpretRectCorner(rect: ReflectRectangleNode): BorderRadiusGeometry {
    let borderRadius: BorderRadiusGeometry

    // figma.mixed means lrtb values are mixed.
    if (rect.cornerRadius == mixed) {
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