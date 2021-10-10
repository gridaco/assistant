import React, { useRef, useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { AppSkeleton } from "@ui/skeleton";
import { handle } from "./handle-proxy-requests";
import { useSetRecoilState } from "recoil";

ReactDOM.render(
  <LiteHostedAppConnector />,
  document.getElementById("react-page")
);

// ReactDOM.render(<Resizable />, document.getElementById("main"));

export function Resizable() {
  const resizableRef = useRef<SVGSVGElement>();

  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    console.log(size.w);
  }, [size]);

  function resizeWindow(e) {
    setSize({
      w: Math.max(50, Math.floor(e.clientX + 5)),
      h: Math.max(50, Math.floor(e.clientY + 5)),
    });

    parent.postMessage({ pluginMessage: { type: "resize", size: size } }, "*");
  }

  return (
    <svg
      id={"resize-knob"}
      ref={resizableRef}
      onPointerDown={(e) => {
        resizableRef.current.onpointermove = resizeWindow;
        resizableRef.current.setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        resizableRef.current.onpointermove = null;
        resizableRef.current.releasePointerCapture(e.pointerId);
      }}
      style={{
        position: "fixed",
        right: "1px",
        bottom: "2px",
        cursor: "nw-resize",
      }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16 0V16H0L16 0Z" fill="white" />
      <path d="M6.22577 16H3L16 3V6.22576L6.22577 16Z" fill="#8C8C8C" />
      <path
        d="M11.8602 16H8.63441L16 8.63441V11.8602L11.8602 16Z"
        fill="#8C8C8C"
      />
    </svg>
  );
}

export function LiteHostedAppConnector() {
  const frame = useRef<HTMLIFrameElement>();
  const resizableRef = useRef<SVGSVGElement>();

  const [initialized, setInitialized] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (frame) {
      window.addEventListener("message", (event) => {
        if (event.data === "plugin-app-initialized") {
          setInitialized(true);
          return;
        } else if ("pluginMessage" in event.data) {
          if (event.data.pluginMessage.__proxy_request_from_hosted_plugin) {
            handle(event.data.pluginMessage);
            return;
          }
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

  const _host =
    process.env.NODE_ENV === "production"
      ? "https://assistant-serve.grida.co"
      : "http://localhost:3303";

  // use opacity
  // if (initialized) => show iframe only
  // eles, show iframe with opacity 0 & enable AppSkeleton
  // <AppSkeleton/>
  return (
    <>
      {/* FIXME: */}
      {/* <Resizable /> */}
      <div
        id="frame-host"
        style={{
          width: "100%",
          height: "100%",
          overflowY: "clip",
        }}
      >
        <iframe
          id="remote-host"
          ref={frame}
          style={{ opacity: `${initialized ? 1 : 0}` }}
          // style={{ zoom: "80%" }} // use this to zoom inner content
          width="100%"
          height={`${initialized ? "100%" : "0px"}`}
          sandbox="allow-scripts allow-same-origin allow-popups"
          frameBorder="0"
          allowFullScreen
          src={`${_host}/init-figma`} //?platform=figma
        />
        <AppSkeleton mount={!initialized} />
      </div>
    </>
  );
}
