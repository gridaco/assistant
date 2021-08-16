import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import Axios from "axios";
import {
  PLC_REMOTE_API_RES,
  __PLUGIN_SDK_NAMESPACE_BASE_TOKEN,
  PLUGIN_SDK_NS_GENERAL_STATE_DATA,
  PLUGIN_SDK_NS_REMOTE_API,
  TransportPluginEvent,
} from "../events";
import { NetworkRequest } from "../interfaces/remote-api/remote-api.requests";
import { PluginSdk } from "../plugin-app-sdk";
import { currentlySelectedPrimaryNodeId } from "./states/canvas";
import {
  initializeTargetPlatform,
  TargetPlatform,
} from "../../plugin-init/init-target-platform";

export function PluginApp(props: { platform: TargetPlatform; children: any }) {
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

      if (!message.namespace.includes(__PLUGIN_SDK_NAMESPACE_BASE_TOKEN)) {
        return;
      }
      // endregion validate

      registerPluginSdkHandler(message);
      registerPluginGlobalStateHandler(message);
      registerPluginRemoteCallHandler(message);
    });

    // init platform
    initializeTargetPlatform(props.platform).then(() => {
      console.info("PluginApp initiallized");
    });
  }, []);

  return <div>{props.children}</div>;
}

function registerPluginSdkHandler(message: TransportPluginEvent) {
  PluginSdk.handle(message);
}

/**
 * registers global state handler managed by plugin. such like current selection.
 */
function registerPluginGlobalStateHandler(message: TransportPluginEvent) {
  if (message.namespace == PLUGIN_SDK_NS_GENERAL_STATE_DATA) {
    if (message.key == "general.canvas.selection-change") {
      // update selection change
      const setCrrentSelection = useSetRecoilState(
        currentlySelectedPrimaryNodeId
      );
      // ...
    }
  }
}

/**
 * registers handler for remote http(s) call
 */
function registerPluginRemoteCallHandler(message: TransportPluginEvent) {
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
        networkResponseToCodeThread(window, requestManifest.requestId, r.data);
      })
      .catch((e) => {
        networkResponseToCodeThread(window, requestManifest.requestId, null, e);
      });
  }
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
