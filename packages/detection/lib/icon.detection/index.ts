import rule from "./rules"

export function checkIfIcon(node: SceneNode): boolean {
    const validMiinSize = node.width > rule.minSize && node.height > rule.minSize;
    return validMiinSize
}