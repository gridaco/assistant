
import { convertIntoAltNode } from "./node-convert/conversion";
import { generateSource } from "./flutter";
import { retrieveFlutterColors } from "./flutter/utils/fetch-colors";

let parentNodeId: string;
let layerName = false;
let rawNode: SceneNode;

async function showUI() {
    // load plugin with confugured w/h
    const rawWidth = await figma.clientStorage.getAsync("width")
    const rawHeight = await figma.clientStorage.getAsync("height")
    let width = 375
    if (rawWidth) {
        width = parseInt(rawWidth)
    }
    let height = 812
    if (rawHeight) {
        height = parseInt(rawHeight)
    }
    figma.showUI(__html__, { width: width, height: height });
}


showUI()

function run() {

    console.log("selection", figma.currentPage.selection)

    // ignore when nothing was selected
    if (figma.currentPage.selection.length === 0) {
        figma.ui.postMessage({
            type: "empty",
        });
        return;
    }

    // force to single selection
    // return false or raise error if more than one node is selected.
    if (figma.currentPage.selection.length >= 2) {
        figma.notify("only single selection is supported", {
            timeout: 1.5
        })
        return false;
    }

    // check [ignoreStackParent] description
    rawNode = figma.currentPage.selection[0]
    parentNodeId = figma.currentPage.selection[0].parent?.id ?? "";

    let result = "";


    const convertedSelection = convertIntoAltNode(
        figma.currentPage.selection,
        null
    );


    result = generateSource(convertedSelection, parentNodeId);

    // result = interpretRect(rawNode as RectangleNode).build().finalize()

    console.log(result);

    figma.ui.postMessage({
        type: "result",
        data: result,
    });

    // send preview image
    rawNode.exportAsync({
        format: "PNG",
        contentsOnly: true,
        constraint: {
            type: "HEIGHT",
            value: 250
        }
    }).then(d => {
        figma.ui.postMessage({
            type: "preview",
            data: {
                source: d,
                name: rawNode.name
            },
        });
    })

    figma.ui.postMessage({
        type: "colors",
        data: retrieveFlutterColors([convertedSelection]),
    });
}

figma.on("selectionchange", () => {
    run();
});

// efficient? No. Works? Yes.
// todo pass data instead of relying in types
figma.ui.onmessage = (msg) => {
    // region test
    if (msg.type === 'create-rectangles') {
        const nodes = []
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle()
            rect.x = i * 150
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
            figma.currentPage.appendChild(rect)
            nodes.push(rect)
        }
        figma.currentPage.selection = nodes
        figma.viewport.scrollAndZoomIntoView(nodes)
    }
    // endregion test

    if (msg.type == "randomize-selection") {
        randimizeText()
    }

    else if (msg.type == "copied") {
        figma.notify("copied to clipboard", { timeout: 1 })
    }

    if (msg.type === "flutter") {
        run();
    } else if (msg.type === "layerName" && msg.data !== layerName) {
        layerName = msg.data;
        run();
    }
};


// content randomizer, work on progress..
async function randimizeText() {
    if (figma.currentPage.selection.length >= 2) {
        figma.notify("only single node randomize is supported")
        return;
    }

    const primarySelection = figma.currentPage.selection[0]
    if (primarySelection.type == "TEXT") {
        const text = (primarySelection as TextNode)
        await figma.loadFontAsync(text.fontName as FontName);
        text.characters = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultrices scelerisque leo nec consectetur. Sed porta metus molestie sollicitudin gravida. Nulla vitae metus sapien."
    } if (primarySelection.type == "RECTANGLE" || primarySelection.type == "ELLIPSE") {
        const box = (primarySelection as RectangleNode)
    }
}