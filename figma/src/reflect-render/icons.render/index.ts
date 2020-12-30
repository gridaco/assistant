import { reflectColorToFigmaColor } from "@bridged.xyz/design-sdk/lib/figma/converters/color.convert"
import { Color } from "@reflect.bridged.xyz/core/lib/color"

/**
 * renders materila icon to figma canvas via icon name and icon svg data
 * @param name 
 * @param data a svg data string
 */
export function renderSvgIcon(name: string, data: string, color: Color = '#000000', placement: { x: number, y: number } = { x: 0, y: 0 }): FrameNode {
    console.log(`inserting icon with name ${name} and data ${data}`)

    const node = figma.createNodeFromSvg(data)

    // todo replace naming creation with reflect core
    node.name = `icons/mdi_${name}`
    node.setSharedPluginData('icon', 'key', name)
    node.x = placement.x
    node.y = placement.y

    switchSvgColor(node, [
        {
            from: '#000000',
            to: color
        }
    ])

    return node
}

export function switchSvgColor(node: FrameNode, sets: { from: Color, to: Color }[]) {
    function switchIfVector(node: SceneNode) {
        if (node.type == 'VECTOR') {
            const fills = node.fills as Paint[]
            if (fills && fills.length > 0) {
                // fills.forEach((f) => {

                // })
                // FIXME - implement target switching.
                // this currently only accepts single set.
                node.fills = [
                    {
                        type: 'SOLID',
                        color: reflectColorToFigmaColor(sets[0].to)
                    }
                ]
            }
        } else if ('children' in node) {
            node.children.forEach(c => {
                switchIfVector(c)
            })
        }
    }

    node.children.forEach(c => {
        switchIfVector(c)
    })
}