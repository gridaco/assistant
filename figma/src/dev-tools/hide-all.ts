
export function hideAllExcept(target: FrameNode | GroupNode | InstanceNode, except: NodeType) {
    target.children.forEach((n) => {
        if (n.type == "FRAME" || n.type == "GROUP" || n.type == "INSTANCE") {
            hideAllExcept(n, except);
        } else {
            if (n.type != except) {
                n.visible = false;
            }
        }
    })
}

export function hideAllOnly(target: FrameNode | GroupNode | InstanceNode, only: NodeType) {
    target.children.forEach((n) => {
        if (n.type == "FRAME" || n.type == "GROUP" || n.type == "INSTANCE") {
            hideAllOnly(n, only);
        } else {
            if (n.type == only) {
                n.visible = false;
            }
        }
    })
}