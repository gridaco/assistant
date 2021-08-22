import { addMessageHandler } from "./message-handler";
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
  }
};

export function __register__() {
  addMessageHandler(defaultMessageHandler);
}
