import React, { useEffect } from "react";
import { PluginSdk } from "@plugin-sdk/app";

export function ConnectedScreen() {
  useEffect(() => {
    // minimize the window, disable the resizing knob
    PluginSdk.resizeHost({
      width: 200,
      height: 68,
    });
    // disable resizing knob
    return () => {
      // TODO: restore size
      PluginSdk.resizeHost({
        width: 300,
        height: 500,
      });
      // enable back resizing knob
    };
  }, []);

  return <button>close</button>;
}
