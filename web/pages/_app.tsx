import React from "react";
import type { AppProps } from "next/app";
import App from "app/lib/main";
import { TargetPlatform } from "app/lib/utils/plugin-init/init-target-platform";

function WebApp({ Component, pageProps }: AppProps) {
  return <App platform={TargetPlatform.webdev} />;
}
export default WebApp;
