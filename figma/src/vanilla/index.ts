import { StorableLayerType, TransportLayer, VanillaScreenTransport } from "@bridged.xyz/client-sdk/lib";
import { ReflectSceneNode, ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { TextManifest, ImageManifest } from '@reflect.bridged.xyz/core/lib'
import { rgbaTo8Hex } from "@reflect.bridged.xyz/uiutils/lib";
import { ImageRepository } from "../assets-repository";


const vanillaImageRepo = new ImageRepository('vanilla-image-repository')
/**
 * makes vanilla output, which contains only text data, and all others as image.
 * @param node 
 */
export function makeVanilla(node: ReflectSceneNode): VanillaScreenTransport {

    const vanillaElements: Array<TransportLayer> = []
    // 1. loop through all children, if only text, make text manifest.
    // 2. if not a text, go deeper, 
    node.children.forEach(c => {
        const elements = fetchElements(c, {
            x: node.absoluteX,
            y: node.absoluteY
        })
        // console.log('elements', elements)
        vanillaElements.push(...elements)
    })

    // console.log('vanilla', vanillaElements)

    return {
        id: node.id,
        project: 'temp',
        width: node.width,
        height: node.height,
        elements: vanillaElements,
        backgroundColor: rgbaTo8Hex(node.primaryColor),
        repository: vanillaImageRepo
    }
}



function fetchElements(node: ReflectSceneNode, anchor: { x: number, y: number }): Array<TransportLayer> {
    // console.log(`fetching elements from ${node.toString()}`)
    if (node instanceof ReflectTextNode) {
        // todo -> make text manifest
        const textStyle = node.textStyle;
        textStyle.color = node.primaryColor
        return [{
            nodeId: node.id,
            index: node.hierachyIndex,
            x: relativePositionToAnchor(anchor.x, node.absoluteX),
            y: relativePositionToAnchor(anchor.y, node.absoluteY),
            type: StorableLayerType.text,
            name: node.name,
            width: node.width,
            height: node.height,
            data: <TextManifest>{
                text: node.characters,
                textAlign: node.textAlignHorizontal,
                textAlignVertical: node.textAlignVertical,
                // TODO
                style: node.textStyle,
                overflow: undefined,
                maxLines: undefined
            }
        }

        ]
    }
    const elements: Array<TransportLayer> = []
    const containstext = containsText(node)
    if (containstext) {
        node.children.forEach(element => {
            elements.push(...fetchElements(element, anchor))
        });
    } else {

        /**
         * TODO
         * if the container is FrameNode, the frame itself should be translated as rect. so it can have same property and work as background
         */

        const image = vanillaImageRepo.addImage({
            key: node.id,
            hash: undefined
        })

        const other: TransportLayer = {
            nodeId: node.id,
            index: node.hierachyIndex,
            x: relativePositionToAnchor(anchor.x, node.absoluteX),
            y: relativePositionToAnchor(anchor.y, node.absoluteY),
            type: StorableLayerType.vanilla,
            width: node.width,
            height: node.height,
            name: node.name,
            data: <ImageManifest>{
                src: image.url,
                width: node.width,
                height: node.height,
            }
        }
        elements.push(other)
    }
    return elements
}

function relativePositionToAnchor(anchor: number, absolute: number) {
    return absolute - anchor
}

/**
 * cheks if text exists under the children/granchildren ndoes.
 * @param node 
 */
function containsText(node: ReflectSceneNode): boolean {
    if (node instanceof ReflectTextNode) {
        return true
    } else {
        const contains = node.children.some(c => containsText(c))
        return contains
    }
}