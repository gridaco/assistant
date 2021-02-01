import React, { useEffect } from "react";
import Axios from "axios";
import {
  PLC_REMOTE_API_REQ,
  PLC_REMOTE_API_RES,
  PLUGIN_SDK_NAMESPACE_BASE_TOKEN,
  PLUGIN_SDK_NS_REMOTE_API,
  TransportPluginEvent,
} from "../events";
import { NetworkRequest } from "../interfaces/remote-api/remote-api.requests";
import { PluginSdk } from "../plugin-app-sdk";

export function PluginApp(props: { children: any }) {
  useEffect(() => {
    PluginSdk.initializeWindow(parent);
    window.addEventListener("message", (ev: MessageEvent) => {
      const message: TransportPluginEvent = ev.data.pluginMessage;

      // region validate
      if (!message) {
        return;
      }

      if (!message.namespace) {
        return;
      }

      if (!message.namespace.includes(PLUGIN_SDK_NAMESPACE_BASE_TOKEN)) {
        return;
      }
      // endregion validate

      PluginSdk.handle(message);

      if (message.namespace == PLUGIN_SDK_NS_REMOTE_API) {
        // call remote request
        const requestManifest = message.data as NetworkRequest;
        Axios.request({
          method: requestManifest.method,
          url: requestManifest.url,
          data: requestManifest.data,
          headers: requestManifest.headers,
        })
          .then((r) => {
            networkResponseToCodeThread(
              window,
              requestManifest.requestId,
              r.data
            );
          })
          .catch((e) => {
            networkResponseToCodeThread(
              window,
              requestManifest.requestId,
              null,
              e
            );
          });
      }
    });

    console.info("PluginApp initiallized");
  }, []);

  return <div>{props.children}</div>;
}

function networkResponseToCodeThread(
  window: Window,
  requestId: string,
  data: any,
  error: any = undefined
) {
  if (error) {
    window.postMessage(
      {
        pluginData: {
          type: PLC_REMOTE_API_RES,
          data: {
            requestId: requestId,
            error: error,
          },
        },
      },
      "*"
    );
    return;
  }

  window.postMessage(
    {
      pluginData: {
        type: PLC_REMOTE_API_RES,
        data: {
          requestId: requestId,
          ...data,
        },
      },
    },
    "*"
  );
}
