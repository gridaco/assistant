import { ReflectDefaultShapeMixin, ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes"
import { Icon, Icons } from "@bridged.xyz/flutter-builder/lib"
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree"
import { makeColor } from "."


export function makePlaceholderIcon(node: ReflectSceneNode): Icon {
    let fills = 'fills' in node ? node.primaryFill : undefined;

    return new Icon(Snippet.fromStatic('Icons.add'), {
        size: node.width,
        color: makeColor(fills)
    })
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