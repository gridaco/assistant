function replaceAllTextFontInFrame(node: FrameNode, fontFamilly: string) {
    function convertChildren(children: ReadonlyArray<SceneNode>) {
        node.children.forEach((c) => {
            if ('children' in c) {
                convertChildren(c.children)
            }
            if (c.type == "TEXT") {
                (c.fontName as FontName) = {
                    family: "Roboto",
                    style: "Regular"
                }
            }
        })
    }

    convertChildren(node.children)
}