import { addEventHandler } from "./message-handler";

export async function showUI() {
  // communicates with ui.html
  // load plugin with confugured w/h
  // restore previous size

  let size: { w: number; h: number } = { w: 375, h: 812 };
  try {
    const savedsize: {
      w: number;
      h: number;
    } = await figma.clientStorage.getAsync("size");
    savedsize && (size = savedsize);
  } catch (_) {}

  figma.showUI(__html__, { width: size.w, height: size.h });
}
