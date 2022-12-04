import { EK_CURRENT_SELECTION_PREVIEW_SOURCE_CHANGED } from "@core/constant/ek.constant";
import { preset, QuickImageExportPreset } from "@plugin-sdk/core";

/**
 * extracts the png image of selection, broadcasts to listeners.
 * @todo - only broadcast when required.
 * @param selection
 */
export function broadcastSelectionPreview(selection: SceneNode) {
  exportImage(selection).then((d) => {
    figma.ui.postMessage({
      type: EK_CURRENT_SELECTION_PREVIEW_SOURCE_CHANGED,
      data: {
        source: d,
        name: selection.name,
      },
    });
  });
}

export async function exportImage(
  target: SceneNode,
  options?: {
    preset?: QuickImageExportPreset;
  }
): Promise<Uint8Array> {
  const config = preset(options?.preset ?? "small");
  try {
    return await (target as ExportMixin).exportAsync(config);
  } catch (_) {
    console.warn(
      "update required. seems figma started to support `WidgetNode`"
    );
  }
}
