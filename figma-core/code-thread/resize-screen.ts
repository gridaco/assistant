import { addEventHandler } from "./message-handler";

export function __register__() {
  addEventHandler("resize", (msg) => {
    const MIN_WIDTH = 320;
    const MIN_HEIGHT = 600;
    const w = Math.max(MIN_WIDTH, msg.size.w);
    const h = Math.max(MIN_HEIGHT, msg.size.h);
    figma.ui.resize(w, h);
    figma.clientStorage.setAsync("size", { w: w, h: h }).catch((err) => {}); // save size
  });
}
