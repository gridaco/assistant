import { NS_FILE_ROOT_METADATA } from "../../../constants/ns.constant";
import {
  BatchMetaFetchQuery,
  BatchMetaOperationQuery,
} from "../../../screens/tool-box/batch-meta-editor";
import {
  BasePluginEvent,
  PLUGIN_SDK_EK_BATCH_META_UPDATE,
  PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  PLUGIN_SDK_NAMESPACE_BASE_TOKEN,
  PLUGIN_SDK_NS_META_API,
  PLUGIN_SDK_NS_NOTIFY_API,
} from "../events";
import { NotifyRequest } from "../interfaces/notify/notify.requests";

export class PluginSdkServer {
  static handle(event: BasePluginEvent): boolean {
    // console.info(
    //   `start handling event from PluginSdkServer with event - `,
    //   event
    // );

    // validate the givven event
    if (
      !event.namespace ||
      !event.namespace.includes(PLUGIN_SDK_NAMESPACE_BASE_TOKEN)
    ) {
      console.warn(
        `the event is passed to PluginSdkServer, but the namespace or structure does not meet the standard interface. the givven event was - `,
        event
      );
      return false;
    }

    // meta
    if (event.namespace == PLUGIN_SDK_NS_META_API) {
      handleMetaEvent(event.key, event.data);
    }

    // remote api call
    if (event.namespace == PLUGIN_SDK_NS_META_API) {
      handleRemoteApiEvent(event.key, event.data);
    }

    // notify
    if (event.namespace == PLUGIN_SDK_NS_NOTIFY_API) {
      handleNotify(event.key, event.data);
    }

    return true;
  }
}

function handleMetaEvent(key: string, data: any) {
  if (key == PLUGIN_SDK_EK_BATCH_META_UPDATE) {
    const d = data as BatchMetaOperationQuery;
    figma.root.setSharedPluginData(NS_FILE_ROOT_METADATA, d.key, d.value);
    figma.notify("metadata updated", { timeout: 1 });
  } else if (key == PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META) {
    const d = data as BatchMetaFetchQuery;
    const fetched = figma.root.getSharedPluginData(
      NS_FILE_ROOT_METADATA,
      d.key
    );
    console.log(`fetched root metadata for key ${d.key} is.`, fetched);
    figma.ui.postMessage({
      type: "__response__",
      data: fetched,
    });
  }
}
function handleRemoteApiEvent(key: string, data: any) {}

export function handleNotify(key: string, data: NotifyRequest) {
  if (key == PLUGIN_SDK_EK_SIMPLE_NOTIFY) {
    figma.notify(data.message, {
      timeout: data.duration ?? 1,
    });
  }
}
