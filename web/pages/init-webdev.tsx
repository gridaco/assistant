import React, { useEffect } from "react";
import App from "app/lib/main";
import { PluginSdkService } from "@plugin-sdk/service";
import { TargetPlatform } from "@plugin-sdk/core";

export default function InitWebdevTriggerPage() {
  useEffect(() => {
    window.addEventListener("message", (rev) => {
      if (rev.data.pluginMessage) {
        PluginSdkService.handle(rev.data.pluginMessage);
      }
    });
  }, []);

  return <App platform={TargetPlatform.webdev} />;
}
