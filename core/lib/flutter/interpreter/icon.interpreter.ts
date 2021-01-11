import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { Icons } from "@bridged.xyz/flutter-builder/lib";
import { IconData } from "@bridged.xyz/flutter-builder/lib/widgets/icon-data";
import { ImageRepositories, TemporaryImageAsset } from "core/lib/assets-repository";

export function interpretIcon(node: ReflectSceneNode): IconData | TemporaryImageAsset {

    try {
        // regex is valid, but does not work at this point. inspect this, make it live again.
        // const re = /(?<=mdi_)(.*?)*/g // finds **mdi_** pattern
        const splits = node.name.split('mdi_')
        const name = splits[splits.length - 1]
        console.log(`mdi matching name found, ${JSON.stringify(name)}`)
        const mdicon = Icons.fromName(name)
        return mdicon
    } catch (e) {
        console.info(`no flutter native icon with ${node.name} found, making image instead.`)
    }

    const asset = ImageRepositories.current.addImage({ key: node.id, hash: null })
    return asset
}