import { convertIntoReflectNode } from "@bridged.xyz/design-sdk/lib/nodes/conversion";
import { generateWidget } from "./flutter";
import { retrieveFlutterColors } from "./flutter/utils/fetch-colors";
import { hideAllExcept, hideAllOnly } from "./dev-tools/hide-all";
import { runLints } from "./lint/lint";
import { EK_COPIED, EK_FOCUS_REQUEST, EK_GENERATED_CODE_PLAIN, EK_LINT_FEEDBACK, EK_PREVIEW_SOURCE } from "./app/constants/ek.constant";
import { handleNotify } from "@bridged.xyz/design-sdk/lib/figma";
import { makeApp } from "./flutter/make/app.make";

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
    try {
        console.log("constraints",
            (figma.currentPage.selection[0] as any).constraints,
            (figma.currentPage.selection[0] as any).layoutAlign)
    }
    catch (e) { }

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

    // FIXME
    const safeParent = rawNode.parent as any
    const convertedSelection = convertIntoReflectNode(
        rawNode,
        safeParent
    );

    //#region  run linter
    const feedbacks = runLints(convertedSelection)
    console.warn(feedbacks)
    figma.ui.postMessage({
        type: EK_LINT_FEEDBACK,
        data: feedbacks
    });
    //#endregion


    const widget = generateWidget(convertedSelection, parentNodeId);
    const app = makeApp(widget)

    figma.ui.postMessage({
        type: EK_GENERATED_CODE_PLAIN,
        data: {
            code: widget.build().finalize(),
            app: app.build().finalize(),
        },
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
            type: EK_PREVIEW_SOURCE,
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
    handleNotify(msg)
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


    else if (msg.type == EK_FOCUS_REQUEST) {
        const target = figma.getNodeById(msg.data.id) as SceneNode
        figma.currentPage.selection = [target];
        figma.viewport.scrollAndZoomIntoView([target]);
    }

    else if (msg.type == "randomize-selection") {
        randimizeText()
    }

    else if (msg.type == "hide-all-except") {
        hideAllExceptFromCurrentSelection(msg.data.except)
    }
    else if (msg.type == "hide-all-only") {
        hideAllOnlyFromCurrentSelection(msg.data.only)
    }


    else if (msg.type == EK_COPIED) {
        figma.notify("copied to clipboard", { timeout: 1 })
    }

    else if (msg.type === "flutter") {
        run();
    } else if (msg.type === "layerName" && msg.data !== layerName) {
        layerName = msg.data;
        run();
    }
};

function hideAllExceptFromCurrentSelection(except: NodeType) {
    if (rawNode.type != "FRAME") {
        figma.notify("hide-all tools can be used only for framenode")
    } else {
        hideAllExcept(rawNode, except)
    }
}

function hideAllOnlyFromCurrentSelection(only: NodeType) {
    if (rawNode.type != "FRAME") {
        figma.notify("hide-all tools can be used only for framenode")
    } else {
        hideAllOnly(rawNode, only)
    }
}

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