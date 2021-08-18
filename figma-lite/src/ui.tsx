import React from "react";
import { TargetPlatform } from "app/lib/utils/plugin-init/init-target-platform";
import * as ReactDOM from "react-dom";

ReactDOM.render(
  <App platform={TargetPlatform.figma} />,
  document.getElementById("react-page")
);

function App(props: { platform: TargetPlatform }) {
  return (
    <iframe
      width="100%"
      height="100%"
      sandbox="allow-scripts allow-same-origin"
      frameBorder="0"
      allowFullScreen
      src="http://localhost:3000/"
    ></iframe>
  );
}
