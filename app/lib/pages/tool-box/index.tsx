import React from "react";
import Button from "@material-ui/core/Button";
import { PluginSdk } from "@plugin-sdk/app";

export function ToolboxScreen(props) {
  const hideAllExceptText = (e) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "hide-all-except",
          data: { except: "TEXT" },
        },
      },
      "*"
    );
  };

  const hideAllOnlyText = (e) => {
    parent.postMessage(
      { pluginMessage: { type: "hide-all-only", data: { only: "TEXT" } } },
      "*"
    );
  };

  const onClickRandomize = (e) => {
    parent.postMessage({ pluginMessage: { type: "randomize-selection" } }, "*");
  };

  const onClickOpenConsole = (e) => {
    PluginSdk.openUri("https://console.grida.co/");
  };

  return (
    <div>
      <p>dev tools</p>
      <Button variant="outlined">font replacer</Button>
      <Button onClick={hideAllExceptText}>hide all except text</Button>
      <Button onClick={hideAllOnlyText}>hide only text</Button>
      <Button onClick={onClickRandomize}>randomize</Button>
      <Button onClick={onClickOpenConsole}>open in console</Button>
    </div>
  );
}
