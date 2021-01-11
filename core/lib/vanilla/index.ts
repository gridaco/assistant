import { StorableLayerType, StorableSceneType, TransportLayer, VanillaSceneTransport } from "@bridged.xyz/client-sdk/lib";
import { ReflectFrameNode, ReflectSceneNode, ReflectSceneNodeType, ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { TextManifest, ImageManifest } from '@reflect.bridged.xyz/core/lib'
import { converters } from "@reflect.bridged.xyz/core/lib";
import { ImageRepository } from "core/lib/assets-repository";
import { makeCGRect } from "./make";


const vanillaImageRepo = new ImageRepository('vanilla-image-repository')
/**
 * makes vanilla output, which contains only text data, and all others as image.
 * @param node 
 */
export function makeVanilla(node: ReflectFrameNode): VanillaSceneTransport {
    console.log(`start making vanilla from node ${node.toString()}`)
    const vanillaElements: Array<TransportLayer> = []
    // 1. loop through all children, if only text, make text manifest.
    // 2. if not a text, go deeper, 
    const anchor = { x: node.absoluteX, y: node.absoluteY }
    node.children.forEach(c => {
        const elements = fetchElements(c, anchor)
        vanillaElements.push(...elements)
    })

    const bg = frameToRectBgTransport(node, anchor, {
        overrideIndex: -999
    })
    vanillaElements.push(bg)

    // const bg = frameToRectBgTransport(node, anchor)
    // vanillaElements.push(bg)

    return {
        id: node.id,
        scene: {
            name: node.name,
            description: '',
            tags: [],
            nodeId: node.id,
            cachedPreview: 'bridged://temp-asset/current-vanilla-scene',
            sceneType: StorableSceneType.screen,
            width: node.width,
            height: node.height,
            layers: vanillaElements,
            backgroundColor: converters.color.rgbaTo8Hex(node.primaryColor),
        },
        repository: vanillaImageRepo
    }
}

type Anchor = { x: number, y: number }

function fetchElements(node: ReflectSceneNode, anchor: Anchor): Array<TransportLayer> {
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

    /**
    * if the container is FrameNode, the frame itself should be translated as rect. so it can have same property and work as background
    * frame to rect property
    */
    // make bg as separate layer
    if (node.type === ReflectSceneNodeType.frame) {
        const bg = frameToRectBgTransport(node as ReflectFrameNode, anchor)
        elements.push(bg)
    }
    //


    return elements
}


function frameToRectBgTransport(f: ReflectFrameNode, a: Anchor, options?: {
    overrideIndex?: number
}): TransportLayer {
    // TODO -> index should be +1 of the most highest
    let calculatedIndex = 0 - f.hierachyIndex
    const calculatedName = `(bg-converted) ${f.name}`
    console.log('frameToRectBgTransport', f.name, f)

    if (options?.overrideIndex) {
        calculatedIndex = options.overrideIndex
    }

    return {
        index: calculatedIndex || 0,
        nodeId: f.id,
        name: calculatedName,
        x: relativePositionToAnchor(a.x, f.absoluteX),
        y: relativePositionToAnchor(a.y, f.absoluteY),
        type: StorableLayerType.rect,
        width: f.width,
        height: f.height,
        data: makeCGRect(f)
    }
}


/**
 * the givven anchor i.e. 300 is actually 0 for relative position.
 * the givven absolute position 700 is actually 400 to relative as the givven anchor
 * @param anchor 
 * @param absolute 
 */
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