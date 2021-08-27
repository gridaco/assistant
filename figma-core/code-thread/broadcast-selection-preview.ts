import { EK_PREVIEW_SOURCE } from "@core/constant/ek.constant";

/**
 * extracts the png image of selection, broadcasts to listeners.
 * @todo - only broadcast when required.
 * @param selection
 */
export function broadcastSelectionPreview(selection: SceneNode) {
  selection
    .exportAsync({
      format: "PNG",
      contentsOnly: true,
      constraint: {
        type: "HEIGHT",
        value: 250,
      },
    })
    .then((d) => {
      figma.ui.postMessage({
        type: EK_PREVIEW_SOURCE,
        data: {
          source: d,
          name: selection.name,
        },
      });
    });
}
