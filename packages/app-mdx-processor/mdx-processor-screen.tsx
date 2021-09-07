import React, { useEffect, useState } from "react";
import { CodeBox } from "@ui/codebox";
import { useSingleSelection } from "plugin-app";
import { fromApp, MdxParsedResponse, ParseMdxRequest } from "./__plugn/event";

export function MdxProcessorScreen() {
  const [mdx, setMdx] = useState("");
  const selection = useSingleSelection();

  const onMessage = (ev) => {
    const msg = ev.data.pluginMessage;
    switch (msg.type) {
      case "parse-mdx-from-frame-result":
        (msg.data as MdxParsedResponse) && setMdx(msg.data.mdx);
    }
  };

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return function cleaup() {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    if (selection) {
      fromApp({
        type: "request-parse-mdx-from-frame",
        frame: selection.id,
      });
    }
  }, [selection]);

  return (
    <>
      <p>select a frame that contains mdx content.</p>
      <br />
      <CodeBox language={"mdx"} code={mdx} />
    </>
  );
}
