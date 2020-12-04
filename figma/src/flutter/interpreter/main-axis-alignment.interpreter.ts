import { MainAxisAlignment } from "@bridged.xyz/flutter-builder/lib";
import { MainAxisAlignment as ReflectMainAxisAlignment } from "@reflect.bridged.xyz/core/lib"
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree";

export function interpretMainAxisAlignment(mainAxisAlignemt: ReflectMainAxisAlignment): MainAxisAlignment {
    switch (mainAxisAlignemt) {
        case ReflectMainAxisAlignment.start:
            return MainAxisAlignment.start as Snippet
        case ReflectMainAxisAlignment.start:
            return MainAxisAlignment.center as Snippet
        case ReflectMainAxisAlignment.end:
            return MainAxisAlignment.end as Snippet
        case ReflectMainAxisAlignment.spaceBetween:
            return MainAxisAlignment.spaceBetween as Snippet
    }
}