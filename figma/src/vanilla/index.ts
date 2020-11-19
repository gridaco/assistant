import { ReflectSceneNode, ReflectSceneNodeType, ReflectTextNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { TextManifest, ImageManifest } from '@reflect.bridged.xyz/core/lib'


/**
 * for transporting vanilla elements
 */
interface VanillaScreenTransport {

}



/**
 * makes vanilla output, which contains only text data, and all others as image.
 * @param node 
 */
function makeVanilla(node: ReflectSceneNode) {
    const vanillaElements: Array<VanilaElement> = []
    // 1. loop through all children, if only text, make text manifest.
    // 2. if not a text, go deeper, 
    node.children.forEach(c => {
        const elements = fetchElements(c)
        vanillaElements.push(...elements)
    })
}


type VanilaElement = TextManifest | ImageManifest

function fetchElements(node: ReflectSceneNode): Array<VanilaElement> {
    if (node instanceof ReflectTextNode) {
        // todo -> make text manifest
        const textStyle = node.textStyle;
        textStyle.color = node.primaryColor
        return [
            {
                text: node.characters,
                textAlign: node.textAlignHorizontal,
                textAlignVertical: node.textAlignVertical,
                // TODO
                style: node.textStyle,
                overflow: undefined,
                maxLines: undefined
            }
        ]
    }
    const containstext = containsText(node)
    if (containstext) {
        const elements: Array<VanilaElement> = []
        node.children.forEach(element => {
            elements.push(...fetchElements(element))
        });
        return elements
    }
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