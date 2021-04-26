import React from "react";
import App from "app/lib/main";
import { TargetPlatform } from "app/lib/utils/plugin-init/init-target-platform";
import * as ReactDOM from "react-dom";

ReactDOM.render(
  <App platform={TargetPlatform.figma} />,
  document.getElementById("react-page")
);
