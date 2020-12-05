import { convertIntoReflectNode } from "@bridged.xyz/design-sdk/lib/nodes/conversion";
import { buildApp } from "./flutter";
import { retrieveFlutterColors } from "./flutter/utils/fetch-colors";
import { hideAllExcept, hideAllOnly } from "./tool-box/manipulate/hide-all/hide-all";
import { runLints } from "./lint/lint";
import { EK_COMPUTE_STARTED, EK_COPIED, EK_CREATE_ICON, EK_FOCUS_REQUEST, EK_GENERATED_CODE_PLAIN, EK_IMAGE_ASSET_REPOSITORY_MAP, EK_LINT_FEEDBACK, EK_PREVIEW_SOURCE, EK_REPLACE_FONT, EK_SET_APP_MODE, EK_VANILLA_TRANSPORT } from "./app/constants/ek.constant";
import { handleNotify, notify } from "@bridged.xyz/design-sdk/lib/figma";
import { makeApp } from "./flutter/make/app.make";
import { ImageRepositories } from "./assets-repository";
import { insertMaterialIcon } from "./assets-repository/icons-generator";
import { makeVanilla } from "./vanilla";
import { ReflectFrameNode } from "@bridged.xyz/design-sdk/lib/nodes";
import { replaceAllTextFontInFrame } from "./tool-box/manipulate/font-replacer";


let parentNodeId: string;
let layerName = false;
let appMode: number = 0
export let rawNode: SceneNode;
export let targetNodeId: string

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


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function run() {

    console.clear()
    console.warn('log cleared. optimized for new build')
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
    parentNodeId = rawNode.parent?.id ?? "";
    targetNodeId = rawNode.id

    // FIXME
    const safeParent = rawNode.parent as any
    const convertedSelection = convertIntoReflectNode(
        rawNode,
        safeParent
    );

    // if converted node returned nothing
    if (!convertedSelection) {
        figma.notify('not a valid selection. this node is ignored with name : "//@ignore"')
        return
    }


    //#region  run linter
    if (appMode == 2) {
        const feedbacks = runLints(convertedSelection)
        console.warn(feedbacks)
        figma.ui.postMessage({
            type: EK_LINT_FEEDBACK,
            data: feedbacks
        });
    }
    //#endregion

    // region make vanilla
    if (appMode == 3) {
        const globalizatoinScreen = makeVanilla(convertedSelection as ReflectFrameNode)
        const vanillaTransportableImageRepository = await globalizatoinScreen.repository.makeTransportable()
        figma.ui.postMessage({
            type: EK_IMAGE_ASSET_REPOSITORY_MAP,
            data: vanillaTransportableImageRepository
        })
        figma.ui.postMessage({
            type: EK_VANILLA_TRANSPORT,
            data: globalizatoinScreen
        })
    }
    // endregion


    if (appMode == 0) {
        const buildResult = buildApp(convertedSelection);

        // host images
        const transportableImageAssetRepository = await ImageRepositories.current.makeTransportable()
        figma.ui.postMessage({
            type: EK_IMAGE_ASSET_REPOSITORY_MAP,
            data: transportableImageAssetRepository
        })



        const widget = buildResult.widget;
        const app = makeApp({
            widget: widget,
            scrollable: buildResult.scrollable
        })

        figma.ui.postMessage({
            type: EK_GENERATED_CODE_PLAIN,
            data: {
                code: widget.build().finalize(),
                app: app.build().finalize(),
            },
        });
    }


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
    // region
    // notify ui that the computing process has been started.
    // use this for when displaying loading indicator etc.. for general purpose.
    figma.ui.postMessage({
        type: EK_COMPUTE_STARTED,
        data: {
            mode: appMode
        }
    });
    // endregion
    run();
});

// efficient? No. Works? Yes.
// todo pass data instead of relying in types
figma.ui.onmessage = async (msg) => {
    console.log('event received', msg)
    handleNotify(msg)

    if (msg.type == EK_SET_APP_MODE) {
        appMode = msg.data
        console.log(`app mode set event recieved, now setting as ${appMode}`)
    }

    else if (msg.type == EK_FOCUS_REQUEST) {
        const target = figma.getNodeById(msg.data.id) as SceneNode
        figma.currentPage.selection = [target];
        figma.viewport.scrollAndZoomIntoView([target]);
    }

    else if (msg.type == EK_CREATE_ICON) {
        const icon_key = msg.data.key
        const svgData = msg.data.svg
        const inserted = insertMaterialIcon(icon_key, svgData)
        figma.viewport.scrollAndZoomIntoView([inserted])
    }

    else if (msg.type == EK_REPLACE_FONT) {
        if (rawNode.type == "FRAME") {
            const font = "Roboto"
            await replaceAllTextFontInFrame(rawNode, font)
            figma.notify(`successfuly changed font to ${font}`)
        } else {
            figma.notify('cannot replace font of non-frame node')
        }
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