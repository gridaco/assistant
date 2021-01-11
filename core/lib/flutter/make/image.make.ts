import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes"
import { BoxFit, Image } from "@bridged.xyz/flutter-builder/lib"
import { Snippet } from "@bridged.xyz/flutter-builder/lib/builder/buildable-tree"
import { interpretIllust } from "../interpreter/illust.interpret"

const PLACEHOLDER = 'https://bridged-service-static.s3-us-west-1.amazonaws.com/branding/bridged-logo-512.png'
export function makePlaceHolderImage(node: ReflectSceneNode): Image {
    return Image.network(PLACEHOLDER, {
        width: node.width,
        height: node.height,
        fit: BoxFit.cover as Snippet
    })
}

export function makeIllustImage(node: ReflectSceneNode): Image {
    const asset = interpretIllust(node)
    return Image.network(asset.url, {
        width: node.width,
        height: node.height,
        fit: BoxFit.cover as Snippet
    }).addComment(`image content of ${node.toString()}`)
}