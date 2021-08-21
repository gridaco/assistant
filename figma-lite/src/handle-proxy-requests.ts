import {
  TransportPluginEvent,
  PLUGIN_SDK_EK_BROWSER_OPEN_URI,
} from "@plugin-sdk/core";

export function handle(payload: TransportPluginEvent) {
  console.log("handling proxy request from hosted app.", payload);
  if (payload.key == PLUGIN_SDK_EK_BROWSER_OPEN_URI) {
    open(payload.data.uri);
  }
}
