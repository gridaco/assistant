///
/// To optimize this package, we don't import any other dependency.
/// but for a reference, please add import statement below with commented.
///
/*import {*/
/* TransportPluginEvent,*/
/* PLUGIN_SDK_EK_BROWSER_OPEN_URI,*/
/*} from "@plugin-sdk/core";*/

interface TransportPluginEvent<T = any> {
  namespace: string;
  key: string;
  data: T;
  origin: "app" | "server";
  type: "response" | "request";
  error?: Error;
  id: string;
}

export function handle(payload: TransportPluginEvent) {
  console.log("handling proxy request from hosted app.", payload);

  // PLUGIN_SDK_EK_BROWSER_OPEN_URI
  if (payload.key == "assistant/browser-api/open-uri") {
    open(payload.data.uri);
  }
}
