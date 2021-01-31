import { NS_FILE_ROOT_METADATA } from "../../../constants/ns.constant";
import {
  PLUGIN_SDK_EK_BATCH_META_UPDATE,
  PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META,
  PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META,
  PLUGIN_SDK_EK_SIMPLE_NOTIFY,
  PLUGIN_SDK_NAMESPACE_BASE_TOKEN,
  PLUGIN_SDK_NS_META_API,
  PLUGIN_SDK_NS_NOTIFY_API,
  PLUGIN_SDK_NS_REMOTE_API,
  PLUGIN_SDK_NS_RESPONSE_ALL,
  TransportPluginEvent,
} from "../events";
import {
  BatchMetaFetchRequest,
  BatchMetaUpdateRequest,
  NodeMetaFetchRequest,
} from "../interfaces/meta/meta.requests";
import { NotifyRequest } from "../interfaces/notify/notify.requests";

interface HanderProps<T = any> {
  id: string;
  key: string;
  data: T;
}

export class PluginSdkServer {
  static handle(event: TransportPluginEvent): boolean {
    console.info(
      `start handling event from PluginSdkServer with event - `,
      event
    );

    // validate the givven event
    if (!event.namespace) {
      return;
    }
    if (!event.namespace.includes(PLUGIN_SDK_NAMESPACE_BASE_TOKEN)) {
      console.warn(
        `the event is passed to PluginSdkServer, but the namespace or structure does not meet the standard interface. the givven event was - `,
        event
      );
      return false;
    }

    const handerProps: HanderProps = {
      id: event.id,
      key: event.key,
      data: event.data,
    };
    // meta
    if (event.namespace == PLUGIN_SDK_NS_META_API) {
      handleMetaEvent(handerProps);
      return true;
    }

    // remote api call
    else if (event.namespace == PLUGIN_SDK_NS_REMOTE_API) {
      handleRemoteApiEvent(handerProps);
      return true;
    }

    // notify
    else if (event.namespace == PLUGIN_SDK_NS_NOTIFY_API) {
      handleNotify(handerProps);
      return true;
    }

    return true;
  }

  static resolveRequest(requestId: string, data: any = undefined) {
    // TODO - send response event
  }
}

function handleMetaEvent(props: HanderProps) {
  if (props.key == PLUGIN_SDK_EK_BATCH_META_UPDATE) {
    const d = props.data as BatchMetaUpdateRequest;
    figma.root.setSharedPluginData(NS_FILE_ROOT_METADATA, d.key, d.value);
    figma.notify("metadata updated", { timeout: 1 });
  } else if (props.key == PLUGIN_SDK_EK_REQUEST_FETCH_ROOT_META) {
    const d = props.data as BatchMetaFetchRequest;
    const fetched = figma.root.getSharedPluginData(
      NS_FILE_ROOT_METADATA,
      d.key
    );
    console.log(`fetched root metadata for key ${d.key} is.`, fetched);
    response(props.id, fetched);
  } else if (props.key == PLUGIN_SDK_EK_REQUEST_FETCH_NODE_META) {
    const request: NodeMetaFetchRequest = props.data;
    const data = figma
      .getNodeById(request.id)
      .getSharedPluginData(request.namespace, request.key);
    try {
      const json = JSON.parse(data);
      return response(props.id, json);
    } catch (_) {
      return response(props.id, undefined, _);
    }
  }
}
function handleRemoteApiEvent(props: HanderProps) {}

export function handleNotify(props: HanderProps<NotifyRequest>) {
  if (props.key == PLUGIN_SDK_EK_SIMPLE_NOTIFY) {
    figma.notify(props.data.message, {
      timeout: props.data.duration ?? 1,
    });
  }
  response(props.id, true);
}

function response<T = any>(
  requestId: string,
  data: T,
  error: Error | undefined = undefined
): boolean {
  figma.ui.postMessage(<TransportPluginEvent>{
    id: requestId,
    namespace: PLUGIN_SDK_NS_RESPONSE_ALL,
    type: "response",
    error: error,
    data: data,
  });

  return true;
}
