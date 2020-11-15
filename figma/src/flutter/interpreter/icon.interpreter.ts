import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { Icons } from "@bridged.xyz/flutter-builder/lib";
import { IconData } from "@bridged.xyz/flutter-builder/lib/widgets/icon-data";
import { ImageRepositories, TemporaryImageAsset } from "../../assets-repository";

export function interpretIcon(node: ReflectSceneNode): IconData | TemporaryImageAsset {

    try {
        const name = node.name.match(/(?<=mdi_)(.*?)*/g)[0]
        console.log('mdi matching name found', name)
        const mdicon = Icons.fromName(name)
        return mdicon
    } catch (e) {
        console.info(`no flutter native icon with ${node.name} found, making image instead.`)
    }

    const asset = ImageRepositories.current.addImage({ key: node.id, hash: null })
    return asset
}