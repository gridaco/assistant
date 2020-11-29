import { MainAxisAlignment } from "@bridged.xyz/flutter-builder/lib";
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree";

export function interpretMainAxisAlignment(primaryAxisAlignItems: string): MainAxisAlignment {
    switch (primaryAxisAlignItems) {
        case "MIN":
            return MainAxisAlignment.start as Snippet
        case "CENTER":
            return MainAxisAlignment.center as Snippet
        case "MAX":
            return MainAxisAlignment.end as Snippet
        case "SPACE_BETWEEN":
            return MainAxisAlignment.spaceBetween as Snippet
    }
}