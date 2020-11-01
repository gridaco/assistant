import { ReflectDefaultShapeMixin } from "@bridged.xyz/design-sdk/lib/nodes";
import { upload } from "uguu-api";
import { ImageProvider, Image } from "@bridged.xyz/flutter-builder"
import { retrievePrimaryImageFill } from "@bridged.xyz/design-sdk/lib/utils/retrieve-image-fills";

// TODO - make this non async. It's too costly. generate preview image url local algorythm, upload syncronously.

/**
 * finds the primary image in shape node, upload it to temporary hosting. returns the ImageProvider with hosted image.
 * @param node basically, rect or ellipes node.
 */
export async function interpretImage(node: ReflectDefaultShapeMixin): Promise<ImageProvider> {
    if (node.hasImage) {
        return interpretImageFills(node.fills as ReadonlyArray<Paint>)
    }
}

export async function interpretImageFills(fills: ReadonlyArray<Paint> | Paint): Promise<ImageProvider> {
    let image
    if (Array.isArray(fills)) {
        image = retrievePrimaryImageFill(fills)
    } else {
        image = fills
    }
    const bytes = await image.getBytesAsync()
    const uploaded = await upload(`${image.hash}.png`, new Blob([bytes]))

    // this will give image provider `Image.network("https://domain.com/image.png")`
    return Image.network(uploaded.url)
}