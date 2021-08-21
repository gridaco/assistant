import React from "react";
import type { AppProps } from "next/app";
import App from "app/lib/main";
import { TargetPlatform } from "app/lib/utils/plugin-init/init-target-platform";
import { useEffect } from "react";
import { PluginSdkService } from "@plugin-sdk/service";
import { useRouter } from "next/router";

function WebApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const platform = _get_target_platform_from_query(
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

  if (!router.query["platform"]) {
    return <></>;
  }

  return <App platform={platform} />;
}
export default WebApp;

function _get_target_platform_from_query(platform: string) {
  switch (platform) {
    case "figma":
      return TargetPlatform.figma;
    default:
      // if non passed, it's an access from browser as development mode
      return TargetPlatform.webdev;
  }
}
