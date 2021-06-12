export async function showUI() {
  // communicates with ui.html
  // load plugin with confugured w/h
  // restore previous size

  const MIN_WIDTH = 320;
  const MIN_HEIGHT = 600;

  let size: { w: number; h: number } = { w: 375, h: 812 };
  try {
    const savedsize: {
      w: number;
      h: number;
    } = await figma.clientStorage.getAsync("size");
    savedsize && (size = savedsize);
  } catch (_) {}

  figma.ui.onmessage = (msg) => {
    switch (msg.type) {
      case "resize":
        const w = Math.max(MIN_WIDTH, msg.size.w);
        const h = Math.max(MIN_HEIGHT, msg.size.h);
        figma.ui.resize(w, h);
        figma.clientStorage.setAsync("size", { w: w, h: h }).catch((err) => {}); // save size
        break;
    }
  };

  figma.showUI(__html__, { width: size.w, height: size.h });
}
