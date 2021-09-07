import { Typography, CircularProgress, Fade } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { EK_PREVIEW_SOURCE } from "@core/constant/ek.constant";
import EmptyIndicatorIcon from "@assistant/icons/empty-indicator-icon";
import "./preview.css";

interface Props {
  auto?: boolean;
  data?: Uint8Array;
  name?: string;
  type?: string;
}

export function Preview(props: Props) {
  const [data, setData] = useState(props.data);
  const [name, setName] = useState(props.name);

  useEffect(() => {
    if (props.auto) {
      window.addEventListener("message", (ev: MessageEvent) => {
        const msg = ev.data.pluginMessage;
        if (msg && msg.type == EK_PREVIEW_SOURCE) {
          setName(msg.data.name);
          setData(msg.data.source);
        }
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
        <EmptyIndicatorIcon />
        <Typography className="rendering-notify">
          Nothing is selected
        </Typography>
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
