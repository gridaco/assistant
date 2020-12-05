export async function replaceAllTextFontInFrame(node: FrameNode, fontFamilly: string) {
    function convertChildren(children: ReadonlyArray<SceneNode>) {
        children.forEach(async (c) => {
            if ('children' in c) {
                convertChildren(c.children)
            }
            if (c.type == "TEXT") {
                const font: FontName = {
                    family: "Roboto",
                    style: "Regular"
                }
                await figma.loadFontAsync(font);
                (c.fontName as FontName) = font
            }
        })
    }

    convertChildren(node.children)
}