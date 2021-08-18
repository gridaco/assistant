import { addMessageHandler } from "./message-handler";
import { EK_FOCUS_REQUEST } from "app/lib/constants/ek.constant";
import { PluginSdkService } from "@plugin-sdk/service";

const defaultMessageHandler = async (
  msg: { type: string; data: any } | any
) => {
  {
    const generalHandlingResult = PluginSdkService.handle(msg);
    // if event is handled by general event handler, no additional handling is required.
    if (generalHandlingResult) {
      return;
    }

    const type = msg.type;
    const data = msg.data;

    if (type == EK_FOCUS_REQUEST) {
      const target = figma.getNodeById(msg.data.id) as SceneNode;
      figma.currentPage.selection = [target];
      figma.viewport.scrollAndZoomIntoView([target]);
    }
  }
};

export function __register__() {
  addMessageHandler(defaultMessageHandler);
}
