import React from "react";

import App from "app/lib/main";
import { useEffect } from "react";
import { PluginSdkService } from "@plugin-sdk/service";
import { TargetPlatform } from "@plugin-sdk/core";
import { useRouter } from "next/router";
import { get_target_platform_from_query } from "../utils/platform-init-query";

export default function IndexPage() {
  const router = useRouter();

  const platform = get_target_platform_from_query(
    router.query["platform"] as string
  );

  useEffect(() => {
    window.addEventListener("message", (rev) => {
      if (platform == TargetPlatform.webdev) {
        if (rev.data.pluginMessage) {
          PluginSdkService.handle(rev.data.pluginMessage);
        }
      }
    });
  }, []);

  return <App platform={platform} />;
}
