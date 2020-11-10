import { ReflectDefaultShapeMixin } from "@bridged.xyz/design-sdk/lib/nodes";
import { ImageProvider, Image, NetworkImage } from "@bridged.xyz/flutter-builder"
import { retrieveImageFill, retrievePrimaryImageFill } from "@bridged.xyz/design-sdk/lib/utils/retrieve-image-fills";
import { ImageRepositories } from "../../assets-repository";

// TODO - make this non async. It's too costly. generate preview image url local algorythm, upload syncronously.

/**
 * finds the primary image in shape node, upload it to temporary hosting. returns the ImageProvider with hosted image.
 * @param node basically, rect or ellipes node.
 */
export function interpretImage(node: ReflectDefaultShapeMixin): ImageProvider {
    if (node.hasImage) {
        return interpretImageFills(node.fills as ReadonlyArray<Paint>)
    }
}

export function interpretImageFills(fills: ReadonlyArray<Paint> | Paint): ImageProvider {
    let image: globalThis.Image
    if (Array.isArray(fills)) {
        image = retrievePrimaryImageFill(fills)
    } else {
        // if fill is single, and the fill type was "IMAGE", we can consider it as a ImagePaint
        image = retrieveImageFill(fills as ImagePaint)
    }

    const hostedImage = ImageRepositories.current.addImage({
        key: image.hash,
        hash: image.hash
    })

    // this will give image provider `Image.network("https://domain.com/image.png")`
    return new NetworkImage(hostedImage.url)
}