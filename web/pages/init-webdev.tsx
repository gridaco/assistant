import React, { useEffect } from "react";
import { PluginSdkService } from "@plugin-sdk/service";
import App from "app/lib/main";
import { TargetPlatform } from "app/lib/utils/plugin-init/init-target-platform";

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
