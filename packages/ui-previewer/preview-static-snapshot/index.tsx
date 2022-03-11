import React, { useState, useEffect } from "react";
import { EK_CURRENT_SELECTION_PREVIEW_SOURCE_CHANGED } from "@core/constant/ek.constant";
import { PluginSdk } from "@plugin-sdk/app";
import { QuickImageExportPreset } from "@plugin-sdk/core";
import { PreviewSessionCache } from "../cache";

export interface StaticPreviewProps {
  type: "static";
  data?: Uint8Array;
  name?: string;
  /**
   * show image of.
   */
  of?: string;
  fetchingConfig?: QuickImageExportPreset;
}

export function StaticPreview(props: StaticPreviewProps) {
  const [data, setData] = useState(props.data);
  const [name, setName] = useState(props.name);

  const preview_selection_change_broadcast_event_listener = (
    ev: MessageEvent
  ) => {
    const msg = ev.data.pluginMessage;
    if (msg && msg.type == EK_CURRENT_SELECTION_PREVIEW_SOURCE_CHANGED) {
      setName(msg.data.name);
      setData(msg.data.source);
    }
  };

  useEffect(() => {
    if (!props.of) {
      window.addEventListener(
        "message",
        preview_selection_change_broadcast_event_listener
      );
      return () => {
        window.removeEventListener(
          "message",
          preview_selection_change_broadcast_event_listener
        );
      };
    } else {
      const cachestore = new PreviewSessionCache(
        props.of,
        props.fetchingConfig
      );
      const cache = cachestore.getCache();
      if (cache) {
        setData(cache);
      }

      PluginSdk.getNodeImage({
        id: props.of,
        opt: props.fetchingConfig ?? "small",
      }).then((data) => {
        cachestore.setCache(data.data);
        setData(data.data);
      });
    }
  }, []);

  function makeUrl() {
    if (data) {
      // @ts-ignore blob
      var blob = new Blob([data], { type: "image/png" });
      var url = URL.createObjectURL(blob);
      return url;
    }
  }

  return (
    <img
      className="render"
      alt={name}
      src={makeUrl()}
      width="100%"
      height="200px"
    />
  );
}
