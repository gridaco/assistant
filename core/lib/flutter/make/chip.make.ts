import { Color, RoundedRectangleBorder, TextStyle, Text, Icon } from "@bridged.xyz/flutter-builder/lib"
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree"
import { DetectedChipManifest } from "@reflect.bridged.xyz/detection/lib/chip.detection"
import { format } from "path"
import { makeBorderRadius } from "."
import { makeBorderSide } from "./border-side.make"
import { makeColor } from "./color.make"
import { Chip, Widget, } from "@bridged.xyz/flutter-builder/lib";
import { wrapWithContainer } from "../wrappers"
import { makeDynamicIcon } from "./icon.make"

export function makeChip(manifest : DetectedChipManifest){
    console.log({manifest});
    var content = new Text(manifest.content?.characters)
    const color: Color = makeColor(manifest.base.fills)
    const textColor: Color = makeColor(manifest.content?.fills)
    const height = manifest.base.height
    const shape = new RoundedRectangleBorder({
        borderRadius: makeBorderRadius(manifest.base),
        side: makeBorderSide(manifest.base)
    })
    const onSelected = Snippet.fromStatic('(){ print("Chip onSelected"); }') as any
    const onDeleted = Snippet.fromStatic('(){ print("Chip onSelected"); }') as any
    
    const deleteIcon = manifest.trailing;
    const avartar = manifest.leading;

    var leadingWidget;
    var trailingWidget;
    
    if(manifest.leading){
        // TODO :: Make
    }

    if(manifest.trailing){
        const icon = makeDynamicIcon(manifest.trailing)
        trailingWidget = icon
    }

    return new Chip(
        {
            // onSelected : onSelected,
            onDeleted : onDeleted,
            label : content,
            labelStyle : new TextStyle({color :textColor}),
            backgroundColor : color,
            shape,
            avartar : leadingWidget,
            deleteIcon : trailingWidget,
            // height        
        }
    )
}