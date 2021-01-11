import { mixed, ReflectRectangleNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { BorderRadiusGeometry, Radius, BorderRadius } from "@bridged.xyz/flutter-builder/lib";
import { interpretRadius } from "./radius.interpret";

export function interpretRectCorner(rect: ReflectRectangleNode): BorderRadiusGeometry {
    let borderRadius: BorderRadiusGeometry

    // figma.mixed means lrtb values are mixed.
    if (rect.cornerRadius.all === undefined) {
        borderRadius = BorderRadius.only({
            topLeft: rect.cornerRadius.tl == 0 ? undefined : interpretRadius(rect.cornerRadius.tl),
            topRight: rect.cornerRadius.tr == 0 ? undefined : interpretRadius(rect.cornerRadius.tr),
            bottomLeft: rect.cornerRadius.bl == 0 ? undefined : interpretRadius(rect.cornerRadius.bl),
            bottomRight: rect.cornerRadius.br == 0 ? undefined : interpretRadius(rect.cornerRadius.br),
        })
    } else {
        if (rect.cornerRadius.all != 0) {
            borderRadius = BorderRadius.circular(rect.cornerRadius.all as number)
        }
    }

    return borderRadius
}