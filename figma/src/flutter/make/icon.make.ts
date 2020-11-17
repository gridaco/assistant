import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes"
import { BoxFit, Icon, Icons, Image } from "@bridged.xyz/flutter-builder/lib"
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree"
import { IconData } from "@bridged.xyz/flutter-builder/lib/widgets/icon-data"
import { makeColor } from "."
import { interpretIcon } from "../interpreter/icon.interpreter"


export function makeDynamicIcon(node: ReflectSceneNode): Icon | Image {
    const iconContent = interpretIcon(node)
    if (iconContent instanceof IconData) {
        return makeIcon(node, iconContent)
    } else {
        return Image.network(iconContent.url, {
            width: node.width,
            height: node.height,
            fit: BoxFit.cover as Snippet
        })
            .addComment('Detected as Icon')
            .addComment(`FIXME: Check your design. this is an icon of node ${node.toString()}. we couldn't any matching flutter native icon, so we uploaded the asset to the cloud, load from it.`)
    }
}

export function makeIcon(node: ReflectSceneNode, icon: IconData) {
    let fills = node.primaryFill

    return new Icon(icon, {
        size: node.width,
        color: makeColor(fills)
    })
}

export function makePlaceholderIcon(node: ReflectSceneNode): Icon {
    return makeIcon(node, Snippet.fromStatic('Icons.add'))
}

/**
 * builds icon widget if value is hold by flutter built-in material icons
 * @param iconName 
 */
export function makeMaterialIcon(iconName: string): Icon {
    try {
        return new Icon(Icons.fromName(iconName))
    } catch (e) {
        // return default icon
        return new Icon(Snippet.fromStatic('Icons.add'))
    }
}