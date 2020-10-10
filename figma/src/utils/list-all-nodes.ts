/**
 * list nodes in the document via iteration. page nodes are not supported by design.
 * @param types 
 */
export function listAllNodes(types: NodeType[]): Array<SceneNode> {
    const all = figma.root.findAll();
    const targets = []
    all.forEach((n) => {
        if (types.includes(n.type)) {
            targets.push(n);
        }
    })
    return targets;
}