import React, { useRef, useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { AppSkeleton } from "@ui/skeleton";

ReactDOM.render(
  <LiteHostedAppConnector />,
  document.getElementById("react-page")
);

function LiteHostedAppConnector() {
  const frame = useRef<HTMLIFrameElement>();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (frame) {
      window.addEventListener("message", (event) => {
        console.log("event recievd from lite-fima-app", event.data);
        if (event.data == "plugin-app-initialized") {
          setInitialized(true);
        }

        if ("pluginMessage" in event.data) {
          if (
            "pluginId" in event.data ||
            event.data.pluginMessage.type === "response"
          ) {
            frame.current.contentWindow.postMessage(event.data, "*");
          } else {
            parent.postMessage(
              {
                ...event.data,
                "message-transport": true,
              },
              "*"
            );
          }
        }
      });
    }
  }, [frame]);

  const _host = "http://localhost:3000";

  // use opacity
  // if (initialized) => show iframe only
  // eles, show iframe with opacity 0 & enable AppSkeleton
  // <AppSkeleton/>

  return (
    <>
      {!initialized && <AppSkeleton />}
      <iframe
        ref={frame}
        style={{ opacity: `${initialized ? 1 : 0}` }}
        // style={{ zoom: "80%" }}
        width="100%"
        height="100%"
        sandbox="allow-scripts allow-same-origin"
        frameBorder="0"
        allowFullScreen
        src={`${_host}/?platform=figma`}
      ></iframe>
    </>
  );
}
