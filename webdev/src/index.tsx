import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import App from "app/lib/main";
import { PluginSdkService } from "@plugin-sdk/service";
import { TargetPlatform } from "app/lib/utils/plugin-init/init-target-platform";

window.addEventListener("message", (rev) => {
  if (rev.data.pluginMessage) {
    // console.log(rev);
    PluginSdkService.handle(rev.data.pluginMessage);
  }
});

ReactDOM.render(
  <App platform={TargetPlatform.webdev} />,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
