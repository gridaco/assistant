import React from "react";
import App from "app/lib/main";
import {
  initializeTargetPlatform,
  TargetPlatform,
} from "@bridged.xyz/design-sdk/lib/platform";
import * as ReactDOM from "react-dom";

// initialize platform as figma
initializeTargetPlatform(TargetPlatform.figma);

ReactDOM.render(<App />, document.getElementById("react-page"));
