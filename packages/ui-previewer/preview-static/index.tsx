import { Typography, CircularProgress, Fade } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { EK_CURRENT_SELECTION_PREVIEW_SOURCE_CHANGED } from "@core/constant/ek.constant";
import EmptyIndicatorIcon from "@assistant/icons/empty-indicator-icon";
import "../preview.css";
import { PluginSdk } from "@plugin-sdk/app";
import { QuickImageExportPreset } from "@plugin-sdk/core";
import { PreviewSessionCache } from "../cache";

interface Props {
  auto?: boolean;
  data?: Uint8Array;
  empty?: JSX.Element;
  name?: string;
  /**
   * the background color
   * @deprecated not implemented
   */
  background?: string;
  type?: string;
  /**
   * show image of.
   */
  of?: string;
  fetchingConfig?: QuickImageExportPreset;
}

export function Preview(props: Props) {
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
    if (props.auto) {
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
    }

    if (props.of) {
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
      var blob = new Blob([data], { type: "image/png" });
      var url = URL.createObjectURL(blob);
      return url;
    }
  }

  let render = data ? (
    <img
      className="render"
      alt={name}
      src={makeUrl()}
      width="100%"
      height="200px"
    />
  ) : (
    <div className="render">
      <div className="inner-render">
        {props.auto && (
          <>
            {props.empty || (
              <>
                <EmptyIndicatorIcon />
                <Typography className="rendering-notify">
                  Nothing is selected
                </Typography>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="preview">
      <Typography variant="caption">{props.type}</Typography>
      {render}
    </div>
  );
}
