import { DetectedButtonManifest } from "@reflect.bridged.xyz/detection/lib/button.detection"
import { Color, FlatButton, RoundedRectangleBorder, Text } from "@bridged.xyz/flutter-builder/lib";
import { makeColor } from "./color.make";
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree";
import { makeBorderRadius } from "./border-radius.make";
import { makeBorderSide } from "./border-side.make";

export function makeButton(manifest: DetectedButtonManifest) {
    const child = new Text(manifest.text?.characters)
    const color: Color = makeColor(manifest.base.fills)
    const textColor: Color = makeColor(manifest.text?.fills)
    const minWidth = manifest.base.width
    const height = manifest.base.height
    const shape = new RoundedRectangleBorder({
        borderRadius: makeBorderRadius(manifest.base),
        side: makeBorderSide(manifest.base)
    })

    return new FlatButton(
        {
            onPressed: Snippet.fromStatic('(){ print("Button clicked!"); }') as any,
            child: child,
            color: color,
            textColor: textColor,
            minWidth: minWidth,
            height: height,
            shape: shape
        }
    );
}