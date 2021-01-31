import {
  BasePluginEvent,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  PLUGIN_SDK_NS_NOTIFY_API,
} from "../events";
import { NotifyRequest } from "../interfaces/notify/notify.requests";

export class PluginSdk {
  static window: Window;
  static initializeWindow(window: Window) {
    this.window = window;
  }
  static get(params: any) {}

  static post(params: any) {}

  static setMetadata(
    nodeId: string,
    namespace: string | undefined = undefined,
    key: string,
    value: string
  ) {}

  static getMetadata(
    nodeId: string,
    namespace: string | undefined = undefined,
    key: string
  ) {}

  // region user feedbacks
  static notify(message: string, duration?: number) {
    postMessage({
      namespace: PLUGIN_SDK_NS_NOTIFY_API,
      origin: "app",
      key: PLUGIN_SDK_EK_SIMPLE_NOTIFY,
      data: <NotifyRequest>{
        message: message,
        duration: duration,
      },
    });
  }

  static notifyCopied() {
    this.notify("Copied to clipboard", 1);
  }
  // endregion user feedbacks
}

function postMessage(event: BasePluginEvent) {
  PluginSdk.window.postMessage(
    {
      pluginMessage: event,
    },
    "*"
  );
}
