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

  return <App platform={platform} />;
}
export default WebApp;

function _get_target_platform_from_query(platform: string) {
  switch (platform) {
    case "figma":
      return TargetPlatform.figma;
    case "webdev":
      return TargetPlatform.webdev;
  }
}
