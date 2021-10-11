import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  PLC_REMOTE_API_RES,
  __PLUGIN_SDK_NAMESPACE_BASE_TOKEN,
  PLUGIN_SDK_NS_GENERAL_STATE_DATA,
  PLUGIN_SDK_NS_REMOTE_API,
  TransportPluginEvent,
} from "@plugin-sdk/core/events";
import { NetworkRequest } from "@plugin-sdk/core";
import { PluginSdk } from "@plugin-sdk/app";
import type { TargetPlatform } from "@plugin-sdk/core";
import { initialize as cid_initialize, client_id } from "./client-id";

export function PluginApp(props: {
  platform: TargetPlatform;
  children: any;
  loading?: any;
  onInitialized?: () => void;
}) {
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    console.log("start initializing plugin app...");

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
    PluginSdk.initializeTargetPlatform(props.platform).then(() => {
      const warmup_procs: Promise<any>[] = [];

      // make client id
      warmup_procs.push(cid_initialize());

      Promise.all(warmup_procs).finally(() => {
        console.info("PluginApp initiallized", "cid", client_id);
        parent.postMessage("plugin-app-initialized", "*");
        props.onInitialized?.();
        setBooting(false);
      });
    });
  }, []);

  if (booting) {
    return (
      <>
        {props.loading ? (
          props.loading
        ) : (
          <div
            style={{
              alignItems: "center",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            Loading.. {props.platform} App
          </div>
        )}
      </>
    );
  }

  return <>{props.children}</>;
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
      // const setCrrentSelection = useSetRecoilState(
      //   currentlySelectedPrimaryNodeId
      // );
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
    parent.postMessage(
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

  parent.postMessage(
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
