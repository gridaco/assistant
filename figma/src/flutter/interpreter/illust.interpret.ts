import { ReflectSceneNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { ImageRepositories, TemporaryImageAsset } from "../../assets-repository";

export function interpretIllust(node: ReflectSceneNode): TemporaryImageAsset {
    const asset = ImageRepositories.current.addImage({
        key: node.id, hash: undefined
    })

    return asset
}