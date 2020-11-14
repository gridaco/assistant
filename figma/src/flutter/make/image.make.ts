import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes"
import { BoxFit, Image } from "@bridged.xyz/flutter-builder/lib"
import { ImageRepositories } from "../../assets-repository"

const PLACEHOLDER = 'https://bridged-service-static.s3-us-west-1.amazonaws.com/branding/bridged-logo-512.png'
export function makePlaceHolderImage(node: ReflectSceneNode): Image {
    return Image.network(PLACEHOLDER, {
        width: node.width,
        height: node.height,
        fit: BoxFit.cover
    })
}

export function makeIllustImage(node: ReflectSceneNode): Image {
    const asset = ImageRepositories.current.addImage({
        key: node.id, hash: undefined
    })
    return Image.network(asset.url, {
        width: node.width,
        height: node.height,
        fit: BoxFit.cover
    })
}